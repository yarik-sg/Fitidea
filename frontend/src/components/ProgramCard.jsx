import React from "react";
import { Link } from "react-router-dom";

const levelColors = {
  debutant: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  intermédiaire: "bg-orange-50 text-orange-700 ring-orange-100",
  intermediaire: "bg-orange-50 text-orange-700 ring-orange-100",
  avancé: "bg-rose-50 text-rose-700 ring-rose-100",
  avance: "bg-rose-50 text-rose-700 ring-rose-100",
};

export default function ProgramCard({ program }) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-orange-100 bg-white/90 p-5 shadow-sm shadow-orange-50 transition duration-150 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100">
      <div className="overflow-hidden rounded-xl bg-orange-50/70">
        <img
          src={program.image_url}
          alt={program.title}
          className="h-44 w-full object-cover"
        />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ${
              levelColors[(program.level || "").toLowerCase()] || "bg-gray-50 text-gray-700 ring-gray-100"
            }`}
          >
            <span aria-hidden>🔥</span>
            {program.level || "Niveau"}
          </p>
          <h3 className="text-lg font-semibold text-gray-900">{program.title}</h3>
          <p className="text-sm text-gray-600">{program.goal}</p>
        </div>
        <span className="rounded-xl bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-100">
          {program.duration_weeks} semaines
        </span>
      </div>

      {program.coach && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <img
            src={program.coach.image_url}
            alt={program.coach.name}
            className="h-8 w-8 rounded-full object-cover ring-2 ring-orange-100"
          />
          <span>{program.coach.name}</span>
        </div>
      )}

      <Link
        to={`/programs/${program.id}`}
        className="mt-auto inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
      >
        Voir le détail
      </Link>
    </div>
  );
}
