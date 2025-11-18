from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Optional[float] = Field(default=None)
    brand: Optional[str] = None
    category: Optional[str] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = None
    images: Optional[list] = Field(default=None)
    url: Optional[str] = None
    source: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(default=None)
    brand: Optional[str] = None
    category: Optional[str] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = None
    images: Optional[list] = Field(default=None)
    url: Optional[str] = None
    source: Optional[str] = None


class ProductRead(ProductBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductReadWithOffers(ProductRead):
    offers: List[int] = Field(default_factory=list)
