"""Async scraping utilities for gym details and listings."""
from __future__ import annotations

import asyncio
import json
from datetime import datetime
from typing import Any, List, Optional
from urllib.parse import urljoin

import httpx
from bs4 import BeautifulSoup
from redis.asyncio import Redis
from sqlalchemy.orm import Session

from app.models.gym import Gym
from app.services.cache_service import get_cache, set_cache
from app.services.gym_logo_service import get_gym_logo

LISTING_URLS: dict[str, str] = {
    "basicfit": "https://www.basic-fit.com/fr-fr/salles-de-sport",
    "fitnesspark": "https://www.fitnesspark.fr/club/",
    "neoness": "https://www.neoness.fr/clubs",
    "onair": "https://onair-fitness.fr/club/",
    "keepcool": "https://www.keepcool.fr/salle-de-sport",
}

CACHE_EXPIRE_SECONDS = 86_400


async def _fetch_html(url: str) -> str:
    async with httpx.AsyncClient(timeout=httpx.Timeout(20.0, connect=10.0)) as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.text


def _clean_text(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    text = " ".join(value.split())
    return text.strip() or None


def _absolute_urls(urls: List[str], base_url: str) -> List[str]:
    absolute: List[str] = []
    for url in urls:
        absolute.append(urljoin(base_url, url))
    return absolute


def _parse_json_ld(soup: BeautifulSoup) -> dict[str, Any]:
    for script in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(script.string or "{}")
            if isinstance(data, list):
                for item in data:
                    if isinstance(item, dict) and item.get("@type") in {"LocalBusiness", "SportsActivityLocation"}:
                        return item
            elif isinstance(data, dict) and data.get("@type"):
                return data
        except json.JSONDecodeError:
            continue
    return {}


def _parse_opening_hours(hours_list: List[str]) -> dict[str, str]:
    opening_hours: dict[str, str] = {}
    for entry in hours_list:
        if not entry:
            continue
        if ":" in entry:
            parts = entry.split(":", 1)
            day = parts[0].strip()
            value = parts[1].strip()
            if day:
                opening_hours[day] = value
    return opening_hours


def _extract_images(soup: BeautifulSoup, base_url: str) -> List[str]:
    images: List[str] = []
    for img in soup.find_all("img"):
        src = img.get("data-src") or img.get("src")
        if not src:
            continue
        images.append(urljoin(base_url, src))
    return list(dict.fromkeys(images))


async def _scrape_basicfit(soup: BeautifulSoup, url: str) -> dict:
    data = _parse_json_ld(soup)
    address = data.get("address", {}) if isinstance(data, dict) else {}
    photos = _extract_images(soup, url)
    hours = data.get("openingHoursSpecification", [])
    opening_hours = {}
    if isinstance(hours, list):
        for entry in hours:
            if not isinstance(entry, dict):
                continue
            day = entry.get("dayOfWeek")
            opens = entry.get("opens")
            closes = entry.get("closes")
            if day and opens and closes:
                if isinstance(day, list):
                    for d in day:
                        opening_hours[d] = f"{opens}-{closes}"
                else:
                    opening_hours[day] = f"{opens}-{closes}"

    return {
        "name": _clean_text(data.get("name")) or _clean_text(soup.find("h1").text if soup.find("h1") else None),
        "address": _clean_text(address.get("streetAddress")),
        "city": _clean_text(address.get("addressLocality")),
        "coordinates_lat": float(address.get("latitude")) if address.get("latitude") else None,
        "coordinates_lng": float(address.get("longitude")) if address.get("longitude") else None,
        "opening_hours": opening_hours or None,
        "equipment": None,
        "photos": photos[:12] if photos else None,
        "phone": _clean_text(data.get("telephone")),
        "website": url,
        "price": _clean_text(data.get("priceRange")),
    }


async def _scrape_fitnesspark(soup: BeautifulSoup, url: str) -> dict:
    name = _clean_text(soup.select_one("h1") and soup.select_one("h1").get_text())
    address = _clean_text(soup.select_one(".club__infos__adresse") and soup.select_one(".club__infos__adresse").get_text())
    city = None
    if address and "," in address:
        city = address.split(",")[-1].strip()
    phone = _clean_text(soup.select_one("a[href^='tel']") and soup.select_one("a[href^='tel']").get_text())
    photos = [img.get("data-src") or img.get("src") for img in soup.select(".slider img")]
    equipments = [
        _clean_text(item.get_text())
        for item in soup.select(".club__equipements li, .club__services li")
        if _clean_text(item.get_text())
    ]
    hours = _parse_opening_hours([item.get_text() for item in soup.select(".horaires li")])

    return {
        "name": name,
        "address": address,
        "city": city,
        "coordinates_lat": None,
        "coordinates_lng": None,
        "opening_hours": hours or None,
        "equipment": equipments or None,
        "photos": _absolute_urls([src for src in photos if src], url) or None,
        "phone": phone,
        "website": url,
        "price": None,
    }


async def _scrape_neoness(soup: BeautifulSoup, url: str) -> dict:
    data = _parse_json_ld(soup)
    name = _clean_text(data.get("name")) or _clean_text(soup.select_one("h1") and soup.select_one("h1").get_text())
    address = data.get("address", {}) if isinstance(data, dict) else {}
    photos = _extract_images(soup, url)
    equipments = [
        _clean_text(item.get_text())
        for item in soup.select(".equipments li, .list-equipements li")
        if _clean_text(item.get_text())
    ]
    hours = _parse_opening_hours([item.get_text(": ") for item in soup.select(".horaires li, .schedule li")])

    return {
        "name": name,
        "address": _clean_text(address.get("streetAddress")),
        "city": _clean_text(address.get("addressLocality")),
        "coordinates_lat": float(address.get("latitude")) if address.get("latitude") else None,
        "coordinates_lng": float(address.get("longitude")) if address.get("longitude") else None,
        "opening_hours": hours or None,
        "equipment": equipments or None,
        "photos": photos[:12] if photos else None,
        "phone": _clean_text(data.get("telephone")),
        "website": url,
        "price": _clean_text(data.get("priceRange")),
    }


async def _scrape_onair(soup: BeautifulSoup, url: str) -> dict:
    name = _clean_text(soup.select_one("h1") and soup.select_one("h1").get_text())
    address_block = soup.select_one(".club-info, .club__infos")
    address = _clean_text(address_block.get_text(" ") if address_block else None)
    phone = _clean_text(soup.select_one("a[href^='tel']") and soup.select_one("a[href^='tel']").get_text())
    photos = [img.get("data-src") or img.get("src") for img in soup.select("img")]
    equipments = [
        _clean_text(item.get_text())
        for item in soup.select(".services li, .equipements li")
        if _clean_text(item.get_text())
    ]

    return {
        "name": name,
        "address": address,
        "city": None,
        "coordinates_lat": None,
        "coordinates_lng": None,
        "opening_hours": None,
        "equipment": equipments or None,
        "photos": _absolute_urls([src for src in photos if src], url)[:12] or None,
        "phone": phone,
        "website": url,
        "price": None,
    }


async def _scrape_keepcool(soup: BeautifulSoup, url: str) -> dict:
    data = _parse_json_ld(soup)
    name = _clean_text(data.get("name")) or _clean_text(soup.select_one("h1") and soup.select_one("h1").get_text())
    address_block = data.get("address", {}) if isinstance(data, dict) else {}
    phone = _clean_text(data.get("telephone")) or _clean_text(soup.select_one("a[href^='tel']") and soup.select_one("a[href^='tel']").get_text())
    price = _clean_text(data.get("priceRange"))
    photos = _extract_images(soup, url)
    equipments = [
        _clean_text(item.get_text())
        for item in soup.select(".equipements li, .equipments li")
        if _clean_text(item.get_text())
    ]
    hours = _parse_opening_hours([item.get_text(": ") for item in soup.select(".horaires li, .opening-hours li")])

    return {
        "name": name,
        "address": _clean_text(address_block.get("streetAddress")),
        "city": _clean_text(address_block.get("addressLocality")),
        "coordinates_lat": float(address_block.get("latitude")) if address_block.get("latitude") else None,
        "coordinates_lng": float(address_block.get("longitude")) if address_block.get("longitude") else None,
        "opening_hours": hours or None,
        "equipment": equipments or None,
        "photos": photos[:12] if photos else None,
        "phone": phone,
        "website": url,
        "price": price,
    }


SCRAPERS = {
    "basicfit": _scrape_basicfit,
    "fitnesspark": _scrape_fitnesspark,
    "neoness": _scrape_neoness,
    "onair": _scrape_onair,
    "keepcool": _scrape_keepcool,
}


async def scrape_gym_details(url: str, gym_type: str, redis: Optional[Redis] = None) -> dict:
    """
    Scrape toutes les infos utiles depuis l'URL d’un gym.
    Le résultat est mis en cache Redis.
    Retour : dict avec toutes les informations normalisées.
    """

    cache_key = f"gym_details:{gym_type}:{url}"
    cached = await get_cache(redis, cache_key)
    if cached:
        return cached

    html = await _fetch_html(url)
    soup = BeautifulSoup(html, "html.parser")
    scraper = SCRAPERS.get(gym_type.lower())
    if not scraper:
        raise ValueError(f"Unsupported gym type: {gym_type}")

    details = await scraper(soup, url)
    details["logo_url"] = get_gym_logo(gym_type)
    details["brand"] = gym_type

    await set_cache(redis, cache_key, details, expire_seconds=CACHE_EXPIRE_SECONDS)
    return details


async def _scrape_listing_basicfit(soup: BeautifulSoup, url: str) -> List[str]:
    return [urljoin(url, link.get("href")) for link in soup.select("a[href*='basic-fit-']") if link.get("href")]


async def _scrape_listing_fitnesspark(soup: BeautifulSoup, url: str) -> List[str]:
    return [urljoin(url, link.get("href")) for link in soup.select("a.card-club__link") if link.get("href")]


async def _scrape_listing_neoness(soup: BeautifulSoup, url: str) -> List[str]:
    return [urljoin(url, link.get("href")) for link in soup.select("a[href*='/clubs/']") if link.get("href")]


async def _scrape_listing_onair(soup: BeautifulSoup, url: str) -> List[str]:
    return [urljoin(url, link.get("href")) for link in soup.select("a.card-club") if link.get("href")]


async def _scrape_listing_keepcool(soup: BeautifulSoup, url: str) -> List[str]:
    return [urljoin(url, link.get("href")) for link in soup.select("a[href*='/s/salle']") if link.get("href")]


LISTING_SCRAPERS = {
    "basicfit": _scrape_listing_basicfit,
    "fitnesspark": _scrape_listing_fitnesspark,
    "neoness": _scrape_listing_neoness,
    "onair": _scrape_listing_onair,
    "keepcool": _scrape_listing_keepcool,
}


async def scrape_listing_urls(gym_type: str) -> List[str]:
    listing_url = LISTING_URLS.get(gym_type)
    if not listing_url:
        return []

    html = await _fetch_html(listing_url)
    soup = BeautifulSoup(html, "html.parser")
    scraper = LISTING_SCRAPERS.get(gym_type)
    if not scraper:
        return []

    urls = await scraper(soup, listing_url)
    return list(dict.fromkeys(urls))


async def update_or_create_gym_from_scraping(
    db: Session, url: str, gym_type: str, redis: Optional[Redis] = None
) -> Gym:
    details = await scrape_gym_details(url, gym_type, redis)

    gym = db.query(Gym).filter(Gym.url == url).first()
    if not gym:
        gym = Gym(url=url)
        db.add(gym)

    for field, value in details.items():
        setattr(gym, field, value)

    gym.latitude = gym.latitude or details.get("coordinates_lat")
    gym.longitude = gym.longitude or details.get("coordinates_lng")
    gym.last_synced = datetime.utcnow()
    db.commit()
    db.refresh(gym)
    return gym


async def scrape_and_persist_all_gyms(db: Session, redis: Optional[Redis] = None) -> dict[str, Any]:
    created = 0
    updated = 0
    total = 0

    semaphore = asyncio.Semaphore(10)

    async def process_gym(url: str, gym_type: str):
        nonlocal created, updated, total
        async with semaphore:
            existing = db.query(Gym).filter(Gym.url == url).first()
            gym = await update_or_create_gym_from_scraping(db, url, gym_type, redis)
            total += 1
            if existing:
                updated += 1
            else:
                created += 1
            return gym

    tasks = []
    for gym_type in LISTING_URLS.keys():
        urls = await scrape_listing_urls(gym_type)
        for url in urls:
            tasks.append(process_gym(url, gym_type))

    if tasks:
        await asyncio.gather(*tasks)

    return {"total": total, "created": created, "updated": updated}
