import React from "react";

const programs = [
  {
    id: 1,
    name: "Boost Débutant",
    level: "Débutant",
    duration: "4 semaines",
    goal: "Renforcement global et découverte",
  },
  {
    id: 2,
    name: "Hybrid Intermédiaire",
    level: "Intermédiaire",
    duration: "8 semaines",
    goal: "Prise de masse contrôlée",
  },
  {
    id: 3,
    name: "Shred Avancé",
    level: "Avancé",
    duration: "10 semaines",
    goal: "Perte de poids et définition",
  },
  {
    id: 4,
    name: "Cardio Pulse",
    level: "Intermédiaire",
    duration: "6 semaines",
    goal: "Amélioration du cardio et de l'endurance",
  },
  {
    id: 5,
    name: "Mobilité Flow",
    level: "Débutant",
    duration: "3 semaines",
    goal: "Assouplissement et mobilité quotidienne",
  },
];

const levelStyles = {
  Débutant: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Intermédiaire: "bg-orange-50 text-orange-700 ring-orange-100",
  Avancé: "bg-rose-50 text-rose-700 ring-rose-100",
};

function ProgramCard({ program }) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-orange-100 bg-white/90 p-5 shadow-sm shadow-orange-50 transition duration-150 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ${
              levelStyles[program.level] || "bg-gray-50 text-gray-700 ring-gray-100"
            }`}
          >
            <span aria-hidden>🔥</span>
            {program.level}
          </p>
          <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
          <p className="text-sm text-gray-600">{program.goal}</p>
        </div>
        <span className="rounded-xl bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-100">
          {program.duration}
        </span>
      </div>

      <button
        type="button"
        className="mt-auto inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
      >
        Voir le programme
      </button>
    </div>
  );
}

function Programs() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/70 via-white to-white py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 space-y-3 text-center sm:mb-10">
          <p className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-base">📋</span>
            Programmes d'entraînement
          </p>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Sélection de programmes sur-mesure</h1>
          <p className="max-w-3xl mx-auto text-sm text-gray-600">
            Des parcours guidés pour tous les niveaux : prise de masse, perte de poids, cardio ou mobilité. Choisissez et lancez-vous immédiatement.
          </p>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </section>
      </div>
    </main>
  );
}

export default Programs;
