from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.auth.auth import get_current_user
from app.db.session import get_db
from app.models.favorite import Favorite
from app.models.offer import Offer
from app.models.product import Product
from app.models.user import User
from app.schemas.offer import OfferRead
from app.schemas.product import ProductRead

router = APIRouter(prefix="/favorites", tags=["favorites"])


class FavoriteWithProduct(BaseModel):
    id: int
    created_at: datetime
    product: ProductRead
    offer: OfferRead

    class Config:
        orm_mode = True


def _get_offer_for_product(db: Session, product_id: int) -> Offer:
    offer = (
        db.query(Offer)
        .filter(Offer.product_id == product_id)
        .order_by(Offer.price.asc())
        .first()
    )
    if not offer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No offers found for this product",
        )
    return offer


def _favorite_to_response(favorite: Favorite) -> FavoriteWithProduct:
    product = favorite.offer.product
    return FavoriteWithProduct(
        id=favorite.id,
        created_at=favorite.created_at,
        product=ProductRead.from_orm(product),
        offer=OfferRead.from_orm(favorite.offer),
    )


@router.post("/{product_id}", response_model=FavoriteWithProduct, status_code=status.HTTP_201_CREATED)
def add_favorite(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FavoriteWithProduct:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    existing_favorite = (
        db.query(Favorite)
        .join(Offer)
        .filter(Favorite.user_id == current_user.id, Offer.product_id == product_id)
        .first()
    )
    if existing_favorite:
        return _favorite_to_response(existing_favorite)

    offer = _get_offer_for_product(db, product_id)
    favorite = Favorite(user_id=current_user.id, offer_id=offer.id)
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    return _favorite_to_response(favorite)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    favorite = (
        db.query(Favorite)
        .join(Offer)
        .filter(Favorite.user_id == current_user.id, Offer.product_id == product_id)
        .first()
    )
    if not favorite:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Favorite not found")

    db.delete(favorite)
    db.commit()


@router.get("", response_model=List[FavoriteWithProduct])
def list_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[FavoriteWithProduct]:
    favorites = (
        db.query(Favorite)
        .join(Offer)
        .filter(Favorite.user_id == current_user.id)
        .order_by(Favorite.created_at.desc())
        .all()
    )

    return [_favorite_to_response(favorite) for favorite in favorites]
