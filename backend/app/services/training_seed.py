from datetime import datetime
from random import choice
from sqlalchemy.orm import Session

from app.models.training import (
    Coach,
    FavoriteProgram,
    WorkoutExercise,
    WorkoutProgram,
    WorkoutSession,
    WorkoutWeek,
)


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


def seed_training_data(db: Session) -> None:
    coaches = _create_coaches(db)
    programs = _create_programs(db, coaches)
    _create_structure(db, programs)

    if not db.query(FavoriteProgram).first() and programs:
        sample = FavoriteProgram(user_id=1, program_id=programs[0].id, added_at=datetime.utcnow())
        db.add(sample)
        db.commit()
