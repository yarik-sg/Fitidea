"""Utility helpers for interacting with Redis cache."""
from __future__ import annotations

import json
from typing import Any, Optional

from redis.asyncio import Redis


async def get_cache(redis: Optional[Redis], key: str) -> Any:
    """Retrieve a cached value by key.

    Returns ``None`` when the cache client is unavailable or the key is not set.
    Parsed JSON values are returned as Python objects for convenience.
    """
    if redis is None:
        return None

    value = await redis.get(key)
    if value is None:
        return None

    try:
        return json.loads(value)
    except json.JSONDecodeError:
        return value


async def set_cache(redis: Optional[Redis], key: str, value: Any, expire_seconds: int | None = None) -> None:
    """Store a value in Redis with optional expiration."""
    if redis is None:
        return

    serialized = json.dumps(value) if not isinstance(value, str) else value
    await redis.set(key, serialized, ex=expire_seconds)


async def expire_cache(redis: Optional[Redis], key: str, expire_seconds: int) -> None:
    """Update the expiration time of a cached value."""
    if redis is None:
        return

    await redis.expire(key, expire_seconds)
