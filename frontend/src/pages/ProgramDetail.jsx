import React from "react";
import { Link, useParams } from "react-router-dom";

const mockPrograms = [
  {
    id: "1",
    name: "Starter Strong",
    level: "Débutant",
    durationWeeks: 6,
    goal: "Renforcement global et perte de poids",
    image:
      "https://images.unsplash.com/photo-1518611012118-53f27c3f2c87?auto=format&fit=crop&w=1200&q=80",
    focus: ["Full body", "Mobilité", "Cardio modéré"],
    days: [
      { day: "Jour 1", title: "Full Body", detail: "Squat, pompes assistées, gainage" },
      { day: "Jour 3", title: "Cardio", detail: "Intervals 20 min + mobilité" },
      { day: "Jour 5", title: "Full Body", detail: "Soulevé de terre kettlebell, tirage, planche" },
    ],
    description:
      "Un programme progressif pensé pour démarrer en toute confiance. Chaque séance combine mouvements fondamentaux et travail du core pour poser des bases solides."
      + " Idéal pour adopter un rythme régulier, améliorer son cardio et apprendre les bons placements.",
  },
  {
    id: "2",
    name: "Lean Builder",
    level: "Intermédiaire",
    durationWeeks: 8,
    goal: "Prise de masse contrôlée",
    image:
      "https://images.unsplash.com/photo-1434682772747-f16d3ea162c3?auto=format&fit=crop&w=1200&q=80",
    focus: ["Push/Pull/Legs", "Volume maîtrisé", "Core renforcé"],
    days: [
      { day: "Jour 1", title: "Push", detail: "Développé couché, dips, épaules" },
      { day: "Jour 2", title: "Pull", detail: "Tractions, rowing, biceps" },
      { day: "Jour 3", title: "Legs", detail: "Squat, fentes, ischios" },
      { day: "Jour 5", title: "Full Body", detail: "Mouvements polyarticulaires + core" },
    ],
    description:
      "Un plan orienté hypertrophie pour progresser sur les fondamentaux sans compromettre la récupération."
      + " Les cycles sont structurés pour monter progressivement en volume tout en gardant des rappels de mobilité.",
  },
];

function ProgramDetail() {
  const { id } = useParams();
  const program = mockPrograms.find((item) => item.id === id) ?? mockPrograms[0];

  return (
    <main className="min-h-screen bg-gray-50 pb-12 pt-8 font-sans">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">Programme</p>
            <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">{program.name}</h1>
            <p className="text-sm text-gray-600">
              Niveau {program.level} · {program.durationWeeks} semaines · Objectif : {program.goal}
            </p>
          </div>
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
          >
            ← Voir les programmes
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-lg shadow-orange-50">
            <div className="aspect-[16/9] w-full bg-gradient-to-br from-orange-50 via-white to-orange-100">
              <img
                src={program.image}
                alt={program.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-md shadow-orange-50">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Format</p>
                  <h2 className="text-xl font-semibold text-gray-900">Contenu détaillé</h2>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-100"
                >
                  ▶ Commencer ce programme
                </button>
              </div>

              <div className="mt-4 grid gap-3">
                {program.days.map((session) => (
                  <div
                    key={session.day}
                    className="rounded-2xl bg-orange-50/60 px-4 py-3 text-sm text-gray-800"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                      {session.day} · {session.title}
                    </p>
                    <p className="text-sm text-gray-800">{session.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-3xl border border-orange-100 bg-white p-5 shadow-md shadow-orange-50">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Focus par zone</p>
              <h2 className="text-xl font-semibold text-gray-900">Ce que vous allez travailler</h2>
              <div className="flex flex-wrap gap-2">
                {program.focus.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-md shadow-orange-50">
          <div className="flex items-center gap-2 pb-3">
            <span className="h-9 w-9 rounded-full bg-orange-100 text-lg text-orange-600 shadow-inner" aria-hidden>
              <span className="flex h-full items-center justify-center">📓</span>
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Description</p>
              <h2 className="text-xl font-semibold text-gray-900">Votre roadmap Fitidea</h2>
            </div>
          </div>
          <p className="text-base leading-relaxed text-gray-700">{program.description}</p>
        </div>
      </div>
    </main>
  );
}

export default ProgramDetail;
