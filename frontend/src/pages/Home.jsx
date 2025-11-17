import React from "react";
import HeroSection from "../components/HeroSection";

const features = [
  {
    icon: "🔍",
    title: "Comparaison intelligente des produits",
    description: "Analysez rapidement les offres fitness et trouvez l'option idéale sans effort.",
  },
  {
    icon: "⭐",
    title: "Favoris synchronisés",
    description: "Sauvegardez vos sélections et retrouvez-les sur tous vos appareils.",
  },
  {
    icon: "🧠",
    title: "Recommandations basées sur la data fitness",
    description: "Des suggestions personnalisées selon vos objectifs et votre style d'entraînement.",
  },
  {
    icon: "🏋️‍♀️",
    title: "Programmes personnalisés",
    description: "Créez des plans adaptés à votre niveau et suivez vos progrès en continu.",
  },
  {
    icon: "📦",
    title: "Intégration de SerpAPI",
    description: "Des données fiables pour enrichir vos recherches et vos comparatifs produits.",
  },
  {
    icon: "⚡",
    title: "Interface rapide & responsive",
    description: "Une expérience fluide sur mobile et desktop, pensée pour aller droit au but.",
  },
];

const whyPoints = [
  "Des insights actionnables pour lancer vos concepts plus vite.",
  "Une plateforme centrée sur la communauté et l'expérience utilisateur.",
  "Des outils modulaires pour tester, comparer et itérer facilement.",
  "Un support dédié pour vous accompagner à chaque étape.",
];

function Home() {
  return (
    <main className="bg-gray-50">
      <HeroSection />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Fonctionnalités clés</p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Pensé pour les créateurs fitness</h2>
          <p className="text-base text-gray-600 sm:text-lg">
            Tout ce dont vous avez besoin pour comparer, sélectionner et partager vos trouvailles en un clin d'œil.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex h-full flex-col gap-4 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition duration-200 hover:scale-[1.02] hover:bg-orange-50 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">{feature.icon}</div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
              <div className="mt-auto text-sm font-semibold text-orange-600 opacity-0 transition duration-200 group-hover:opacity-100">
                Découvrir →
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Pourquoi Fitidea ?</p>
            <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              La plateforme qui propulse vos projets fitness
            </h2>
            <p className="text-base text-gray-600 sm:text-lg">
              Fitidea réunit les données, les outils et l'inspiration nécessaires pour transformer vos idées en expériences
              concrètes. Créez, itérez et partagez vos innovations avec une communauté engagée.
            </p>
            <ul className="space-y-3">
              {whyPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-gray-700">
                  <span className="mt-0.5 text-lg text-orange-500">✔</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-8 shadow-md">
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-3xl">💪</div>
              <h3 className="text-2xl font-semibold text-gray-900">Boostez vos lancements</h3>
              <p className="text-gray-600">
                Une carte d'inspiration moderne pour visualiser vos parcours utilisateurs, mettre en avant vos produits et
                mesurer l'impact de chaque nouvelle idée.
              </p>
              <div className="mt-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-md">
                🚀 Prêt à passer à l'action
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
