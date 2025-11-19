import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import { useAuth } from "../lib/auth";

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-orange-100 bg-white/80 shadow-sm shadow-orange-50">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-semibold text-gray-900">{title}</span>
        <span className="text-orange-600">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="border-t border-orange-50 px-4 py-3 text-sm text-gray-700">{children}</div>}
    </div>
  );
}

export default function ProgramDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [favorite, setFavorite] = useState(false);
  const [favoriteError, setFavoriteError] = useState("");

  const programQuery = useQuery({
    queryKey: ["program", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/programs/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });

  const weeksQuery = useQuery({
    queryKey: ["program-weeks", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/programs/${id}/weeks`);
      return data;
    },
    enabled: Boolean(id),
  });

  const sessionsQuery = useQuery({
    queryKey: ["program-sessions", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/programs/${id}/sessions`);
      return data;
    },
    enabled: Boolean(id),
  });

  const favoriteMutation = useMutation({
    mutationFn: async (shouldRemove) => {
      if (shouldRemove) {
        await apiClient.delete(`/programs/${id}/favorite`);
        return false;
      }
      await apiClient.post(`/programs/${id}/favorite`);
      return true;
    },
    onSuccess: (nextState) => {
      setFavorite(nextState);
      setFavoriteError("");
    },
    onError: (error) => {
      const detail = error.response?.data?.detail || "Impossible d'actualiser votre favori.";
      setFavoriteError(detail);
    },
  });

  const handleFavorite = () => {
    if (!isAuthenticated || favoriteMutation.isPending) {
      return;
    }
    favoriteMutation.mutate(favorite);
  };

  if (programQuery.isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 pb-12 pt-8 font-sans">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="h-72 animate-pulse rounded-3xl bg-orange-50/70" />
        </div>
      </main>
    );
  }

  if (programQuery.isError) {
    return (
      <main className="min-h-screen bg-gray-50 pb-12 pt-8 font-sans">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="rounded-3xl border border-orange-100 bg-white p-8 text-center text-gray-700 shadow-sm">
            <p className="text-lg font-semibold text-gray-900">Programme introuvable</p>
            <p className="text-sm text-gray-600">Il a peut-être été retiré ou n'existe plus.</p>
            <Link
              to="/programs"
              className="mt-4 inline-flex items-center justify-center rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600"
            >
              Retourner aux programmes
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const program = programQuery.data;
  const weeks = weeksQuery.data || [];
  const sessions = sessionsQuery.data || [];

  return (
    <main className="min-h-screen bg-gray-50 pb-12 pt-8 font-sans">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">Programme</p>
            <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">{program.title}</h1>
            <p className="text-sm text-gray-600">
              Niveau {program.level} · {program.duration_weeks} semaines · Objectif : {program.goal}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleFavorite}
                disabled={favoriteMutation.isPending}
                className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-100 disabled:opacity-50"
              >
                {favorite ? "★ Retirer" : "☆ Favori"}
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm"
              >
                Connectez-vous pour ajouter aux favoris
              </Link>
            )}
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
            >
              ← Voir les programmes
            </Link>
          </div>
        </div>

        {favoriteError && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{favoriteError}</div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-lg shadow-orange-50">
            <div className="aspect-[16/9] w-full bg-gradient-to-br from-orange-50 via-white to-orange-100">
              <img src={program.image_url} alt={program.title} className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-md shadow-orange-50">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Coach</p>
                  <h2 className="text-xl font-semibold text-gray-900">{program.coach?.name}</h2>
                  <p className="text-sm text-gray-600">{program.coach?.specialty}</p>
                </div>
                {program.coach?.id && (
                  <Link
                    to={`/coaches/${program.coach.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-100"
                  >
                    Voir le coach
                  </Link>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-md shadow-orange-50">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Sessions</p>
              <div className="mt-3 space-y-3">
                {sessions.map((session) => (
                  <Accordion key={session.id} title={`${session.title} · ${session.duration_minutes} min`}>
                    <ul className="space-y-2">
                      {session.exercises?.map((ex) => (
                        <li key={ex.id} className="flex items-center justify-between rounded-lg bg-orange-50/80 px-3 py-2">
                          <div>
                            <p className="font-semibold text-gray-800">{ex.name}</p>
                            <p className="text-xs text-gray-600">
                              {ex.sets} séries · {ex.reps}
                            </p>
                          </div>
                          {ex.video_url && (
                            <a
                              href={ex.video_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-orange-600"
                            >
                              Vidéo →
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </Accordion>
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
          <p className="text-base leading-relaxed text-gray-700 whitespace-pre-line">{program.description}</p>
        </div>

        <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-md shadow-orange-50">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Structure hebdomadaire</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {weeks.map((week) => (
              <div key={week.id} className="rounded-2xl bg-orange-50/70 p-4">
                <p className="text-sm font-semibold text-orange-700">Semaine {week.week_number}</p>
                <p className="text-xs text-gray-600">{week.sessions?.length || 0} sessions</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
