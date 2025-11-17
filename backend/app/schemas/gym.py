from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class GymBase(BaseModel):
    name: str
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone: Optional[str] = None


class GymCreate(GymBase):
    pass


class GymPublic(GymBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
