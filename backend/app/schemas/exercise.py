from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ExerciseBase(BaseModel):
    name: str
    description: Optional[str] = None
    duration_minutes: Optional[int] = None
    program_id: int


class ExerciseCreate(ExerciseBase):
    pass


class ExerciseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    duration_minutes: Optional[int] = None
    program_id: Optional[int] = None


class ExerciseRead(ExerciseBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
