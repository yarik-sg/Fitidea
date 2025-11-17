from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models import Favorite, Product, User
from app.schemas.favorite import FavoritePublic

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.get("/", response_model=List[FavoritePublic])
def list_favorites(current_user: User = Depends(deps.get_current_user), db: Session = Depends(deps.get_db_session)):
    return db.query(Favorite).filter(Favorite.user_id == current_user.id).all()


@router.post("/{product_id}", response_model=FavoritePublic, status_code=201)
def add_favorite(product_id: int, current_user: User = Depends(deps.get_current_user), db: Session = Depends(deps.get_db_session)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    favorite = Favorite(user_id=current_user.id, product_id=product_id)
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    return favorite


@router.delete("/{favorite_id}", status_code=204)
def remove_favorite(favorite_id: int, current_user: User = Depends(deps.get_current_user), db: Session = Depends(deps.get_db_session)):
    favorite = db.query(Favorite).filter(Favorite.id == favorite_id, Favorite.user_id == current_user.id).first()
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
    db.delete(favorite)
    db.commit()
