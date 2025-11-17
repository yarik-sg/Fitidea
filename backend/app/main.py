from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import redis.asyncio as redis

from app.core.config import settings
from app.db.session import Base, SessionLocal, engine
from app.routes import (
    auth_routes,
    compare_routes,
    favorite_routes,
    gym_routes,
    product_routes,
    program_routes,
    training_routes,
)
from app.services.training_seed import seed_training_data

app = FastAPI(title=settings.project_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.backend_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event() -> None:
    """Initialize external connections when the application starts."""
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_training_data(db)
    app.state.redis = redis.from_url(settings.redis_url, decode_responses=True)


@app.on_event("shutdown")
async def shutdown_event() -> None:
    """Gracefully close external connections when the application stops."""
    redis_client = getattr(app.state, "redis", None)
    if redis_client:
        await redis_client.aclose()


def include_router_if_available(module) -> None:
    """Include the router from a module if it is defined."""
    router = getattr(module, "router", None)
    if router:
        app.include_router(router, prefix=settings.api_prefix)


auth_modules = [
    auth_routes,
    product_routes,
    compare_routes,
    favorite_routes,
    gym_routes,
    program_routes,
    training_routes,
]

for module in auth_modules:
    include_router_if_available(module)


@app.get("/health", tags=["health"])
async def health_check() -> dict[str, str | bool]:
    """Simple health endpoint to validate service availability."""
    redis_ok = False
    redis_client = getattr(app.state, "redis", None)
    if redis_client:
        try:
            await redis_client.ping()
            redis_ok = True
        except Exception:
            redis_ok = False

    return {"status": "ok", "redis": redis_ok}
