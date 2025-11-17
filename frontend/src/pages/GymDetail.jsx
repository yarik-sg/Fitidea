import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";

function GymDetail() {
  const { id } = useParams();

  const { data: gym, isLoading, isError, refetch } = useQuery({
    queryKey: ["gym", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/gyms/${id}`);
      return data;
    },
  });

  return (
    <main className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">Salle de sport</p>
          <h1 className="page-title text-left">{gym?.name || "Chargement..."}</h1>
          {gym ? (
            <p className="text-sm text-gray-600">
              {gym.city ? `${gym.city} · ` : ""}
              {gym.address}
            </p>
          ) : null}
        </div>
        <Link
          to="/gyms"
          className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
        >
          ← Retour aux salles
        </Link>
      </div>

      {isError ? (
        <div className="rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-50 via-white to-orange-100 p-6 text-sm text-gray-700 shadow-md shadow-orange-50">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold text-gray-900">Salle introuvable</p>
                <p className="text-gray-600">La page demandée n'existe pas ou a été retirée.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={refetch}
              className="inline-flex items-center rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
            >
              Réessayer
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-lg shadow-orange-50">
          <div className="aspect-[21/9] w-full bg-gradient-to-br from-orange-50 via-white to-orange-100">
            {gym?.image_url ? (
              <img src={gym.image_url} alt={gym.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl text-orange-300">🏟️</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-md shadow-orange-50">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Informations</p>
                <h2 className="text-xl font-semibold text-gray-900">Planifiez votre visite</h2>
              </div>
              {gym?.brand ? (
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                  {gym.brand}
                </span>
              ) : null}
            </div>

            <div className="mt-4 grid gap-3 text-sm text-gray-700">
              <div className="rounded-2xl bg-orange-50/70 p-3">
                <p className="font-semibold text-gray-900">Adresse</p>
                <p>{gym?.address ?? "Adresse à venir"}</p>
              </div>
              <div className="rounded-2xl bg-orange-50/70 p-3">
                <p className="font-semibold text-gray-900">Horaires</p>
                <p>{gym?.opened_24_7 ? "Ouvert 24/7" : "Selon les horaires officiels"}</p>
              </div>
            </div>

            {gym?.url ? (
              <a
                href={gym.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
              >
                Aller au site officiel
              </a>
            ) : null}
          </div>

          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-md shadow-orange-50">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Localisation</p>
            <h2 className="text-xl font-semibold text-gray-900">Carte à venir</h2>
            <div className="mt-3 flex h-48 items-center justify-center rounded-2xl border border-dashed border-orange-200 bg-orange-50/50 text-sm text-gray-500">
              📍 Intégration carte prochaine itération
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-sm text-gray-500">Chargement des informations...</div>
      ) : null}
    </main>
  );
}

export default GymDetail;
