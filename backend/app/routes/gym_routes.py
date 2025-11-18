from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.gym import Gym
from app.schemas.gym import GymRead, GymReadWithRelations
from app.services.gym_logo_service import get_gym_logo
from app.scrapers import sync_all

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
        brand=gym.brand,
        address=gym.address,
        city=gym.city,
        country=gym.country,
        latitude=gym.latitude,
        longitude=gym.longitude,
        url=gym.url,
        image_url=gym.image_url,
        logo_url=gym.logo_url,
        opened_24_7=gym.opened_24_7,
        created_at=gym.created_at,
        last_synced=gym.last_synced,
        offers=[offer.id for offer in gym.offers],
        programs=[program.id for program in gym.programs],
    )


@router.get("", response_model=PaginatedGymsResponse)
def list_gyms(
    *,
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None, description="Filter gyms by name or address"),
    city: Optional[str] = Query(None, description="Filter gyms by city"),
    brand: Optional[str] = Query(None, description="Filter gyms by brand"),
    page: int = Query(1, ge=1, description="Page number for pagination"),
    page_size: int = Query(10, ge=1, le=100, description="Number of items per page"),
) -> dict:
    """List gyms with optional text search and pagination."""
    query = db.query(Gym)

    if search:
        like_pattern = f"%{search}%"
        query = query.filter(or_(Gym.name.ilike(like_pattern), Gym.address.ilike(like_pattern)))

    if city:
        query = query.filter(Gym.city.ilike(f"%{city}%"))

    if brand:
        query = query.filter(Gym.brand.ilike(f"%{brand}%"))

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


class SyncResponse(BaseModel):
    total: int
    created: int
    updated: int
    synced_at: datetime


@router.post("/sync", response_model=SyncResponse)
def sync_gyms(db: Session = Depends(get_db)) -> SyncResponse:
    gyms_payload = sync_all.sync_all_sources()
    created = 0
    updated = 0

    for gym_data in gyms_payload:
        brand = gym_data.get("brand")
        gym_data["logo_url"] = get_gym_logo(brand) if brand else get_gym_logo("")
        gym_data["last_synced"] = datetime.utcnow()

        existing = (
            db.query(Gym)
            .filter(Gym.name == gym_data.get("name"))
            .filter(Gym.brand == gym_data.get("brand"))
            .filter(Gym.city == gym_data.get("city"))
            .first()
        )

        if existing:
            for field, value in gym_data.items():
                setattr(existing, field, value)
            updated += 1
        else:
            db.add(
                Gym(
                    **gym_data,
                )
            )
            created += 1

    db.commit()

    total = db.query(Gym).count()

    return SyncResponse(
        total=total,
        created=created,
        updated=updated,
        synced_at=datetime.utcnow(),
    )
