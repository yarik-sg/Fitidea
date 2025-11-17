from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.session import Base


class Coach(Base):
    __tablename__ = "coaches"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    bio = Column(Text)
    specialty = Column(String)
    image_url = Column(String)
    instagram = Column(String, nullable=True)
    youtube = Column(String, nullable=True)

    programs = relationship("WorkoutProgram", back_populates="coach", cascade="all, delete-orphan")


class WorkoutProgram(Base):
    __tablename__ = "workout_programs"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    goal = Column(String)
    level = Column(String)
    duration_weeks = Column(Integer)
    image_url = Column(String)
    description = Column(Text)
    coach_id = Column(Integer, ForeignKey("coaches.id"))

    coach = relationship("Coach", back_populates="programs")
    weeks = relationship("WorkoutWeek", back_populates="program", cascade="all, delete-orphan")
    favorites = relationship("FavoriteProgram", back_populates="program", cascade="all, delete-orphan")


class WorkoutWeek(Base):
    __tablename__ = "workout_weeks"

    id = Column(Integer, primary_key=True)
    program_id = Column(Integer, ForeignKey("workout_programs.id"))
    week_number = Column(Integer)

    program = relationship("WorkoutProgram", back_populates="weeks")
    sessions = relationship("WorkoutSession", back_populates="week", cascade="all, delete-orphan")


class WorkoutSession(Base):
    __tablename__ = "workout_sessions"

    id = Column(Integer, primary_key=True)
    week_id = Column(Integer, ForeignKey("workout_weeks.id"))
    title = Column(String)
    duration_minutes = Column(Integer)

    week = relationship("WorkoutWeek", back_populates="sessions")
    exercises = relationship(
        "WorkoutExercise", back_populates="session", cascade="all, delete-orphan"
    )


class WorkoutExercise(Base):
    __tablename__ = "workout_exercises"

    id = Column(Integer, primary_key=True)
    session_id = Column(Integer, ForeignKey("workout_sessions.id"))
    name = Column(String)
    reps = Column(String)
    sets = Column(Integer)
    video_url = Column(String, nullable=True)

    session = relationship("WorkoutSession", back_populates="exercises")


class FavoriteProgram(Base):
    __tablename__ = "favorite_programs"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    program_id = Column(Integer, ForeignKey("workout_programs.id"), primary_key=True)
    added_at = Column(DateTime, default=datetime.utcnow)

    program = relationship("WorkoutProgram", back_populates="favorites")
    user = relationship("User", back_populates="favorite_programs")
