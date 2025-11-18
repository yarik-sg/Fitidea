from datetime import datetime

from pydantic import BaseModel, ConfigDict


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

    model_config = ConfigDict(from_attributes=True)
