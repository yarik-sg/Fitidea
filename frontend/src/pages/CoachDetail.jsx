import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProgramCard from "../components/ProgramCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function CoachDetail() {
  const { id } = useParams();
  const [coach, setCoach] = useState(null);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/programs/coaches/${id}`).then((res) => res.json()).then(setCoach);
    fetch(`${API_URL}/programs?coach_id=${id}`).then((res) => res.json()).then((data) => setPrograms(data.items || []));
  }, [id]);

  if (!coach) {
    return (
      <main className="min-h-screen bg-gray-50 pb-12 pt-8 font-sans">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="h-48 animate-pulse rounded-3xl bg-orange-50/60" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-12 pt-8 font-sans">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center gap-4 rounded-3xl border border-orange-100 bg-white p-6 shadow-md shadow-orange-50">
          <img src={coach.image_url} alt={coach.name} className="h-24 w-24 rounded-full object-cover ring-4 ring-orange-50" />
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Coach</p>
            <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">{coach.name}</h1>
            <p className="text-sm text-orange-600">{coach.specialty}</p>
            <p className="text-sm text-gray-700 max-w-3xl">{coach.bio}</p>
            <div className="flex gap-3 text-sm font-semibold text-orange-600">
              {coach.instagram && (
                <a href={coach.instagram} target="_blank" rel="noreferrer" className="hover:underline">
                  Instagram
                </a>
              )}
              {coach.youtube && (
                <a href={coach.youtube} target="_blank" rel="noreferrer" className="hover:underline">
                  YouTube
                </a>
              )}
            </div>
          </div>
          <Link
            to="/programs"
            className="ml-auto inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-100"
          >
            ← Retour
          </Link>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-9 w-9 rounded-full bg-orange-100 text-lg text-orange-600 shadow-inner" aria-hidden>
              <span className="flex h-full items-center justify-center">📋</span>
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Programmes du coach</p>
              <h2 className="text-xl font-semibold text-gray-900">Suivez ses plans signatures</h2>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
