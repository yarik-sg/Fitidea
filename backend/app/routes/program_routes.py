from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.program import Program
from app.schemas.program import ProgramRead, ProgramReadWithExercises

router = APIRouter(prefix="/programs", tags=["programs"])


class PaginatedProgramsResponse(BaseModel):
    items: List[ProgramRead]
    total: int
    page: int
    page_size: int


def _program_to_response(program: Program) -> ProgramReadWithExercises:
    return ProgramReadWithExercises(
        id=program.id,
        name=program.name,
        description=program.description,
        user_id=program.user_id,
        gym_id=program.gym_id,
        created_at=program.created_at,
        exercises=[exercise.id for exercise in program.exercises],
    )


@router.get("", response_model=PaginatedProgramsResponse)
def list_programs(
    *,
    db: Session = Depends(get_db),
    name: Optional[str] = Query(None, description="Filter programs by name"),
    user_id: Optional[int] = Query(None, description="Filter by owner id"),
    gym_id: Optional[int] = Query(None, description="Filter by gym id"),
    page: int = Query(1, ge=1, description="Page number for pagination"),
    page_size: int = Query(10, ge=1, le=100, description="Number of items per page"),
) -> dict:
    """List programs with optional filters and pagination."""
    query = db.query(Program)

    if name:
        query = query.filter(Program.name.ilike(f"%{name}%"))
    if user_id is not None:
        query = query.filter(Program.user_id == user_id)
    if gym_id is not None:
        query = query.filter(Program.gym_id == gym_id)

    total = query.count()
    programs = (
        query.order_by(Program.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return {
        "items": [ProgramRead.from_orm(program) for program in programs],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/{program_id}", response_model=ProgramReadWithExercises)
def get_program(program_id: int, db: Session = Depends(get_db)) -> ProgramReadWithExercises:
    """Retrieve a single program with its exercises."""
    program = db.query(Program).filter(Program.id == program_id).first()
    if not program:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Program not found")

    return _program_to_response(program)
