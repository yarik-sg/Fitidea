from decimal import Decimal
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.offer import Offer
from app.models.product import Product
from app.schemas.offer import OfferRead
from app.schemas.product import ProductRead

router = APIRouter(prefix="/products", tags=["products"])


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
    min_price: Optional[Decimal] = Query(None, description="Filter by minimum price"),
    max_price: Optional[Decimal] = Query(None, description="Filter by maximum price"),
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
