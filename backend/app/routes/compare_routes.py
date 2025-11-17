from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.product import Product
from app.schemas.offer import OfferRead
from app.schemas.product import ProductRead
from app.services.cache_service import get_cache, set_cache
from app.services import serpapi_service

router = APIRouter(tags=["comparison"])


class CompareRequest(BaseModel):
    query: str = Field(..., description="Search term for the product to compare")


class ProductComparison(BaseModel):
    product: ProductRead
    offers: List[OfferRead]


class ComparisonResponse(BaseModel):
    products: List[ProductComparison]


async def get_redis_client(request: Request):
    redis_client = getattr(request.app.state, "redis", None)
    if redis_client is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Redis client unavailable")
    return redis_client


@router.post("/compare", response_model=dict)
async def compare_products(payload: CompareRequest, redis=Depends(get_redis_client)) -> Any:
    """Trigger a SerpAPI comparison for a given search query."""
    cache_key = f"compare:{payload.query.lower()}"
    cached = await get_cache(redis, cache_key)
    if cached:
        return cached

    try:
        result = await serpapi_service.search_product(payload.query)
    except serpapi_service.SerpApiError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc

    await set_cache(redis, cache_key, result, expire_seconds=300)
    return result


@router.get("/comparison", response_model=ComparisonResponse)
def get_comparison(
    *, ids: str = Query(..., description="Comma-separated product IDs"), db: Session = Depends(get_db)
) -> ComparisonResponse:
    """Retrieve comparison data for provided product IDs."""
    try:
        product_ids = [int(item) for item in ids.split(",") if item]
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ids must be integers") from exc

    if not product_ids:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No product ids provided")

    products = db.query(Product).filter(Product.id.in_(product_ids)).all()
    product_map = {product.id: product for product in products}

    comparisons: List[ProductComparison] = []
    for product_id in product_ids:
        product = product_map.get(product_id)
        if not product:
            continue
        comparison = ProductComparison(
            product=ProductRead.from_orm(product),
            offers=[OfferRead.from_orm(offer) for offer in product.offers],
        )
        comparisons.append(comparison)

    if not comparisons:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No matching products found")

    return ComparisonResponse(products=comparisons)
