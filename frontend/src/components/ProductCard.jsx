import React from "react";
import { Link } from "react-router-dom";

const formatPrice = (value) => {
  if (value === undefined || value === null) return null;

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return null;

  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue);
};

function ProductCard({
  id,
  title,
  price,
  image,
  rating,
  isFavorite = false,
  onToggleFavorite,
  isPopular = false,
  isPromo = false,
}) {
  const formattedPrice = formatPrice(price);
  const favoriteLabel = isFavorite ? "Retirer des favoris" : "Ajouter aux favoris";

  const handleFavoriteClick = (event) => {
    event.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  const badgeItems = [];
  if (rating !== undefined && rating !== null && !Number.isNaN(Number(rating))) {
    badgeItems.push({ label: `⭐ ${Number(rating).toFixed(1)}`, tone: "amber" });
  }
  if (isPopular) badgeItems.push({ label: "🔥 Populaire", tone: "orange" });
  if (isPromo) badgeItems.push({ label: "🏷 Promo", tone: "emerald" });

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-orange-100 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <div className="overflow-hidden rounded-xl border border-orange-50 bg-gray-50">
          <Link
            to={`/products/${id}`}
            className="block"
            aria-label={`Découvrir ${title}`}
          >
            {image ? (
              <img
                src={image}
                alt={title}
                loading="lazy"
                className="h-40 w-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-40 w-full items-center justify-center text-3xl text-orange-300">🛒</div>
            )}
          </Link>
        </div>

        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={favoriteLabel}
          aria-pressed={isFavorite}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-orange-100 bg-white/90 text-lg shadow-md transition hover:scale-110 hover:border-orange-200 hover:bg-white"
        >
          <span aria-hidden="true">{isFavorite ? "🧡" : "🤍"}</span>
        </button>

        {badgeItems.length ? (
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {badgeItems.map((badge) => (
              <span
                key={badge.label}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                  badge.tone === "amber"
                    ? "bg-amber-50 text-amber-700"
                    : badge.tone === "emerald"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-orange-50 text-orange-700"
                }`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        <Link to={`/products/${id}`} className="space-y-2" aria-label={`Voir ${title}`}>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{title}</h3>
          {formattedPrice ? (
            <p className="text-lg font-bold text-orange-600">{formattedPrice}€</p>
          ) : (
            <p className="text-sm font-semibold text-gray-500">Prix non disponible</p>
          )}
        </Link>

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <div className="text-sm font-semibold text-orange-500">
            {rating !== undefined && rating !== null && !Number.isNaN(Number(rating)) ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                ⭐ {Number(rating).toFixed(1)}/5
              </span>
            ) : (
              <span className="text-xs font-medium text-gray-400">Pas encore d'avis</span>
            )}
          </div>
          <Link
            to={`/products/${id}`}
            onClick={(event) => event.stopPropagation()}
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
          >
            Voir le produit
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
