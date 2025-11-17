import React from "react";

const goals = ["prise_masse", "perte_poids", "performance", "bien_etre"];
const levels = ["débutant", "intermédiaire", "avancé"];
const durations = [4, 6, 8, 12];

export default function ProgramFilters({ filters, coaches, onChange, onReset }) {
  return (
    <div className="flex flex-wrap gap-4 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm shadow-orange-50">
      <input
        type="text"
        placeholder="Rechercher un programme"
        value={filters.search || ""}
        onChange={(e) => onChange({ search: e.target.value })}
        className="w-full rounded-xl border border-orange-100 bg-orange-50/60 px-3 py-2 text-sm focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300"
      />
      <div className="flex flex-wrap gap-3">
        <select
          value={filters.goal || ""}
          onChange={(e) => onChange({ goal: e.target.value || null })}
          className="rounded-lg border border-orange-100 px-3 py-2 text-sm focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300"
        >
          <option value="">Objectif</option>
          {goals.map((g) => (
            <option key={g} value={g}>
              {g.replace("_", " ")}
            </option>
          ))}
        </select>
        <select
          value={filters.level || ""}
          onChange={(e) => onChange({ level: e.target.value || null })}
          className="rounded-lg border border-orange-100 px-3 py-2 text-sm focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300"
        >
          <option value="">Niveau</option>
          {levels.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>
        <select
          value={filters.duration || ""}
          onChange={(e) => onChange({ duration: e.target.value ? Number(e.target.value) : null })}
          className="rounded-lg border border-orange-100 px-3 py-2 text-sm focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300"
        >
          <option value="">Durée</option>
          {durations.map((d) => (
            <option key={d} value={d}>
              {d} semaines
            </option>
          ))}
        </select>
        <select
          value={filters.coach_id || ""}
          onChange={(e) => onChange({ coach_id: e.target.value ? Number(e.target.value) : null })}
          className="rounded-lg border border-orange-100 px-3 py-2 text-sm focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300"
        >
          <option value="">Coach</option>
          {coaches.map((coach) => (
            <option key={coach.id} value={coach.id}>
              {coach.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center rounded-lg border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
