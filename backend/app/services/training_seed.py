from datetime import datetime
from datetime import datetime
from sqlalchemy.orm import Session
import logging

from app.models.training import (
    Coach,
    FavoriteProgram,
    WorkoutExercise,
    WorkoutProgram,
    WorkoutSession,
    WorkoutWeek,
)
from app.models.user import User
from passlib.context import CryptContext
from app.core.config import settings
from app.models.gym import Gym

logger = logging.getLogger(__name__)

PROGRAM_GOALS = ["prise_masse", "perte_poids", "performance", "bien_etre", "full_body", "split", "hiit", "mobilité", "force"]
PROGRAM_LEVELS = ["débutant", "intermédiaire", "avancé"]


def _create_coaches(db: Session) -> list[Coach]:
    if db.query(Coach).count() >= 6:
        return db.query(Coach).all()

    coaches = [
        Coach(
            name="Léna Duval",
            bio="Ancienne gymnaste, spécialisée en mobilité et prévention des blessures.",
            specialty="mobilité",
            image_url="https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=400&q=80",
            instagram="https://instagram.com/lenaflow",
        ),
        Coach(
            name="Maxime Leroy",
            bio="Coach force et hypertrophie, adepte des méthodes science-based.",
            specialty="force",
            image_url="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
            youtube="https://youtube.com/maxforce",
        ),
        Coach(
            name="Nina Costa",
            bio="Passionnée de HIIT et cardio, créatrice de formats courts et efficaces.",
            specialty="hiit",
            image_url="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80",
        ),
        Coach(
            name="Yanis Gault",
            bio="Expert prise de masse contrôlée, focus sur le suivi nutritionnel.",
            specialty="prise_masse",
            image_url="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        ),
        Coach(
            name="Maya Chen",
            bio="Coach bien-être, respiration et mobilité douce pour recharger les batteries.",
            specialty="bien_etre",
            image_url="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
        ),
        Coach(
            name="Ethan Moreau",
            bio="Spécialiste cross-training, combine force et cardio pour des progrès rapides.",
            specialty="performance",
            image_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        ),
    ]
    db.add_all(coaches)
    db.commit()
    logger.info("Seeded %s coaches", len(coaches))
    return coaches


def _create_programs(db: Session, coaches: list[Coach]) -> list[WorkoutProgram]:
    if db.query(WorkoutProgram).count() >= 10:
        return db.query(WorkoutProgram).all()

    program_templates = [
        ("Full Body Express", "full_body", "débutant", 4),
        ("Split Sculpt", "split", "intermédiaire", 8),
        ("HIIT Ignite", "hiit", "intermédiaire", 6),
        ("Mobility Reset", "mobilité", "débutant", 4),
        ("Force Totale", "force", "avancé", 12),
        ("Bien-être Flow", "bien_etre", "débutant", 6),
        ("Cardio Pulse", "performance", "intermédiaire", 8),
        ("Athlete Program", "performance", "avancé", 12),
        ("Lean Builder", "prise_masse", "intermédiaire", 8),
        ("Shred Control", "perte_poids", "avancé", 6),
    ]

    programs = []
    for idx, (title, goal, level, duration) in enumerate(program_templates, start=1):
        coach = coaches[idx % len(coaches)]
        program = WorkoutProgram(
            title=title,
            goal=goal,
            level=level,
            duration_weeks=duration,
            image_url=f"https://images.unsplash.com/photo-1518611012118-53f27c3f2c8{idx}?auto=format&fit=crop&w=1200&q=80",
            description=f"Programme {title} orienté {goal} pour un niveau {level}.",
            coach=coach,
        )
        db.add(program)
        programs.append(program)
    db.commit()
    logger.info("Seeded %s workout programs", len(programs))
    return programs


def _create_structure(db: Session, programs: list[WorkoutProgram]) -> None:
    if db.query(WorkoutWeek).count() >= 20:
        return

    for program in programs:
        for week_number in range(1, 3 + 1):
            week = WorkoutWeek(program=program, week_number=week_number)
            db.add(week)
            for session_index in range(1, 3):
                session = WorkoutSession(
                    week=week,
                    title=f"Session {session_index}",
                    duration_minutes=45 + session_index * 5,
                )
                db.add(session)
                for ex_index in range(1, 3):
                    exercise = WorkoutExercise(
                        session=session,
                        name=f"Exercice {week_number}-{session_index}-{ex_index}",
                        reps="10-12",
                        sets=4,
                        video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    )
                    db.add(exercise)
    db.commit()
    logger.info("Created workout structure for demo programs")


def seed_training_data(db: Session) -> None:
    coaches = _create_coaches(db)
    programs = _create_programs(db, coaches)
    _create_structure(db, programs)

    # Ensure there is at least one user to attach favorites to.
    user = db.query(User).filter_by(id=1).first()
    if not user:
        # Use a local hashing context that does not rely on the global `bcrypt` backend
        local_ctx = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
        hashed = local_ctx.hash("password")
        user = User(email="admin@example.com", full_name="Admin Test", hashed_password=hashed)
        db.add(user)
        db.commit()
        db.refresh(user)

    if not db.query(FavoriteProgram).first() and programs:
        sample = FavoriteProgram(user_id=user.id, program_id=programs[0].id, added_at=datetime.utcnow())
        db.add(sample)
        db.commit()

    if getattr(settings, "dev_seed", False):
        _create_sample_products(db)
        _create_sample_gyms(db)


def _create_sample_products(db: Session) -> None:
    from app.models.product import Product

    if db.query(Product).count() > 0:
        return

    demo_products = [
        {
            "name": "Whey Protein Vanilla 1kg",
            "description": "Protéine de lactosérum, goût vanille.",
            "price": 29.99,
            "brand": "MyProtein",
            "category": "whey",
            "rating": 4.5,
            "images": ["https://images.unsplash.com/photo-1586201375761-83865001e3f6?auto=format&fit=crop&w=800&q=80"],
            "url": "https://example.com/product/whey-vanilla",
            "source": "ExampleStore",
        },
        {
            "name": "Créatine Monohydrate 300g",
            "description": "Créatine pure pour la performance.",
            "price": 19.99,
            "brand": "Prozis",
            "category": "creatine",
            "rating": 4.2,
            "images": ["https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80"],
            "url": "https://example.com/product/creatine-300g",
            "source": "ExampleStore",
        },
        {
            "name": "Pré-workout Agrumes",
            "description": "Formule énergie sans crash pour séances intenses.",
            "price": 24.9,
            "brand": "Foodspring",
            "category": "preworkout",
            "rating": 4.0,
            "images": ["https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=800&q=80"],
            "url": "https://example.com/product/preworkout", 
            "source": "ExampleStore",
        },
    ]

    for item in demo_products:
        p = Product(**item)
        db.add(p)
    db.commit()
    logger.info("Seeded %s demo products", len(demo_products))


def _create_sample_gyms(db: Session) -> None:
    if db.query(Gym).count() > 0:
        return

    gyms = [
        {
            "name": "Basic-Fit Rivoli",
            "brand": "basicfit",
            "city": "Paris",
            "address": "12 Rue de Rivoli, 75004 Paris",
            "price": "19,99€/mois",
            "image_url": "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?auto=format&fit=crop&w=1000&q=80",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Basic-Fit_logo.svg/320px-Basic-Fit_logo.svg.png",
            "opened_24_7": False,
        },
        {
            "name": "Fitness Park Confluence",
            "brand": "fitnesspark",
            "city": "Lyon",
            "address": "112 Cours Charlemagne, 69002 Lyon",
            "price": "29,95€/mois",
            "image_url": "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=1000&q=80",
            "opened_24_7": True,
        },
        {
            "name": "Neoness Prado",
            "brand": "neoness",
            "city": "Marseille",
            "address": "5 Boulevard Michelet, 13008 Marseille",
            "price": "24,90€/mois",
            "image_url": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80",
        },
    ]

    for gym in gyms:
        db.add(Gym(**gym))

    db.commit()
    logger.info("Seeded %s demo gyms", len(gyms))

