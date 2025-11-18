import React from "react";
import { Link } from "react-router-dom";

const brandTone = {
  basicfit: "bg-orange-100 text-orange-700",
  fitnesspark: "bg-amber-100 text-amber-700",
  neoness: "bg-emerald-100 text-emerald-700",
  onair: "bg-indigo-100 text-indigo-700",
  keepcool: "bg-teal-100 text-teal-700",
};

function GymCard({ gym }) {
  const badgeTone = brandTone[gym.brand] ?? "bg-orange-50 text-orange-700";
  const priceLabel = gym.price ? gym.price : null;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-orange-100 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <div className="overflow-hidden rounded-xl border border-orange-50 bg-gray-50">
          {gym.image_url ? (
            <img
              src={gym.image_url}
              alt={gym.name}
              className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-40 w-full items-center justify-center text-3xl text-orange-300">🏟️</div>
          )}
        </div>

        {gym.brand ? (
          <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${badgeTone}`}>
            {gym.brand}
          </span>
        ) : null}

        {priceLabel ? (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 shadow-sm">
            {priceLabel}
          </span>
        ) : null}

        {gym.opened_24_7 ? (
          <span className="absolute right-3 top-3 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm">
            24/7
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">{gym.name}</h3>
            <p className="text-sm text-gray-600">{gym.city ?? gym.address ?? "Ville à venir"}</p>
          </div>
          {gym.logo_url ? (
            <img src={gym.logo_url} alt={gym.name} className="h-12 w-24 object-contain" />
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <div className="flex flex-col text-xs text-gray-500">
            {gym.country ? <span>{gym.country}</span> : null}
            {gym.last_synced ? <span>Sync: {new Date(gym.last_synced).toLocaleDateString()}</span> : null}
          </div>
          <Link
            to={`/gyms/${gym.id}`}
            className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
          >
            Voir les détails
          </Link>
        </div>
      </div>
    </article>
  );
}

export default GymCard;
