import React from "react";
import { Link } from "react-router-dom";

const categories = [
  {
    label: "Programmes",
    description: "Plans d'entraînement structurés pour tous les niveaux.",
    icon: "💪",
  },
  {
    label: "Accessoires",
    description: "Équipements soigneusement sélectionnés pour performer.",
    icon: "🎽",
  },
  {
    label: "Coaching",
    description: "Accompagnement personnalisé pour atteindre vos objectifs.",
    icon: "🧭",
  },
  {
    label: "Nutrition",
    description: "Guides et recettes pour optimiser votre énergie.",
    icon: "🥗",
  },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(255, 106, 0, 0.18) 0, rgba(255, 106, 0, 0.05) 35%, transparent 60%)",
        }}
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 sm:gap-16 sm:px-6 lg:flex-row lg:items-center lg:gap-20 lg:px-8 lg:py-24">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
            <span className="inline-block h-2 w-2 rounded-full bg-orange-500" />
            <span>Fitidea • Innovation fitness</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Boostez vos idées fitness avec Fitidea
            </h1>
            <p className="text-lg text-gray-600 sm:text-xl">
              Une plateforme pensée pour les passionnés qui veulent concevoir, lancer et
              monétiser leurs projets fitness avec simplicité.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              to="/products"
              className="w-full rounded-full bg-[#FF6A00] px-6 py-3 text-center text-base font-semibold text-white shadow-lg transition duration-200 hover:scale-[1.02] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A00] sm:w-auto"
            >
              Explorer les produits
            </Link>
            <Link
              to="/signup"
              className="w-full rounded-full border border-[#FF6A00] px-6 py-3 text-center text-base font-semibold text-[#FF6A00] transition duration-200 hover:bg-orange-50 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A00] sm:w-auto"
            >
              Créer un compte
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 font-medium text-orange-600">
              <span className="text-lg">⚡</span> Idées instantanées
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 font-medium text-orange-600">
              <span className="text-lg">🛠️</span> Outils prêts à l'emploi
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 font-medium text-orange-600">
              <span className="text-lg">🤝</span> Communauté engagée
            </span>
          </div>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {categories.map((category) => (
              <div
                key={category.label}
                className="group flex flex-col gap-3 rounded-xl bg-white p-6 shadow-md transition duration-200 hover:scale-105 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-2xl">
                  {category.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">{category.label}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
                <div className="mt-auto text-sm font-semibold text-orange-600 opacity-0 transition duration-200 group-hover:opacity-100">
                  Découvrir →
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
