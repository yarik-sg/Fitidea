from typing import List, Optional
import logging

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.training import Coach, FavoriteProgram, WorkoutProgram, WorkoutSession, WorkoutWeek
from app.schemas.training import (
    CoachRead,
    FavoriteProgramRead,
    WorkoutProgramDetail,
    WorkoutProgramRead,
    WorkoutSessionRead,
    WorkoutWeekRead,
)
from app.auth.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/programs", tags=["training"])
logger = logging.getLogger(__name__)


@router.get("", response_model=dict)
def list_programs(
    *,
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    goal: Optional[str] = None,
    level: Optional[str] = None,
    duration: Optional[int] = Query(None, description="Duration in weeks"),
    coach_id: Optional[int] = None,
    program_type: Optional[str] = Query(None, alias="type"),
    search: Optional[str] = None,
) -> dict:
    query = db.query(WorkoutProgram).join(Coach, isouter=True)

    if goal:
        query = query.filter(WorkoutProgram.goal == goal)
    if level:
        query = query.filter(WorkoutProgram.level == level)
    if duration:
        query = query.filter(WorkoutProgram.duration_weeks == duration)
    if coach_id:
        query = query.filter(WorkoutProgram.coach_id == coach_id)
    if program_type:
        query = query.filter(WorkoutProgram.goal == program_type)
    if search:
        query = query.filter(WorkoutProgram.title.ilike(f"%{search}%"))

    total = query.count()
    items = (
        query.order_by(WorkoutProgram.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    logger.info(
        "Programs listing",
        extra={"goal": goal, "level": level, "coach_id": coach_id, "results": total},
    )

    return {
        "items": [WorkoutProgramRead.from_orm(p) for p in items],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/recommended", response_model=List[WorkoutProgramRead])
def recommended_programs(
    *,
    db: Session = Depends(get_db),
    level: Optional[str] = None,
    goal: Optional[str] = None,
    user_id: Optional[int] = None,
):
    query = db.query(WorkoutProgram)
    if level:
        query = query.filter(WorkoutProgram.level == level)
    if goal:
        query = query.filter(WorkoutProgram.goal == goal)

    favorites_subquery = None
    if user_id:
        favorites_subquery = (
            db.query(FavoriteProgram.program_id)
            .filter(FavoriteProgram.user_id == user_id)
            .subquery()
        )
    if favorites_subquery is not None:
        query = query.union(db.query(WorkoutProgram).filter(WorkoutProgram.id.in_(favorites_subquery)))

    return query.limit(12).all()


@router.get("/{program_id}", response_model=WorkoutProgramDetail)
def get_program(program_id: int, db: Session = Depends(get_db)):
    program = db.query(WorkoutProgram).filter(WorkoutProgram.id == program_id).first()
    if not program:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")
    return program


@router.get("/{program_id}/weeks", response_model=List[WorkoutWeekRead])
def get_weeks(program_id: int, db: Session = Depends(get_db)):
    program = db.query(WorkoutProgram).filter(WorkoutProgram.id == program_id).first()
    if not program:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")
    return program.weeks


@router.get("/{program_id}/sessions", response_model=List[WorkoutSessionRead])
def get_sessions(program_id: int, db: Session = Depends(get_db)):
    sessions = (
        db.query(WorkoutSession)
        .join(WorkoutWeek)
        .filter(WorkoutWeek.program_id == program_id)
        .all()
    )
    return sessions


@router.post("/{program_id}/favorite", response_model=FavoriteProgramRead)
def add_favorite(
    program_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    program = db.query(WorkoutProgram).filter(WorkoutProgram.id == program_id).first()
    if not program:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")

    favorite = (
        db.query(FavoriteProgram)
        .filter_by(user_id=current_user.id, program_id=program_id)
        .first()
    )
    if favorite:
        return favorite

    favorite = FavoriteProgram(user_id=current_user.id, program_id=program_id)
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    return favorite


@router.delete("/{program_id}/favorite", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    program_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    favorite = (
        db.query(FavoriteProgram)
        .filter_by(user_id=current_user.id, program_id=program_id)
        .first()
    )
    if not favorite:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Favorite not found")
    db.delete(favorite)
    db.commit()
    return None


@router.get("/coaches", response_model=List[CoachRead], tags=["coaches"])
def list_coaches(db: Session = Depends(get_db)):
    return db.query(Coach).all()


@router.get("/coaches/{coach_id}", response_model=CoachRead, tags=["coaches"])
def get_coach(coach_id: int, db: Session = Depends(get_db)):
    coach = db.query(Coach).filter(Coach.id == coach_id).first()
    if not coach:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Coach not found")
    return coach
