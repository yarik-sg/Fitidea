from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class ProgramBase(BaseModel):
    name: str
    description: Optional[str] = None
    user_id: Optional[int] = None
    gym_id: Optional[int] = None


class ProgramCreate(ProgramBase):
    pass


class ProgramUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    user_id: Optional[int] = None
    gym_id: Optional[int] = None


class ProgramRead(ProgramBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProgramReadWithExercises(ProgramRead):
    exercises: List[int] = Field(default_factory=list)
