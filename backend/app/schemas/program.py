from datetime import datetime
from pydantic import BaseModel


class ProgramBase(BaseModel):
    title: str
    description: str
    level: str
    duration_weeks: int


class ProgramCreate(ProgramBase):
    pass


class ProgramPublic(ProgramBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
