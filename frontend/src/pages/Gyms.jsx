import React from "react";

const gyms = [
  {
    id: 1,
    name: "UrbanFit Center",
    city: "Paris",
    price: "39€/mois",
    logo: "https://dummyimage.com/120x120/f97316/fff&text=UF",
  },
  {
    id: 2,
    name: "Orange Gym Club",
    city: "Lyon",
    price: "29€/mois",
  },
  {
    id: 3,
    name: "Pulse Arena",
    city: "Marseille",
    price: "44€/mois",
    logo: "https://dummyimage.com/120x120/ffedd5/f97316&text=PA",
  },
  {
    id: 4,
    name: "Energie Studio",
    city: "Bordeaux",
    price: "35€/mois",
  },
  {
    id: 5,
    name: "Atlas Performance",
    city: "Toulouse",
    price: "49€/mois",
    logo: "https://dummyimage.com/120x120/fff7ed/f97316&text=AP",
  },
];

function GymCard({ gym }) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-orange-100 bg-white/90 p-5 shadow-sm shadow-orange-50 transition duration-150 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-orange-50 shadow-inner shadow-orange-100">
          {gym.logo ? (
            <img src={gym.logo} alt={gym.name} className="h-full w-full rounded-xl object-cover" />
          ) : (
            <span className="text-2xl">🏋️‍♂️</span>
          )}
        </div>
        <div className="flex flex-1 flex-col">
          <h3 className="text-lg font-semibold text-gray-900">{gym.name}</h3>
          <p className="text-sm text-gray-600">{gym.city}</p>
        </div>
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-100">
          {gym.price}
        </span>
      </div>

      <button
        type="button"
        className="mt-auto inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
      >
        Voir la salle
      </button>
    </div>
  );
}

function Gyms() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/70 via-white to-white py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 space-y-3 text-center sm:mb-10">
          <p className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-base">🏟️</span>
            Salles de sport partenaires
          </p>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Trouvez la salle idéale près de chez vous</h1>
          <p className="max-w-3xl mx-auto text-sm text-gray-600">
            Une sélection soignée de salles de sport avec une grille tarifaire claire et un design cohérent avec l'univers Fitidea.
          </p>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gyms.map((gym) => (
            <GymCard key={gym.id} gym={gym} />
          ))}
        </section>
      </div>
    </main>
  );
}

export default Gyms;
