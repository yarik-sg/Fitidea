from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models import Gym
from app.schemas.gym import GymCreate, GymPublic

router = APIRouter(prefix="/gyms", tags=["gyms"])


@router.get("/", response_model=List[GymPublic])
def list_gyms(db: Session = Depends(deps.get_db_session)):
    return db.query(Gym).order_by(Gym.created_at.desc()).all()


@router.post("/", response_model=GymPublic, status_code=201)
def create_gym(payload: GymCreate, db: Session = Depends(deps.get_db_session)):
    gym = Gym(**payload.model_dump())
    db.add(gym)
    db.commit()
    db.refresh(gym)
    return gym


@router.get("/{gym_id}", response_model=GymPublic)
def get_gym(gym_id: int, db: Session = Depends(deps.get_db_session)):
    gym = db.get(Gym, gym_id)
    if not gym:
        raise HTTPException(status_code=404, detail="Gym not found")
    return gym
