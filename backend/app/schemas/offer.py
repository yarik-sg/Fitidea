from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class OfferBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: Decimal = Field(..., max_digits=10, decimal_places=2)
    product_id: int
    gym_id: Optional[int] = None
    user_id: Optional[int] = None


class OfferCreate(OfferBase):
    pass


class OfferUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    product_id: Optional[int] = None
    gym_id: Optional[int] = None
    user_id: Optional[int] = None


class OfferRead(OfferBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
