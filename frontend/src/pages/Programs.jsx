import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProgramCard from "../components/ProgramCard";
import ProgramFilters from "../components/ProgramFilters";
import CoachCard from "../components/CoachCard";
import apiClient from "../lib/apiClient";

const PAGE_SIZE = 12;

export default function Programs() {
  const [filters, setFilters] = useState({ page: 1 });

  const coachesQuery = useQuery({
    queryKey: ["coaches"],
    queryFn: async () => {
      const { data } = await apiClient.get("/programs/coaches");
      return data;
    },
  });

  const queryKey = useMemo(() => ({ ...filters }), [filters]);

  const programsQuery = useQuery({
    queryKey: ["training-programs", queryKey],
    queryFn: async () => {
      const params = { page: filters.page || 1, page_size: PAGE_SIZE };
      if (filters.goal) params.goal = filters.goal;
      if (filters.level) params.level = filters.level;
      if (filters.duration) params.duration = filters.duration;
      if (filters.coach_id) params.coach_id = filters.coach_id;
      if (filters.search) params.search = filters.search;
      const { data } = await apiClient.get("/programs", { params });
      return data;
    },
    keepPreviousData: true,
  });

  const handleChange = (partial) => setFilters((prev) => ({ ...prev, page: 1, ...partial }));
  const handleReset = () => setFilters({ page: 1 });

  const programs = programsQuery.data?.items || [];
  const meta = {
    page: programsQuery.data?.page || filters.page || 1,
    page_size: programsQuery.data?.page_size || PAGE_SIZE,
    total: programsQuery.data?.total || programs.length,
  };
  const totalPages = Math.max(1, Math.ceil((meta.total || 0) / (meta.page_size || PAGE_SIZE)));

  const coaches = coachesQuery.data || [];

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

        {programsQuery.isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-700">
            <p className="font-semibold text-red-800">Impossible de charger les programmes.</p>
            <button
              type="button"
              onClick={() => programsQuery.refetch()}
              className="mt-3 inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-red-700 shadow-sm"
            >
              Réessayer
            </button>
          </div>
        ) : programsQuery.isLoading ? (
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
            disabled={meta.page <= 1 || programsQuery.isFetching}
            onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-orange-600 disabled:opacity-40"
          >
            ← Précédent
          </button>
          <p className="text-sm text-gray-600">
            Page {meta.page} sur {totalPages} ({meta.total} programmes)
            {programsQuery.isFetching ? " · mise à jour..." : ""}
          </p>
          <button
            type="button"
            disabled={meta.page >= totalPages || programsQuery.isFetching}
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
