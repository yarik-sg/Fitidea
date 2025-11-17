"""Integration helpers for SerpAPI requests."""
from __future__ import annotations

from typing import Any, Dict, List

import httpx

from app.core.config import settings

SERPAPI_URL = "https://serpapi.com/search.json"
DEFAULT_TIMEOUT = httpx.Timeout(10.0, connect=5.0)


class SerpApiError(Exception):
    """Raised when a SerpAPI request fails."""


async def _perform_request(params: Dict[str, Any]) -> Dict[str, Any]:
    if not settings.serpapi_key:
        raise SerpApiError("SerpAPI key is not configured")

    try:
        async with httpx.AsyncClient(timeout=DEFAULT_TIMEOUT) as client:
            response = await client.get(SERPAPI_URL, params={"api_key": settings.serpapi_key, **params})
            response.raise_for_status()
            return response.json()
    except httpx.TimeoutException as exc:
        raise SerpApiError("SerpAPI request timed out") from exc
    except httpx.RequestError as exc:
        raise SerpApiError(f"SerpAPI request failed: {exc}") from exc
    except ValueError as exc:
        raise SerpApiError("Failed to decode SerpAPI response") from exc


def _parse_offers(payload: Dict[str, Any]) -> List[Dict[str, Any]]:
    offers: List[Dict[str, Any]] = []
    for item in payload.get("shopping_results", []) or []:
        offers.append(
            {
                "title": item.get("title"),
                "price": item.get("price"),
                "source": item.get("source"),
                "link": item.get("link"),
                "thumbnail": item.get("thumbnail") or item.get("image"),
            }
        )
    return offers


async def search_product(query: str) -> Dict[str, Any]:
    """Search a product on SerpAPI and return simplified results."""
    payload = await _perform_request({"engine": "google_shopping", "q": query})
    return {"query": query, "offers": _parse_offers(payload)}


async def fetch_offers(product_name: str) -> List[Dict[str, Any]]:
    """Return offers for a product name using SerpAPI."""
    payload = await _perform_request({"engine": "google_shopping", "q": product_name})
    return _parse_offers(payload)
