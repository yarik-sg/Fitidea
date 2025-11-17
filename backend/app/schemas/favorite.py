from datetime import datetime
from pydantic import BaseModel

from app.schemas.product import ProductPublic


class FavoritePublic(BaseModel):
    id: int
    product: ProductPublic
    created_at: datetime

    class Config:
        from_attributes = True
