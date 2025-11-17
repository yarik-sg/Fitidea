from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None


class UserRead(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class UserReadWithRelations(UserRead):
    offers: List[int] = Field(default_factory=list)
    programs: List[int] = Field(default_factory=list)
    favorites: List[int] = Field(default_factory=list)
