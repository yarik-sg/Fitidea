import React from "react";
import { Link, useParams } from "react-router-dom";

const mockGyms = [
  {
    id: "1",
    name: "Pulse Factory",
    city: "Paris",
    address: "32 Rue Oberkampf, 75011 Paris",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    perks: [
      "Douches individuelles premium",
      "Ouvert 6h - 23h tous les jours",
      "Coaching personnalisé sur rendez-vous",
    ],
    plans: [
      { name: "Basic", price: "29€ / mois", description: "Accès hors heures de pointe" },
      { name: "Medium", price: "39€ / mois", description: "Accès illimité + cours collectifs" },
      { name: "Premium", price: "55€ / mois", description: "Tout inclus + suivi nutritionnel" },
    ],
  },
  {
    id: "2",
    name: "Athletica Club",
    city: "Lyon",
    address: "14 Quai Antoine, 69002 Lyon",
    image:
      "https://images.unsplash.com/photo-1518611012118-53ff19c005b0?auto=format&fit=crop&w=1200&q=80",
    perks: [
      "Douches et sauna scandinave",
      "Ouvert 24/7 avec badge", 
      "Coaching premium small-group",
    ],
    plans: [
      { name: "Basic", price: "25€ / mois", description: "Accès illimité aux machines" },
      { name: "Medium", price: "35€ / mois", description: "Cours collectifs inclus" },
      { name: "Premium", price: "49€ / mois", description: "Coaching 1:1 mensuel" },
    ],
  },
];

function GymDetail() {
  const { id } = useParams();
  const gym = mockGyms.find((item) => item.id === id) ?? mockGyms[0];

  return (
    <main className="min-h-screen bg-gray-50 pb-12 pt-8 font-sans">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">Salle de sport</p>
            <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">{gym.name}</h1>
            <p className="text-sm text-gray-600">
              {gym.city} · {gym.address}
            </p>
          </div>
          <Link
            to="/gyms"
            className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
          >
            ← Retour aux salles
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-lg shadow-orange-50">
            <div className="aspect-[21/9] w-full bg-gradient-to-br from-orange-50 via-white to-orange-100">
              <img
                src={gym.image}
                alt={gym.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-md shadow-orange-50">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Abonnements</p>
                  <h2 className="text-xl font-semibold text-gray-900">Choisissez votre formule</h2>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-100"
                >
                  ☆ Ajouter aux favoris
                </button>
              </div>
              <div className="mt-4 grid gap-3">
                {gym.plans.map((plan) => (
                  <div
                    key={plan.name}
                    className="flex items-center justify-between rounded-2xl bg-orange-50/60 px-4 py-3 text-sm text-gray-800"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{plan.name}</p>
                      <p className="text-xs text-gray-600">{plan.description}</p>
                    </div>
                    <span className="text-sm font-semibold text-orange-600">{plan.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-3xl border border-orange-100 bg-white p-5 shadow-md shadow-orange-50">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Avantages</p>
              <h2 className="text-xl font-semibold text-gray-900">Pensé pour vos performances</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {gym.perks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-start gap-3 rounded-2xl bg-orange-50/60 p-3 text-sm text-gray-800"
                  >
                    <span className="mt-0.5 text-orange-500">✓</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default GymDetail;
