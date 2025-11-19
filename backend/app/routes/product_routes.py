from typing import List, Optional

from fastapi import APIRouter, Body, Depends, HTTPException, Query, Request, status
from pydantic import BaseModel, Field
from sqlalchemy import or_
from sqlalchemy.orm import Session
import logging

from app.db.session import get_db
from app.models.offer import Offer
from app.models.product import Product
from app.schemas.offer import OfferRead
from app.schemas.product import ProductRead
from app.services.product_ingest_service import ingest_product
from app.services import serpapi_service
from app.core.config import settings

router = APIRouter(prefix="/products", tags=["products"])

logger = logging.getLogger(__name__)


async def get_redis_client(request: Request):
    return getattr(request.app.state, "redis", None)


class ProductWithOffers(ProductRead):
    offers: List[OfferRead] = Field(default_factory=list)

    class Config:
        orm_mode = True


class PaginatedProductsResponse(BaseModel):
    items: List[ProductRead]
    total: int
    page: int
    page_size: int


@router.get("", response_model=PaginatedProductsResponse)
def list_products(
    *,
    db: Session = Depends(get_db),
    name: Optional[str] = Query(None, description="Filter by product name"),
    min_price: Optional[float] = Query(None, description="Filter by minimum price"),
    max_price: Optional[float] = Query(None, description="Filter by maximum price"),
    page: int = Query(1, ge=1, description="Page number for pagination"),
    page_size: int = Query(10, ge=1, le=100, description="Number of items per page"),
) -> dict:
    """List products with optional filters and pagination."""
    query = db.query(Product)

    if name:
        query = query.filter(Product.name.ilike(f"%{name}%"))
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    total = query.count()
    products = (
        query.order_by(Product.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return {
        "items": [ProductRead.from_orm(product) for product in products],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.post("/scrape", response_model=ProductRead)
async def scrape_and_save_product(
    url: str = Body(..., embed=True),
    source: str = Body(..., embed=True),
    db: Session = Depends(get_db),
    redis=Depends(get_redis_client),
):
    product = await ingest_product(url, source, db, redis)
    return ProductRead.from_orm(product)


@router.post("/scrape-bulk", response_model=List[ProductRead])
async def bulk_scrape_products(
    items: List[dict] = Body(...),
    db: Session = Depends(get_db),
    redis=Depends(get_redis_client),
):
    results: List[Product] = []
    for item in items:
        url = item.get("url")
        source = item.get("source")
        if not url or not source:
            continue
        product = await ingest_product(url, source, db, redis)
        results.append(product)
    return [ProductRead.from_orm(product) for product in results]


@router.get("/search", response_model=PaginatedProductsResponse)
async def search_products(
    *,
    db: Session = Depends(get_db),
    q: Optional[str] = Query(None, description="Recherche texte"),
    category: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    price_min: Optional[float] = Query(None),
    price_max: Optional[float] = Query(None),
    rating_min: Optional[float] = Query(None),
    source: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    use_live: bool = Query(
        False,
        description="Forcer l'utilisation de SerpAPI pour une recherche temps-réel",
    ),
):
    query = db.query(Product)

    if q:
        like_pattern = f"%{q}%"
        query = query.filter(or_(Product.name.ilike(like_pattern), Product.description.ilike(like_pattern)))
    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))
    if brand:
        query = query.filter(Product.brand.ilike(f"%{brand}%"))
    if price_min is not None:
        query = query.filter(Product.price >= price_min)
    if price_max is not None:
        query = query.filter(Product.price <= price_max)
    if rating_min is not None:
        query = query.filter(Product.rating >= rating_min)
    if source:
        query = query.filter(Product.source.ilike(f"%{source}%"))

    total = query.count()
    products = (
        query.order_by(Product.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    has_db_results = total > 0
    should_use_live = use_live or (not has_db_results and (q or category or brand))

    logger.info(
        "Product search", extra={"query": q, "filters": {"category": category, "brand": brand}}
    )

    if use_live and not settings.serpapi_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="SerpAPI non configuré",
        )

    if should_use_live and settings.serpapi_key:
        try:
            return await serpapi_service.search_supplements(
                q or "complément fitness",
                category=category,
                brand=brand,
                price_min=price_min,
                price_max=price_max,
                source=source,
                page=page,
                page_size=page_size,
            )
        except serpapi_service.SerpApiError as exc:
            logger.warning("SerpAPI search failed: %s", exc)
            if use_live:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="SerpAPI temporairement indisponible",
                ) from exc

    return {
        "items": [ProductRead.from_orm(product) for product in products],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/{product_id}", response_model=ProductWithOffers)
def get_product(product_id: int, db: Session = Depends(get_db)) -> ProductWithOffers:
    """Retrieve a single product with its offers."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    return ProductWithOffers.from_orm(product)


@router.get("/{product_id}/offers", response_model=List[OfferRead])
def get_product_offers(product_id: int, db: Session = Depends(get_db)) -> List[OfferRead]:
    """Return offers associated with a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    offers: List[Offer] = product.offers
    return [OfferRead.from_orm(offer) for offer in offers]
