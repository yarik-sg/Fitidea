"""Shared SQLAlchemy base and model imports.

Import all models here to ensure they are registered with SQLAlchemy's
metadata before tables are created or migrations are generated.
"""

from app.db.session import Base

# Import models so that they are registered on the Base.metadata
from app.models.exercise import Exercise
from app.models.favorite import Favorite
from app.models.gym import Gym
from app.models.offer import Offer
from app.models.product import Product
from app.models.program import Program
from app.models.training import (
    Coach,
    FavoriteProgram,
    WorkoutExercise,
    WorkoutProgram,
    WorkoutSession,
    WorkoutWeek,
)
from app.models.user import User

__all__ = [
    "Base",
    "Coach",
    "Exercise",
    "Favorite",
    "FavoriteProgram",
    "Gym",
    "Offer",
    "Product",
    "Program",
    "User",
    "WorkoutExercise",
    "WorkoutProgram",
    "WorkoutSession",
    "WorkoutWeek",
]
