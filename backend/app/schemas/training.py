from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class CoachBase(BaseModel):
    name: str
    bio: Optional[str] = None
    specialty: Optional[str] = None
    image_url: Optional[str] = None
    instagram: Optional[str] = None
    youtube: Optional[str] = None


class CoachRead(CoachBase):
    id: int

    class Config:
        from_attributes = True


class ExerciseRead(BaseModel):
    id: int
    name: str
    reps: Optional[str] = None
    sets: Optional[int] = None
    video_url: Optional[str] = None

    class Config:
        from_attributes = True


class WorkoutSessionRead(BaseModel):
    id: int
    title: Optional[str] = None
    duration_minutes: Optional[int] = None
    exercises: List[ExerciseRead] = []

    class Config:
        from_attributes = True


class WorkoutWeekRead(BaseModel):
    id: int
    week_number: int
    sessions: List[WorkoutSessionRead] = []

    class Config:
        from_attributes = True


class WorkoutProgramBase(BaseModel):
    title: str
    goal: Optional[str] = None
    level: Optional[str] = None
    duration_weeks: Optional[int] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    coach_id: Optional[int] = None


class WorkoutProgramRead(WorkoutProgramBase):
    id: int
    coach: Optional[CoachRead] = None

    class Config:
        from_attributes = True


class WorkoutProgramDetail(WorkoutProgramRead):
    weeks: List[WorkoutWeekRead] = []


class FavoriteProgramRead(BaseModel):
    user_id: int
    program_id: int
    added_at: datetime

    class Config:
        from_attributes = True
