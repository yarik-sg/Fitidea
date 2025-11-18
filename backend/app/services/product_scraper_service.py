from __future__ import annotations

import re
from typing import Any, Dict, Optional

import httpx
from bs4 import BeautifulSoup
from redis.asyncio import Redis

from app.core.config import settings
from app.services.cache_service import get_cache, set_cache

DEFAULT_TIMEOUT = httpx.Timeout(15.0, connect=5.0)
CACHE_EXPIRE_SECONDS = 60 * 60 * 24


class ProductScraperError(Exception):
    """Raised when scraping fails."""


async def _fetch_html(url: str) -> str:
    async with httpx.AsyncClient(timeout=DEFAULT_TIMEOUT, follow_redirects=True) as client:
        response = await client.get(url, headers={"User-Agent": "FitideaBot/1.0"})
        response.raise_for_status()
        return response.text


def _to_float(value: Any) -> Optional[float]:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)
    try:
        cleaned = re.sub(r"[^0-9.,]", "", str(value)).replace(",", ".")
        return float(cleaned)
    except (ValueError, TypeError):
        return None


def _extract_images(soup: BeautifulSoup) -> list[str]:
    images: list[str] = []
    for tag in soup.find_all("meta", property="og:image"):
        if tag.get("content"):
            images.append(tag["content"])
    for tag in soup.find_all("img"):
        src = tag.get("src") or tag.get("data-src")
        if src and src not in images:
            images.append(src)
    return images[:10]


def _parse_common_fields(soup: BeautifulSoup) -> Dict[str, Any]:
    name = soup.find("meta", property="og:title")
    description = soup.find("meta", property="og:description")
    price_tag = soup.find("meta", property="product:price:amount")
    rating_tag = soup.find("meta", property="product:rating") or soup.find("meta", itemprop="ratingValue")
    reviews_tag = soup.find("meta", itemprop="reviewCount")

    return {
        "name": name["content"] if name and name.get("content") else None,
        "description": description["content"] if description and description.get("content") else None,
        "price": _to_float(price_tag.get("content") if price_tag else None),
        "rating": _to_float(rating_tag.get("content") if rating_tag else None),
        "reviews_count": int(_to_float(reviews_tag.get("content"))) if reviews_tag else None,
        "images": _extract_images(soup),
    }


async def _scrape_generic(url: str, source: str) -> Dict[str, Any]:
    html = await _fetch_html(url)
    soup = BeautifulSoup(html, "html.parser")
    payload = _parse_common_fields(soup)
    payload.update({"url": url, "source": source})
    return payload


async def _scrape_decathlon(url: str) -> Dict[str, Any]:
    html = await _fetch_html(url)
    soup = BeautifulSoup(html, "html.parser")
    payload = _parse_common_fields(soup)
    brand_tag = soup.find("meta", property="product:brand")
    category_tag = soup.find("meta", property="product:category")
    payload.update(
        {
            "brand": brand_tag.get("content") if brand_tag else None,
            "category": category_tag.get("content") if category_tag else None,
            "url": url,
            "source": "Decathlon",
        }
    )
    return payload


async def _scrape_myprotein(url: str) -> Dict[str, Any]:
    html = await _fetch_html(url)
    soup = BeautifulSoup(html, "html.parser")
    payload = _parse_common_fields(soup)
    brand = soup.find("meta", property="product:brand")
    nutrition_block = soup.find("div", class_=re.compile("nutrition|macros", re.IGNORECASE))
    payload.update(
        {
            "brand": brand.get("content") if brand else "MyProtein",
            "category": "nutrition",
            "nutrition": nutrition_block.get_text(strip=True) if nutrition_block else None,
            "url": url,
            "source": "MyProtein",
        }
    )
    return payload


async def _scrape_prozis(url: str) -> Dict[str, Any]:
    html = await _fetch_html(url)
    soup = BeautifulSoup(html, "html.parser")
    payload = _parse_common_fields(soup)
    payload.update({"brand": "Prozis", "source": "Prozis", "url": url})
    return payload


async def _scrape_gymshark(url: str) -> Dict[str, Any]:
    html = await _fetch_html(url)
    soup = BeautifulSoup(html, "html.parser")
    payload = _parse_common_fields(soup)
    payload.update({"brand": "Gymshark", "source": "Gymshark", "url": url, "category": "vêtements"})
    return payload


async def _scrape_amazon_with_serpapi(url: str) -> Dict[str, Any]:
    if not settings.serpapi_key:
        raise ProductScraperError("SERPAPI_KEY is not configured")

    params = {
        "api_key": settings.serpapi_key,
        "engine": "amazon_product",
        "product_url": url,
    }
    async with httpx.AsyncClient(timeout=DEFAULT_TIMEOUT) as client:
        response = await client.get("https://serpapi.com/search.json", params=params)
        response.raise_for_status()
        data = response.json()

    return {
        "name": data.get("title"),
        "brand": data.get("brand"),
        "category": data.get("category"),
        "price": _to_float(data.get("price")),
        "rating": _to_float(data.get("rating")),
        "reviews_count": data.get("reviews"),
        "images": data.get("images") or data.get("thumbnails"),
        "description": data.get("description"),
        "url": url,
        "source": "Amazon",
    }


async def _scrape_amazon(url: str) -> Dict[str, Any]:
    try:
        return await _scrape_amazon_with_serpapi(url)
    except Exception:
        html = await _fetch_html(url)
        soup = BeautifulSoup(html, "html.parser")
        payload = _parse_common_fields(soup)
        payload.update({"source": "Amazon", "url": url})
        return payload


async def scrape_product(url: str, source: str, redis: Optional[Redis] = None) -> Dict[str, Any]:
    cache_key = f"product:{source}:{url}"
    cached = await get_cache(redis, cache_key)
    if cached:
        return cached

    normalized_source = (source or "").lower()
    if "decathlon" in normalized_source:
        scraper = _scrape_decathlon
    elif "myprotein" in normalized_source:
        scraper = _scrape_myprotein
    elif "prozis" in normalized_source:
        scraper = _scrape_prozis
    elif "amazon" in normalized_source:
        scraper = _scrape_amazon
    elif "gymshark" in normalized_source:
        scraper = _scrape_gymshark
    else:
        scraper = _scrape_generic

    result = await scraper(url)
    await set_cache(redis, cache_key, result, expire_seconds=CACHE_EXPIRE_SECONDS)
    return result
