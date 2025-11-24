import React from "react";

const quickFilters = [
  "Protéines",
  "Équipements",
  "Vêtements",
  "Salles",
  "Programmes",
  "Bons Plans",
];

const recentItems = [
  {
    title: "Impact Whey Isolate",
    badge: "MyP",
    price: "19,99 €",
    origin: "MyProtein",
    saving: "-12 %",
  },
  {
    title: "Gold Standard Whey",
    badge: "Deca",
    price: "62,90 €",
    origin: "Decathlon",
    saving: "-8 %",
  },
  {
    title: "Myobuilder+ Creatine",
    badge: "Opti",
    price: "29,99 €",
    origin: "Optimum",
    saving: "-15 %",
  },
  {
    title: "Natural Whey",
    badge: "MyP",
    price: "19,99 €",
    origin: "MyProtein",
    saving: "-11 %",
  },
];

const collectionCards = [
  {
    title: "Mode Fitness",
    description: "Gymshark, Vanquish, NVGTN",
    badge: "NOUVEAUTÉS",
    accent: "bg-gradient-to-br from-emerald-500 via-emerald-500 to-teal-600",
  },
  {
    title: "Équipement Pro",
    description: "Équipement, Cardio, Pilates",
    badge: "TRENDING",
    accent: "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950",
  },
  {
    title: "Packs Prise de Masse",
    description: "Créatine + Vitamines",
    badge: "DISCOUNT",
    accent: "bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400",
  },
];

const nutritionProducts = [
  {
    title: "Gold Standard 100% Whey",
    subtitle: "Optimum Nutrition 2.27kg",
    price: "40,00 €",
    tags: ["Veille prix", "Traçabilité"],
  },
  {
    title: "Doypack Impact Whey",
    subtitle: "MyProtein Impact Whey 1kg",
    price: "51,49 €",
    tags: ["Veille prix", "Traçabilité"],
  },
  {
    title: "BioTech USA 100% Creatine",
    subtitle: "BioTech USA 100% Creatine 100g",
    price: "31,90 €",
    tags: ["Veille prix", "Traçabilité"],
  },
  {
    title: "Collagène Peptides",
    subtitle: "100% Collagen Peptides 400g",
    price: "32,90 €",
    tags: ["Veille prix", "Traçabilité"],
  },
];

const equipmentProducts = [
  {
    title: "Pack Hybride Musculation",
    subtitle: "Haltères + Barre + Elastic",
    price: "49,99 €",
  },
  {
    title: "Ombres kettlebell 14kg",
    subtitle: "Kettlebell fonte",
    price: "20,99 €",
  },
  {
    title: "Bande de Yoga Antidérapant",
    subtitle: "Pack 3 épaisseurs",
    price: "8,84 €",
  },
  {
    title: "Tapis anti choc",
    subtitle: "Protection sol home gym",
    price: "23,90 €",
  },
];

const trustLogos = ["MyP", "Nike", "Gym", "Deca", "Opti"];

function Home() {
  return (
    <div className="space-y-14 pb-16">
      <section className="relative overflow-hidden bg-[#0c1a2b] text-white">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(22,163,74,0.35),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.2),transparent_35%)]"
          aria-hidden
        />
        <div className="section-shell relative grid gap-10 py-14 lg:grid-cols-[1.05fr,0.95fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
              <span className="text-[10px]">⚡</span> Comparez vos achats en direct
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Vos performances,<br />au meilleur prix.</h1>
              <p className="max-w-2xl text-base text-white/80 sm:text-lg">
                L'intelligence artificielle Fitidia scanne le web pour trouver vos meilleures offres de nutrition et d'équipement en temps réel.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-3 shadow-xl shadow-black/20 backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="text"
                  placeholder="Whey, Créatine, Banc de musculation..."
                  className="w-full rounded-xl bg-white/90 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-400/30 transition hover:-translate-y-0.5 hover:bg-emerald-600">
                  Rechercher
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-emerald-50/80">
                <span className="rounded-full bg-white/10 px-3 py-1 font-semibold text-emerald-100">Salles</span>
                <span className="rounded-full bg-white/10 px-3 py-1 font-semibold text-emerald-100">Comparateur</span>
                <span className="rounded-full bg-white/10 px-3 py-1 font-semibold text-emerald-100">Programmes</span>
                <span className="rounded-full bg-white/10 px-3 py-1 font-semibold text-emerald-100">Blogs</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-emerald-50/90">
              {quickFilters.map((filter) => (
                <span key={filter} className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 font-semibold ring-1 ring-white/10">
                  <span className="text-[10px]">•</span> {filter}
                </span>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {["50+ Sites analysés", "1000+ Avis", "Avis vérifiés"].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80"
                >
                  <span>{item}</span>
                  <span className="text-lg">↗</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-14 -top-12 h-36 w-36 rounded-full bg-emerald-500/20 blur-3xl" aria-hidden />
            <div className="relative space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-emerald-500/10">
              <div className="flex items-center justify-between text-sm font-semibold text-emerald-200">
                <span className="rounded-full bg-white/5 px-3 py-1">Comparaison</span>
                <span>• Live</span>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500" />
                  <div>
                    <p className="text-sm text-white/70">Gorilla Wear</p>
                    <h3 className="text-xl font-bold">Stack Pro Whey</h3>
                  </div>
                  <div className="ms-auto text-right">
                    <p className="text-xs text-white/70">On y était hier</p>
                    <p className="text-lg font-bold text-emerald-300">52,59 €</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-white/80">
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-[11px] text-emerald-200">Shop</p>
                    <p className="font-semibold">Gorilla Wear</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-[11px] text-emerald-200">Avantage</p>
                    <p className="font-semibold">Paiement 4x</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3">
                    <p className="text-[11px] text-emerald-200">Économie</p>
                    <p className="font-semibold">8%</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-100">
                  <span className="text-lg">📈</span> Price Tracker actif
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/80">
                  <p className="text-emerald-200">Estimation</p>
                  <p className="text-lg font-semibold text-white">19,99 €</p>
                  <p>Frais de port 3.99 €</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-white/80">
                  <p className="text-emerald-200">But Everywhere</p>
                  <p className="text-lg font-semibold text-white">19,99 €</p>
                  <p>Frais de port 3.99 €</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                <span>Historique de prix • 12 derniers mois</span>
                <button className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white hover:border-emerald-300 hover:text-emerald-200">
                  Voir le graphique
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-emerald-600">RÉCEMMENT CONSULTÉS</p>
          <h2 className="text-2xl font-bold text-slate-900">Continuez vos recherches là où vous vous êtes arrêté.</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recentItems.map((item) => (
            <div key={item.title} className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-start justify-between text-xs font-semibold text-emerald-600">
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">{item.badge}</span>
                <span className="text-emerald-500">{item.saving}</span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.origin}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900">{item.price}</span>
                <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">Voir</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="rounded-2xl border border-slate-100 bg-white px-6 py-5 shadow-sm">
          <p className="text-center text-sm font-semibold text-slate-400">ILS NOUS FONT CONFIANCE</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {trustLogos.map((logo) => (
              <div
                key={logo}
                className="flex h-12 w-16 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-sm font-semibold text-slate-500"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-emerald-600">NOUVELLES COLLECTIONS</p>
            <h2 className="text-2xl font-bold text-slate-900">Nos sélections mises à jour pour les athlètes.</h2>
          </div>
          <a className="text-sm font-semibold text-emerald-700" href="/products">
            Voir tout →
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {collectionCards.map((card) => (
            <div
              key={card.title}
              className={`${card.accent} relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl`}
            >
              <div className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                {card.badge}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-white/80">Nouvelle collection</p>
                <h3 className="text-2xl font-bold">{card.title}</h3>
                <p className="text-sm text-white/80">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-600">NUTRITION & COMPLÉMENTS</p>
            <h2 className="text-2xl font-bold text-slate-900">Les meilleures offres sélectionnées par la team Fitidia.</h2>
          </div>
          <a className="text-sm font-semibold text-emerald-700" href="/products">
            Voir tout →
          </a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {nutritionProducts.map((product) => (
            <div key={product.title} className="flex h-full flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between text-xs font-semibold text-emerald-600">
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">NEW</span>
                <span className="text-slate-500">⚡</span>
              </div>
              <div className="h-32 rounded-xl bg-gradient-to-br from-slate-100 via-white to-emerald-50" />
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-slate-900">{product.title}</h3>
                <p className="text-sm text-slate-500">{product.subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900">{product.price}</span>
                <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">Voir plus</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-600">MATÉRIEL & ÉQUIPEMENT</p>
            <h2 className="text-2xl font-bold text-slate-900">Équipez votre home gym avec les bons prix.</h2>
          </div>
          <a className="text-sm font-semibold text-emerald-700" href="/products">
            Voir tout →
          </a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {equipmentProducts.map((product) => (
            <div key={product.title} className="flex h-full flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-600">
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">-12%</span>
                <span className="text-slate-500">↗</span>
              </div>
              <div className="h-32 rounded-xl bg-gradient-to-br from-slate-100 via-white to-emerald-50" />
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-slate-900">{product.title}</h3>
                <p className="text-sm text-slate-500">{product.subtitle}</p>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900">{product.price}</span>
                <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">Voir plus</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
            <span className="text-lg">🛠️</span> Pourquoi utiliser Fitidia ?
          </div>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p><span className="font-semibold text-slate-900">Historique des prix</span> • Restez informés des variations pour chaque produit.</p>
            <p><span className="font-semibold text-slate-900">Scoring Nutritionnel</span> • Comparez profils nutritionnels, labels, provenance.</p>
            <p><span className="font-semibold text-slate-900">Visuels clairs</span> • Cartes produits détaillées avec badges, prix & statistiques.</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-900 px-6 py-7 text-white shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
            <span className="text-lg">📬</span> Ne ratez aucune promo
          </div>
          <p className="mt-2 text-sm text-white/80">
            Les meilleures offres et analyses Fitidia, une fois par semaine.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="email"
              placeholder="Votre email"
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-400/30 transition hover:-translate-y-0.5 hover:bg-emerald-600">
              Je m'inscris
            </button>
          </div>
        </div>
      </section>

      <footer className="section-shell space-y-6 border-t border-slate-100 pt-8 text-sm text-slate-600">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-bold text-slate-900">Fitidia <span className="text-emerald-500">●</span></div>
            <p className="text-sm text-slate-600">Simplifiez vos achats fitness : générateur de paniers, scoring nutritionnel et veille prix.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">A propos</h3>
            <div className="space-y-1">
              <a className="block hover:text-emerald-600" href="/products">Documentation</a>
              <a className="block hover:text-emerald-600" href="/products">Présentation</a>
              <a className="block hover:text-emerald-600" href="/products">CGU</a>
              <a className="block hover:text-emerald-600" href="/products">Mentions légales</a>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">Aide</h3>
            <div className="space-y-1">
              <a className="block hover:text-emerald-600" href="/products">Documentation</a>
              <a className="block hover:text-emerald-600" href="/products">Aide</a>
              <a className="block hover:text-emerald-600" href="/products">API</a>
              <a className="block hover:text-emerald-600" href="/products">Contact</a>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">Populaire</h3>
            <div className="space-y-1">
              <a className="block hover:text-emerald-600" href="/products">Équipement</a>
              <a className="block hover:text-emerald-600" href="/products">Protéines</a>
              <a className="block hover:text-emerald-600" href="/products">Créatine</a>
              <a className="block hover:text-emerald-600" href="/products">Fitness</a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Fitidia. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}

export default Home;
