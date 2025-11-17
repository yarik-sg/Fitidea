from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class ProductBase(BaseModel):
    name: str
    brand: str
    category: str
    price: float
    currency: str = "EUR"
    source_url: Optional[str] = None
    thumbnail: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    price: Optional[float] = None
    source_url: Optional[str] = None
    thumbnail: Optional[str] = None


class ProductPublic(ProductBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
