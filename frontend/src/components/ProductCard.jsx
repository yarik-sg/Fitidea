import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const formatCurrency = (value) => {
  if (value === undefined || value === null) return null;

  const numeric = Number(value);
  if (Number.isNaN(numeric)) return null;

  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numeric);
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

const getCategoryLabel = (product = {}) => {
  if (product.category) return product.category;
  if (product.category_name) return product.category_name;
  if (product.categoryLabel) return product.categoryLabel;
  return null;
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
      className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-amber-600"
      aria-label={`Note ${numericRating} sur 5`}
    >
      <span className="leading-none">{stars}</span>
      <span className="text-xs font-semibold text-orange-800">
        {numericRating.toFixed(1)}/5
      </span>
    </div>
  );
};

function ProductCard({ product, isFavorite = false, onToggleFavorite }) {
  const { id, name, brand, image_url, min_price, max_price, rating } = product;

  const [favorite, setFavorite] = useState(Boolean(isFavorite));
  useEffect(() => {
    setFavorite(Boolean(isFavorite));
  }, [isFavorite]);

  const priceLabel = buildPriceLabel(min_price, max_price);
  const categoryLabel = getCategoryLabel(product);
  const favoriteLabel = favorite ? "Retirer des favoris" : "Ajouter aux favoris";

  const handleFavoriteClick = () => {
    setFavorite((prev) => !prev);
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <div className="aspect-square overflow-hidden rounded-b-none bg-gradient-to-br from-orange-50 via-white to-orange-100">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl text-orange-300">🛒</div>
          )}
        </div>

        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={favoriteLabel}
          aria-pressed={favorite}
          className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full border border-orange-100 bg-white/90 shadow-md backdrop-blur transition hover:scale-110 hover:border-orange-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
        >
          <span aria-hidden="true" className="text-xl transition-transform duration-200">
            {favorite ? "❤️" : "🤍"}
          </span>
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{name}</h3>
            {brand ? (
              <p className="text-sm font-medium text-gray-500">{brand}</p>
            ) : null}
          </div>
          {categoryLabel ? (
            <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600 shadow-sm">
              {categoryLabel}
            </span>
          ) : null}
        </div>

        <div className="space-y-3">
          <p className="text-xl font-semibold text-gray-900">{priceLabel}</p>
          <div className="flex flex-wrap items-center gap-3">
            <RatingStars rating={rating} />
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <Link
            to={`/products/${id}`}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            Voir le produit
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
