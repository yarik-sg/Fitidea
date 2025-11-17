from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal = Field(..., max_digits=10, decimal_places=2)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)


class ProductRead(ProductBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class ProductReadWithOffers(ProductRead):
    offers: List[int] = Field(default_factory=list)
