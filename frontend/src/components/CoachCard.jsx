import React from "react";
import { Link } from "react-router-dom";

export default function CoachCard({ coach }) {
  return (
    <div className="flex h-full flex-col items-center gap-3 rounded-2xl border border-orange-100 bg-white p-5 text-center shadow-sm shadow-orange-50">
      <img
        src={coach.image_url}
        alt={coach.name}
        className="h-20 w-20 rounded-full object-cover ring-4 ring-orange-50"
      />
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">{coach.name}</h3>
        <p className="text-sm text-orange-600 font-semibold">{coach.specialty}</p>
        <p className="text-sm text-gray-600 line-clamp-2">{coach.bio}</p>
      </div>
      <Link
        to={`/coaches/${coach.id}`}
        className="mt-auto inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600"
      >
        Voir le coach
      </Link>
    </div>
  );
}
