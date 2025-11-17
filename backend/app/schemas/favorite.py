from datetime import datetime

from pydantic import BaseModel


class FavoriteBase(BaseModel):
    user_id: int
    offer_id: int


class FavoriteCreate(FavoriteBase):
    pass


class FavoriteUpdate(BaseModel):
    user_id: int | None = None
    offer_id: int | None = None


class FavoriteRead(FavoriteBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
