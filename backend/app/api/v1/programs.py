from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models import Program
from app.schemas.program import ProgramCreate, ProgramPublic

router = APIRouter(prefix="/programs", tags=["programs"])


@router.get("/", response_model=List[ProgramPublic])
def list_programs(db: Session = Depends(deps.get_db_session)):
    return db.query(Program).order_by(Program.created_at.desc()).all()


@router.post("/", response_model=ProgramPublic, status_code=201)
def create_program(payload: ProgramCreate, db: Session = Depends(deps.get_db_session)):
    program = Program(**payload.model_dump())
    db.add(program)
    db.commit()
    db.refresh(program)
    return program


@router.get("/{program_id}", response_model=ProgramPublic)
def get_program(program_id: int, db: Session = Depends(deps.get_db_session)):
    program = db.get(Program, program_id)
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    return program
