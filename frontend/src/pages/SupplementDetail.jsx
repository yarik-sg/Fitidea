import React from "react";
import { Link, useParams } from "react-router-dom";

const mockSupplements = [
  {
    id: "1",
    name: "Whey Isolate Elite",
    category: "Protéine",
    price: 39.9,
    brand: "Fitidea Labs",
    rating: 4.7,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1549572189-0ba9663c80ed?auto=format&fit=crop&w=1200&q=80",
    keyPoints: [
      "25g de protéines par dose",
      "BCAA naturels pour la récupération",
      "Se mélange instantanément sans grumeaux",
    ],
    description:
      "Un isolat de whey ultra-filtré pour maximiser vos performances. Idéal après l'entraînement pour soutenir la récupération musculaire et le développement de masse maigre."
      + " Formulé pour être digeste et limiter le lactose, avec des arômes gourmands sans sucres ajoutés.",
  },
  {
    id: "2",
    name: "Multivitamines Performance",
    category: "Santé",
    price: 24.5,
    brand: "Vital Boost",
    rating: 4.5,
    reviews: 86,
    image:
      "https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=1200&q=80",
    keyPoints: [
      "12 vitamines essentielles",
      "Renforce l'immunité",
      "Adapté aux sportifs réguliers",
    ],
    description:
      "Un complexe multivitaminé pensé pour accompagner vos entraînements et soutenir l'énergie au quotidien."
      + " Chaque gélule est optimisée pour améliorer la récupération et protéger des carences fréquentes chez les athlètes.",
  },
];

function SupplementDetail() {
  const { id } = useParams();
  const supplement =
    mockSupplements.find((item) => item.id === id) ?? mockSupplements[0];

  return (
    <main className="min-h-screen bg-gray-50 pb-12 pt-8 font-sans">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">
              {supplement.category}
            </p>
            <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
              {supplement.name}
            </h1>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
          >
            ← Voir les suppléments
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="rounded-3xl border border-orange-100 bg-white p-4 shadow-lg shadow-orange-50">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-white to-orange-100">
              <img
                src={supplement.image}
                alt={supplement.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-md shadow-orange-50">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-500">Prix</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {supplement.price.toFixed(2)} €
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-100"
                >
                  ☆ Ajouter aux favoris
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="rounded-2xl bg-orange-50/50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-600">
                    Marque
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {supplement.brand}
                  </p>
                </div>
                <div className="rounded-2xl bg-orange-50/50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-600">
                    Note / Avis
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {supplement.rating}/5 · {supplement.reviews} avis
                  </p>
                </div>
                <div className="rounded-2xl bg-orange-50/50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-600">
                    Catégorie
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {supplement.category}
                  </p>
                </div>
                <div className="rounded-2xl bg-orange-50/50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-600">
                    Disponibilité
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    En stock immédiat
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-orange-100 bg-white p-5 shadow-md shadow-orange-50">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
                  Points clés
                </p>
                <h2 className="text-xl font-semibold text-gray-900">Pourquoi vous allez aimer</h2>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {supplement.keyPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 rounded-2xl bg-orange-50/60 p-3 text-sm text-gray-800"
                  >
                    <span className="mt-0.5 text-orange-500">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-md shadow-orange-50">
          <div className="flex items-center gap-2 pb-3">
            <span className="h-9 w-9 rounded-full bg-orange-100 text-lg text-orange-600 shadow-inner" aria-hidden>
              <span className="flex h-full items-center justify-center">🧾</span>
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
                Description
              </p>
              <h2 className="text-xl font-semibold text-gray-900">Tout savoir sur ce produit</h2>
            </div>
          </div>
          <p className="text-base leading-relaxed text-gray-700">{supplement.description}</p>
        </div>
      </div>
    </main>
  );
}

export default SupplementDetail;
