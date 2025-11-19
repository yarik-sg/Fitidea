"""Integration helpers for SerpAPI requests."""
from __future__ import annotations

from typing import Any, Dict, List, Optional
from datetime import datetime

import httpx
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

SERPAPI_URL = "https://serpapi.com/search.json"
DEFAULT_TIMEOUT = httpx.Timeout(10.0, connect=5.0)


class SerpApiError(Exception):
    """Raised when a SerpAPI request fails."""


async def _perform_request(params: Dict[str, Any]) -> Dict[str, Any]:
    if not settings.serpapi_key:
        raise SerpApiError("SerpAPI key is not configured")

    try:
        async with httpx.AsyncClient(timeout=DEFAULT_TIMEOUT) as client:
            response = await client.get(
                SERPAPI_URL, params={"api_key": settings.serpapi_key, **params}
            )
            response.raise_for_status()
            return response.json()
    except httpx.TimeoutException as exc:
        raise SerpApiError("SerpAPI request timed out") from exc
    except httpx.RequestError as exc:
        raise SerpApiError(f"SerpAPI request failed: {exc}") from exc
    except ValueError as exc:
        raise SerpApiError("Failed to decode SerpAPI response") from exc


def _parse_price(raw_price: Optional[str]) -> tuple[Optional[float], Optional[str]]:
    if not raw_price:
        return None, None

    currency = None
    if "€" in raw_price:
        currency = "EUR"
    elif "$" in raw_price:
        currency = "USD"

    normalized = raw_price.replace("€", "").replace("$", "").replace(",", ".")
    digits = "".join(ch for ch in normalized if ch.isdigit() or ch == ".")
    try:
        return float(digits), currency
    except ValueError:
        return None, currency


def _parse_offers(payload: Dict[str, Any]) -> List[Dict[str, Any]]:
    offers: List[Dict[str, Any]] = []
    for item in payload.get("shopping_results", []) or []:
        price_value, currency = _parse_price(item.get("price"))
        offers.append(
            {
                "title": item.get("title"),
                "price": price_value,
                "currency": currency,
                "raw_price": item.get("price"),
                "source": item.get("source"),
                "link": item.get("link"),
                "thumbnail": item.get("thumbnail") or item.get("image"),
                "rating": item.get("rating"),
                "reviews": item.get("reviews"),
                "brand": item.get("brand") or item.get("merchant"),
                "snippet": item.get("snippet"),
            }
        )
    return offers


def _filter_offers(
    offers: List[Dict[str, Any]],
    *,
    price_min: Optional[float],
    price_max: Optional[float],
    source: Optional[str],
) -> List[Dict[str, Any]]:
    filtered: List[Dict[str, Any]] = []
    for offer in offers:
        if price_min is not None and offer.get("price") is not None and offer["price"] < price_min:
            continue
        if price_max is not None and offer.get("price") is not None and offer["price"] > price_max:
            continue
        if source and offer.get("source") and source.lower() not in offer["source"].lower():
            continue
        filtered.append(offer)
    return filtered


async def search_supplements(
    query: str,
    *,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    price_min: Optional[float] = None,
    price_max: Optional[float] = None,
    source: Optional[str] = None,
    page: int = 1,
    page_size: int = 12,
) -> Dict[str, Any]:
    """Search supplements/products on SerpAPI and return a paginated payload."""

    final_query_parts = [query or "complément sportif"]
    if category:
        final_query_parts.append(category)
    if brand:
        final_query_parts.append(brand)
    final_query = " ".join(part for part in final_query_parts if part)

    params = {
        "engine": "google_shopping",
        "q": final_query,
        "hl": "fr",
        "gl": "fr",
        "start": max(page - 1, 0) * page_size,
        "num": page_size,
    }

    payload = await _perform_request(params)
    offers = _filter_offers(
        _parse_offers(payload), price_min=price_min, price_max=price_max, source=source
    )

    items: List[Dict[str, Any]] = []
    for idx, offer in enumerate(offers):
        fallback_id = -1 * ((page - 1) * page_size + idx + 1)
        items.append(
            {
                "id": fallback_id,
                "name": offer.get("title") or final_query,
                "description": offer.get("snippet"),
                "price": offer.get("price"),
                "brand": offer.get("brand") or brand,
                "category": category,
                "rating": offer.get("rating"),
                "reviews_count": offer.get("reviews"),
                "images": [offer.get("thumbnail")] if offer.get("thumbnail") else [],
                "url": offer.get("link"),
                "source": offer.get("source"),
                "currency": offer.get("currency"),
                "created_at": datetime.utcnow(),
            }
        )

    try:
        total = int(payload.get("shopping_results_count")) if payload.get("shopping_results_count") else len(items)
    except (TypeError, ValueError):
        total = len(items)

    logger.info(
        "SerpAPI search executed", extra={"query": final_query, "results": len(items)}
    )

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


async def search_product(query: str) -> Dict[str, Any]:
    """Backward compatible helper used by comparison routes."""
    payload = await _perform_request({"engine": "google_shopping", "q": query, "hl": "fr", "gl": "fr"})
    return {"query": query, "offers": _parse_offers(payload)}


async def fetch_offers(product_name: str) -> List[Dict[str, Any]]:
    """Return offers for a product name using SerpAPI."""
    payload = await _perform_request({"engine": "google_shopping", "q": product_name})
    return _parse_offers(payload)
