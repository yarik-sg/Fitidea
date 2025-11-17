import React, { useEffect, useMemo, useState } from "react";
import ProgramCard from "../components/ProgramCard";
import ProgramFilters from "../components/ProgramFilters";
import CoachCard from "../components/CoachCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function fetchJson(url, options) {
  return fetch(url, options).then((res) => res.json());
}

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [meta, setMeta] = useState({ page: 1, page_size: 12, total: 0 });
  const [filters, setFilters] = useState({ page: 1 });
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        params.append(key, value);
      }
    });
    return params.toString();
  }, [filters]);

  useEffect(() => {
    fetchJson(`${API_URL}/programs/coaches`).then(setCoaches).catch(() => setCoaches([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchJson(`${API_URL}/programs?${queryString}`)
      .then((data) => {
        setPrograms(data.items || []);
        setMeta({ page: data.page, page_size: data.page_size, total: data.total });
      })
      .catch(() => setPrograms([]))
      .finally(() => setLoading(false));
  }, [queryString]);

  const handleChange = (partial) => setFilters((prev) => ({ ...prev, page: 1, ...partial }));
  const handleReset = () => setFilters({ page: 1 });

  const totalPages = Math.max(1, Math.ceil((meta.total || 0) / (meta.page_size || 1)));

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/70 via-white to-white py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="space-y-3 text-center">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-base">📋</span>
            Programmes d'entraînement
          </p>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Sélection de programmes sur-mesure</h1>
          <p className="max-w-3xl mx-auto text-sm text-gray-600">
            Des parcours guidés pour tous les niveaux : prise de masse, perte de poids, cardio ou mobilité. Choisissez et lancez-vous immédiatement.
          </p>
        </header>

        <ProgramFilters filters={filters} coaches={coaches} onChange={handleChange} onReset={handleReset} />

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-72 animate-pulse rounded-2xl bg-orange-50/60" />
            ))}
          </div>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </section>
        )}

        <div className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-sm shadow-orange-50">
          <button
            type="button"
            disabled={meta.page <= 1}
            onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-orange-600 disabled:opacity-40"
          >
            ← Précédent
          </button>
          <p className="text-sm text-gray-600">
            Page {meta.page} sur {totalPages} ({meta.total} programmes)
          </p>
          <button
            type="button"
            disabled={meta.page >= totalPages}
            onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-orange-600 disabled:opacity-40"
          >
            Suivant →
          </button>
        </div>

        {coaches.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-9 w-9 rounded-full bg-orange-100 text-lg text-orange-600 shadow-inner" aria-hidden>
                <span className="flex h-full items-center justify-center">🏅</span>
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Coachs certifiés</p>
                <h2 className="text-xl font-semibold text-gray-900">Découvrez notre équipe</h2>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coaches.map((coach) => (
                <CoachCard key={coach.id} coach={coach} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
