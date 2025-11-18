"""Utilities to fetch and cache official gym logos."""
from __future__ import annotations

import re
from typing import Optional
from urllib.parse import urljoin, urlparse, urlunparse

import redis
import requests
from bs4 import BeautifulSoup

from app.core.config import settings

CACHE_PREFIX = "gym_logo:"
CACHE_EXPIRATION = 2_592_000  # 30 days in seconds
PLACEHOLDER_LOGO = "https://via.placeholder.com/150?text=Fitidea"
GYM_SITES: dict[str, str] = {
    "basicfit": "https://www.basic-fit.com/fr-fr/",
    "fitnesspark": "https://www.fitnesspark.fr/",
    "neoness": "https://www.neoness.fr/",
    "onair": "https://onair-fitness.fr/",
    "keepcool": "https://www.keepcool.fr/",
}


def _get_redis_client() -> Optional[redis.Redis]:
    try:
        return redis.from_url(settings.redis_url, decode_responses=True)
    except Exception:
        return None


def _clean_logo_url(src: Optional[str], base_url: str) -> Optional[str]:
    if not src:
        return None

    absolute = urljoin(base_url, src)
    parsed = urlparse(absolute)
    sanitized = parsed._replace(query="", fragment="")
    return urlunparse(sanitized)


def _extract_logo(soup: BeautifulSoup, base_url: str) -> Optional[str]:
    logo_patterns = re.compile(r"logo|header-logo|site-logo|navbar-logo", re.IGNORECASE)

    for img in soup.find_all("img"):
        attributes = " ".join(
            filter(
                None,
                [
                    img.get("id"),
                    " ".join(img.get("class", [])),
                    img.get("alt"),
                    img.get("src"),
                    img.get("data-src"),
                ],
            )
        )
        if not attributes:
            continue

        if logo_patterns.search(attributes):
            candidate = _clean_logo_url(img.get("src") or img.get("data-src"), base_url)
            if candidate:
                return candidate

    return None


def get_gym_logo(gym_type: str) -> str:
    """
    Return the official logo URL for a gym brand.

    The logo is scraped from the brand's official website and cached in Redis
    for 30 days. Falls back to a placeholder when no logo can be detected.
    """

    if not gym_type:
        return PLACEHOLDER_LOGO

    normalized_type = gym_type.lower()
    cache_key = f"{CACHE_PREFIX}{normalized_type}"

    redis_client = _get_redis_client()
    if redis_client:
        cached = redis_client.get(cache_key)
        if cached:
            return cached

    site_url = GYM_SITES.get(normalized_type)
    if not site_url:
        return PLACEHOLDER_LOGO

    logo_url = None
    try:
        response = requests.get(site_url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        logo_url = _extract_logo(soup, site_url)
    except Exception:
        logo_url = None

    final_logo = logo_url or PLACEHOLDER_LOGO

    if redis_client:
        try:
            redis_client.setex(cache_key, CACHE_EXPIRATION, final_logo)
        except Exception:
            pass

    return final_logo
