from __future__ import annotations
from typing import Any, Dict, List
import json
import httpx
from redis import Redis

from app.core.config import settings


class SearchProvider:
    def __init__(self, redis_client: Redis):
        self.redis = redis_client

    def _cache_key(self, query: str) -> str:
        return f"serpapi:{query}"

    async def search_products(self, query: str, filters: Dict[str, Any] | None = None) -> List[dict]:
        cache_key = self._cache_key(query)
        if cached := self.redis.get(cache_key):
            return json.loads(cached)

        params = {
            "q": query,
            "api_key": settings.serpapi_key,
            "num": 10,
        }
        params.update(filters or {})

        async with httpx.AsyncClient() as client:
            response = await client.get("https://serpapi.com/search.json", params=params)
            response.raise_for_status()
            payload = response.json()
            products = payload.get("shopping_results", [])
            self.redis.setex(cache_key, 3600, json.dumps(products))
            return products
