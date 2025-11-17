import React from "react";
import { Link } from "react-router-dom";

const formatCurrency = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const buildPriceLabel = (minPrice, maxPrice) => {
  const formattedMin = formatCurrency(minPrice);
  const formattedMax = formatCurrency(maxPrice);

  if (formattedMin && formattedMax) {
    return `${formattedMin}€ - ${formattedMax}€`;
  }

  if (formattedMin) {
    return `À partir de ${formattedMin}€`;
  }

  return "Prix non disponible";
};

const RatingStars = ({ rating }) => {
  if (rating === undefined || rating === null) return null;

  const numericRating = Number(rating);
  if (Number.isNaN(numericRating)) return null;

  const rounded = Math.round(numericRating);
  const stars = Array.from({ length: 5 }, (_, index) =>
    index < rounded ? "⭐" : "✩"
  ).join("");

  return (
    <div
      className="flex items-center gap-2 text-sm text-amber-500"
      aria-label={`Note ${numericRating} sur 5`}
    >
      <span className="font-medium leading-none">{stars}</span>
      <span className="text-xs font-semibold text-gray-500">
        {numericRating.toFixed(1)}/5
      </span>
    </div>
  );
};

function ProductCard({ product, isFavorite = false, onToggleFavorite }) {
  const { id, name, brand, image_url, min_price, max_price, rating, offers_count } =
    product;

  const priceLabel = buildPriceLabel(min_price, max_price);
  const favoriteLabel = isFavorite
    ? "Retirer des favoris"
    : "Ajouter aux favoris";

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm transition duration-200 hover:scale-[1.02] hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-orange-50">
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl text-orange-300">
            🛒
          </div>
        )}
        {offers_count ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-orange-600 shadow-sm backdrop-blur">
            {offers_count} {offers_count > 1 ? "offres" : "offre"}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1">
            <p className="text-base font-semibold text-gray-900 line-clamp-2">{name}</p>
            {brand ? (
              <p className="text-sm font-medium text-gray-500">{brand}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={favoriteLabel}
            aria-pressed={isFavorite}
            className="rounded-full border border-orange-100 bg-orange-50 px-3 py-2 text-lg shadow-sm transition hover:scale-110 hover:border-orange-200 hover:bg-orange-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
          >
            <span aria-hidden="true">{isFavorite ? "❤️" : "🤍"}</span>
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-900">{priceLabel}</p>
          {rating !== undefined && rating !== null ? (
            <RatingStars rating={rating} />
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <Link
            to={`/products/${id}`}
            className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            Voir le produit
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
