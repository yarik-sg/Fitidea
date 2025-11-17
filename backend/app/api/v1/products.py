from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models import Product
from app.schemas.product import ProductCreate, ProductPublic, ProductUpdate
from app.services.search import SearchProvider

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=List[ProductPublic])
def list_products(
    brand: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(deps.get_db_session),
):
    query = db.query(Product)
    if brand:
        query = query.filter(Product.brand.ilike(f"%{brand}%"))
    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    return query.order_by(Product.created_at.desc()).all()


@router.post("/", response_model=ProductPublic)
def create_product(payload: ProductCreate, db: Session = Depends(deps.get_db_session)):
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.patch("/{product_id}", response_model=ProductPublic)
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(deps.get_db_session)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


@router.get("/search", response_model=List[dict])
async def search_products(
    q: str,
    brand: Optional[str] = None,
    category: Optional[str] = None,
    redis = Depends(deps.get_redis_client),
):
    filters = {}
    if brand:
        filters["brand"] = brand
    if category:
        filters["category"] = category
    provider = SearchProvider(redis)
    return await provider.search_products(q, filters)
