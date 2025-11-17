from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class GymBase(BaseModel):
    name: str
    address: Optional[str] = None


class GymCreate(GymBase):
    pass


class GymUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None


class GymRead(GymBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class GymReadWithRelations(GymRead):
    offers: List[int] = Field(default_factory=list)
    programs: List[int] = Field(default_factory=list)
