from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.gym import Gym
from app.schemas.gym import GymRead, GymReadWithRelations

router = APIRouter(prefix="/gyms", tags=["gyms"])


class PaginatedGymsResponse(BaseModel):
    items: List[GymRead]
    total: int
    page: int
    page_size: int


def _gym_to_response(gym: Gym) -> GymReadWithRelations:
    return GymReadWithRelations(
        id=gym.id,
        name=gym.name,
        address=gym.address,
        created_at=gym.created_at,
        offers=[offer.id for offer in gym.offers],
        programs=[program.id for program in gym.programs],
    )


@router.get("", response_model=PaginatedGymsResponse)
def list_gyms(
    *,
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None, description="Filter gyms by name or address"),
    page: int = Query(1, ge=1, description="Page number for pagination"),
    page_size: int = Query(10, ge=1, le=100, description="Number of items per page"),
) -> dict:
    """List gyms with optional text search and pagination."""
    query = db.query(Gym)

    if search:
        like_pattern = f"%{search}%"
        query = query.filter(or_(Gym.name.ilike(like_pattern), Gym.address.ilike(like_pattern)))

    total = query.count()
    gyms = (
        query.order_by(Gym.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return {
        "items": [GymRead.from_orm(gym) for gym in gyms],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/{gym_id}", response_model=GymReadWithRelations)
def get_gym(gym_id: int, db: Session = Depends(get_db)) -> GymReadWithRelations:
    """Retrieve a single gym with related offers and programs."""
    gym = db.query(Gym).filter(Gym.id == gym_id).first()
    if not gym:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gym not found")

    return _gym_to_response(gym)
