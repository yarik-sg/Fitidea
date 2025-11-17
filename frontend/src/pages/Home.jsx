import React from "react";

const categories = [
  {
    icon: "📋",
    title: "Programmes",
    description: "Plans prêts à lancer pour coachs et studios en quête d'impact.",
    link: "Découvrir →",
  },
  {
    icon: "🎒",
    title: "Accessoires",
    description: "Comparaisons rapides pour choisir le meilleur équipement.",
    link: "Découvrir →",
  },
  {
    icon: "🤝",
    title: "Coaching",
    description: "Outils pour structurer, vendre et suivre vos offres premium.",
    link: "Découvrir →",
  },
  {
    icon: "🥑",
    title: "Nutrition",
    description: "Guides et packs pour allier saveurs, équilibre et résultats.",
    link: "Découvrir →",
  },
];

const featureBlocks = [
  {
    icon: "💡",
    title: "Idées instantanées",
    description: "Des concepts clairs pour lancer vos nouveautés sans partir de zéro.",
  },
  {
    icon: "🛠️",
    title: "Outils prêts à l'emploi",
    description: "Templates, fiches produits et checklists pensés pour le fitness.",
  },
  {
    icon: "🤝",
    title: "Communauté engagée",
    description: "Partagez vos découvertes et co-créez avec des pros passionnés.",
  },
  {
    icon: "📈",
    title: "Analyse intelligente",
    description: "Comparez les performances, suivez les prix et anticipez la demande.",
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
              Fitidea • SaaS Fitness
            </span>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
                Boostez vos lancements fitness avec une page d'accueil taillée pour l'action.
              </h1>
              <p className="text-base text-gray-600 sm:text-lg">
                Comparez, sélectionnez et partagez les meilleurs produits et services fitness. Une expérience moderne, lumineuse et entièrement pensée pour les créateurs.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                href="/products"
              >
                Explorer les produits
              </a>
              <a
                className="inline-flex items-center justify-center rounded-xl border border-orange-200 px-6 py-3 text-sm font-semibold text-orange-600 transition hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                href="/register"
              >
                Créer un compte
              </a>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 ring-1 ring-orange-100">⚡ Interface rapide</span>
              <span className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 ring-1 ring-orange-100">🧠 Recos data-driven</span>
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
                    { title: "Coaching hybride", subtitle: "Connecté & personnalisé" },
                    { title: "Packs mobilité", subtitle: "Accessoires malins" },
                    { title: "Nutrition clean", subtitle: "Recettes express" },
                    { title: "Studios digitaux", subtitle: "Expériences premium" },
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
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Tout pour accélérer vos projets fitness</h2>
          <p className="text-base text-gray-600 sm:text-lg">Choisissez une catégorie et découvrez des idées prêtes à tester.</p>
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
            <span className="pill bg-white/20 text-white">💡 Pensée pour les créateurs fitness</span>
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
              Structurez vos idées, testez vos offres et inspirez votre communauté.
            </h2>
            <p className="text-base text-white/80 sm:text-lg">
              Fitidea rassemble vos comparatifs, vos favoris et vos inspirations dans un espace unique. Passez de l'idée à l'expérience en quelques minutes.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-orange-600 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
                href="/register"
              >
                Lancer mon espace
              </a>
              <a className="inline-flex items-center text-sm font-semibold text-white" href="/products">
                Voir les inspirations →
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
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Décidez vite, gardez le focus sur vos clients</h2>
            <p className="text-base text-gray-600 sm:text-lg">
              Un tableau clair pour suivre les prix, les avis et les offres alternatives. Vous choisissez ce qui compte, Fitidea fait le reste.
            </p>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3"><span className="text-xl">🛒</span><span>Vue synthétique des produits clés et des options du marché.</span></li>
              <li className="flex items-start gap-3"><span className="text-xl">📊</span><span>Filtres rapides pour comparer performances, prix et exclusivités.</span></li>
              <li className="flex items-start gap-3"><span className="text-xl">🔗</span><span>Favoris synchronisés pour partager vos sélections en équipe.</span></li>
            </ul>
          </div>
          <div className="rounded-3xl border border-orange-100 bg-white p-8 shadow-lg">
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl">🛒📊</div>
              <h3 className="text-2xl font-semibold text-gray-900">Comparateur intuitif</h3>
              <p className="text-gray-600">
                Une vue moderne pour visualiser l'essentiel et prendre des décisions en un clin d'œil, sur mobile comme sur desktop.
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
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Tout ce qu'il faut pour un SaaS fitness moderne</h2>
          <p className="text-base text-gray-600 sm:text-lg">
            Des modules rapides à déployer, une expérience cohérente, une esthétique premium blanc + orange.
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
