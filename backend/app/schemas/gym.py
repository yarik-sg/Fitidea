from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class GymBase(BaseModel):
    name: str
    brand: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: str = "France"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    coordinates_lat: Optional[float] = None
    coordinates_lng: Optional[float] = None
    opening_hours: Optional[dict] = None
    equipment: Optional[list] = None
    photos: Optional[list] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    price: Optional[str] = None
    url: Optional[str] = None
    image_url: Optional[str] = None
    logo_url: Optional[str] = None
    opened_24_7: bool = False


class GymCreate(GymBase):
    pass


class GymUpdate(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    coordinates_lat: Optional[float] = None
    coordinates_lng: Optional[float] = None
    opening_hours: Optional[dict] = None
    equipment: Optional[list] = None
    photos: Optional[list] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    price: Optional[str] = None
    url: Optional[str] = None
    image_url: Optional[str] = None
    logo_url: Optional[str] = None
    opened_24_7: Optional[bool] = None
    last_synced: Optional[datetime] = None


class GymRead(GymBase):
    id: int
    created_at: datetime
    last_synced: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class GymReadWithRelations(GymRead):
    offers: List[int] = Field(default_factory=list)
    programs: List[int] = Field(default_factory=list)
