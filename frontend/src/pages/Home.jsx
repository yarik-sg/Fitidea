import React from "react";

const categories = [
  {
    icon: "📋",
    title: "Programmes",
    description: "Plans structurés pour progresser en force, cardio ou mobilité.",
    link: "Découvrir →",
  },
  {
    icon: "🎒",
    title: "Accessoires",
    description: "Bandes, haltères, sacs et tout le matériel pour booster vos séances.",
    link: "Découvrir →",
  },
  {
    icon: "🧪",
    title: "Suppléments",
    description: "Whey, créatine, BCAA : comparez ingrédients, dosages et avis.",
    link: "Découvrir →",
  },
  {
    icon: "🏋️",
    title: "Salles de sport",
    description: "Localisez des salles, studios et box adaptés à votre pratique.",
    link: "Découvrir →",
  },
];

const featureBlocks = [
  {
    icon: "💡",
    title: "Comparaisons express",
    description: "Filtres clairs pour analyser suppléments, salles et programmes en 1 clic.",
  },
  {
    icon: "🛠️",
    title: "Guides d'équipement",
    description: "Fiches détaillées whey, créatine, accessoires et packs mobilité.",
  },
  {
    icon: "🤝",
    title: "Sélections partagées",
    description: "Listes collaboratives pour choisir une salle, un stack ou une routine.",
  },
  {
    icon: "📈",
    title: "Suivi des performances",
    description: "Tableaux clairs pour suivre vos favoris, vos prix et vos résultats.",
  },
];

function Home() {
  return (
    <main className="bg-white text-gray-900">
      {/* Hero */}
      <section className="section-shell relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,106,0,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,106,0,0.1),transparent_30%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 ring-1 ring-orange-100">
              Fitidea • Suppléments • Salles • Programmes
            </span>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
                Comparez vos suppléments, trouvez votre salle et suivez le bon programme.
              </h1>
              <p className="text-base text-gray-600 sm:text-lg">
                Fitidea rassemble tout ce qui compte pour les sportifs : stacks whey + créatine, cartes des salles proches et programmes guidés pour progresser sans chercher partout.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                href="/products"
              >
                Explorer les suppléments
              </a>
              <a
                className="inline-flex items-center justify-center rounded-xl border border-orange-200 px-6 py-3 text-sm font-semibold text-orange-600 transition hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                href="/register"
              >
                Créer un compte
              </a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 ring-1 ring-orange-100">⚡ Comparaisons rapides</span>
              <span className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 ring-1 ring-orange-100">🧠 Recos sportives</span>
              <span className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 ring-1 ring-orange-100">🤝 Favoris synchronisés</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-orange-100 bg-white/80 p-6 shadow-lg shadow-orange-100 backdrop-blur">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-4 text-white shadow-md">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Nouveautés</p>
                    <h3 className="text-2xl font-bold">Sélections du moment</h3>
                  </div>
                  <span className="text-3xl">🔥</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { title: "Whey & créatine", subtitle: "Dosages optimisés" },
                    { title: "Pré-workout", subtitle: "Formules testées" },
                    { title: "Accessoires", subtitle: "Grip, bandes, sacs" },
                    { title: "Salles proches", subtitle: "Equipements & horaires" },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-orange-50 bg-orange-50/60 p-4 text-sm font-semibold text-gray-800 shadow-sm"
                    >
                      <p className="text-orange-600">{item.title}</p>
                      <p className="text-gray-700">{item.subtitle}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-orange-100 bg-white px-5 py-4 text-sm font-semibold text-gray-800 shadow-sm">
                  <span>🚀 Prêt à lancer vos prochaines offres ?</span>
                  <a className="text-orange-600 hover:text-orange-700" href="/register">
                    Commencer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="section-shell section-spacing py-12 sm:py-16">
        <div className="space-y-2 text-center">
          <p className="eyebrow text-orange-600">Catégories</p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Suppléments, salles et programmes en un seul endroit</h2>
          <p className="text-base text-gray-600 sm:text-lg">Choisissez une catégorie et découvrez les options les plus adaptées à vos objectifs.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.title}
              className="group flex h-full flex-col gap-4 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">{category.icon}</span>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
              <a className="mt-auto inline-flex items-center text-sm font-semibold text-orange-600 transition group-hover:text-orange-700" href="/products">
                {category.link}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Créateurs */}
      <section className="section-shell py-12 sm:py-16">
        <div className="relative overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-r from-orange-500 via-orange-500 to-orange-400 p-8 shadow-lg sm:p-10">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
          <div className="space-y-4 text-white">
            <span className="pill bg-white/20 text-white">💡 Pensée pour les sportifs ambitieux</span>
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
              Choisissez votre stack, votre salle et un programme qui tient la route.
            </h2>
            <p className="text-base text-white/80 sm:text-lg">
              Fitidea centralise vos comparatifs de suppléments, vos listes de salles et vos plans d'entraînement. Vous passez de l'idée à la séance en quelques minutes.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-orange-600 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                href="/register"
              >
                Créer mon espace sportif
              </a>
              <a className="inline-flex items-center text-sm font-semibold text-white" href="/products">
                Voir les comparatifs →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Comparaison */}
      <section className="section-shell py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <p className="eyebrow text-orange-600">Comparaison intelligente</p>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Décidez vite, gardez le focus sur vos performances</h2>
            <p className="text-base text-gray-600 sm:text-lg">
              Un tableau clair pour comparer whey, créatine, pré-workout ou salles de sport. Vous choisissez vos critères, Fitidea vous montre les meilleures options.
            </p>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3"><span className="text-xl">🛒</span><span>Vue synthétique des protéines, boosters et équipements clés.</span></li>
              <li className="flex items-start gap-3"><span className="text-xl">📊</span><span>Filtres rapides pour comparer dosages, labels qualité et prix.</span></li>
              <li className="flex items-start gap-3"><span className="text-xl">🏋️‍♀️</span><span>Repérez les salles selon l'équipement, les horaires et les avis.</span></li>
            </ul>
          </div>
          <div className="rounded-3xl border border-orange-100 bg-white p-8 shadow-lg">
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl">🛒📊</div>
              <h3 className="text-2xl font-semibold text-gray-900">Comparateur fitness</h3>
              <p className="text-gray-600">
                Une vue moderne pour visualiser l'essentiel et prendre des décisions en un clin d'œil sur vos compléments, salles et plans d'entraînement.
              </p>
              <a className="text-sm font-semibold text-orange-600" href="/favorites">
                Voir mes favoris →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="section-shell section-spacing py-12 sm:py-16">
        <div className="space-y-2 text-center">
          <p className="eyebrow text-orange-600">Fonctionnalités clés</p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Tout ce qu'il faut pour un parcours sportif complet</h2>
          <p className="text-base text-gray-600 sm:text-lg">
            Comparatifs de suppléments, cartographie des salles et programmes guidés dans une interface claire blanc + orange.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featureBlocks.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">{feature.icon}</div>
              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="section-shell border-t border-orange-100 py-8 text-sm text-gray-600">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-center">© {new Date().getFullYear()} Fitidea. Design fitness, data et inspiration.</p>
          <a className="text-orange-600 hover:text-orange-700" href="https://github.com/" target="_blank" rel="noreferrer">
            Github
          </a>
        </div>
      </footer>
    </main>
  );
}

export default Home;
