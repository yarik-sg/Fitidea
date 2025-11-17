import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";

const formatCurrency = (value) => {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) return null;

  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue);
};

const buildPriceLabel = (product) => {
  if (!product) return "Prix non disponible";

  const prices = [];

  if (product.min_price !== undefined) prices.push(Number(product.min_price));
  if (product.max_price !== undefined) prices.push(Number(product.max_price));
  if (product.price !== undefined) prices.push(Number(product.price));

  if (Array.isArray(product.offers)) {
    product.offers.forEach((offer) => {
      if (offer?.price !== undefined) {
        prices.push(Number(offer.price));
      }
    });
  }

  const numericPrices = prices.filter((value) => Number.isFinite(value));
  if (!numericPrices.length) return "Prix non disponible";

  const minPrice = Math.min(...numericPrices);
  const maxPrice = Math.max(...numericPrices);

  const formattedMin = formatCurrency(minPrice);
  const formattedMax = formatCurrency(maxPrice);

  if (formattedMin && formattedMax && minPrice !== maxPrice) {
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

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 py-10">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-3xl bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50" />
        <div className="space-y-4 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
          <div className="h-6 w-1/3 animate-pulse rounded-full bg-gray-200" />
          <div className="h-10 w-5/6 animate-pulse rounded-full bg-gray-200" />
          <div className="h-4 w-1/2 animate-pulse rounded-full bg-gray-200" />
          <div className="h-4 w-1/3 animate-pulse rounded-full bg-gray-200" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="h-11 w-full animate-pulse rounded-lg bg-orange-200" />
            <div className="h-11 w-full animate-pulse rounded-lg bg-orange-100" />
          </div>
          <div className="h-24 w-full animate-pulse rounded-2xl bg-gray-100" />
        </div>
      </div>
    </div>
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="min-h-screen bg-gray-50 py-10">
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-orange-200/80 bg-orange-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-xl">⚠️</div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">Alerte</p>
              <h2 className="text-xl font-bold text-orange-700">Impossible de charger le produit</h2>
              <p className="text-sm text-orange-600">
                Vérifiez votre connexion ou réessayez dans quelques instants.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>
  </div>
);

function ProductDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/products/${id}`);
      return data;
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: async (currentlyFavorite) => {
      if (currentlyFavorite) {
        await apiClient.delete(`/favorites/${id}`);
      } else {
        await apiClient.post(`/favorites/${id}`);
      }
    },
    onMutate: async (currentlyFavorite) => {
      await queryClient.cancelQueries({ queryKey: ["product", id] });
      const previousProduct = queryClient.getQueryData(["product", id]);

      queryClient.setQueryData(["product", id], (oldData) =>
        oldData ? { ...oldData, is_favorite: !currentlyFavorite } : oldData
      );

      return { previousProduct };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousProduct) {
        queryClient.setQueryData(["product", id], context.previousProduct);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const offers = useMemo(
    () => (Array.isArray(product?.offers) ? product.offers : []),
    [product]
  );
  const offersCount = offers.length || product?.offers_count || 0;
  const isFavorite = Boolean(product?.is_favorite);
  const brandLabel = product?.brand || product?.category;
  const priceLabel = buildPriceLabel(product);

  const handleScrollToOffers = () => {
    const target = document.getElementById("offers-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !product) return <ErrorState onRetry={refetch} />;

  const lastUpdate = product?.updated_at
    ? new Date(product.updated_at).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-600">Produit</span>
            {product.category ? (
              <span className="rounded-full border border-orange-100 px-3 py-1 text-xs text-gray-700">
                {product.category}
              </span>
            ) : null}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{product.name}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            {brandLabel ? (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                {brandLabel}
              </span>
            ) : null}
            {product.rating !== undefined && product.rating !== null ? (
              <RatingStars rating={product.rating} />
            ) : null}
            {product.reviews_count ? (
              <span className="text-xs font-semibold text-gray-500">
                {product.reviews_count} avis
              </span>
            ) : null}
            {offersCount ? (
              <span className="text-xs font-semibold text-gray-500">
                {offersCount} {offersCount > 1 ? "offres disponibles" : "offre disponible"}
              </span>
            ) : null}
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
          <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
            <div className="flex flex-col gap-6 p-6 md:flex-row">
              <div className="md:w-1/2">
                <div className="relative overflow-hidden rounded-2xl border border-orange-50 bg-orange-50">
                  <div className="relative aspect-square w-full">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-6xl text-orange-300">🛒</div>
                    )}
                    {product.rating ? (
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-amber-600 shadow-sm backdrop-blur">
                        ⭐ {Number(product.rating).toFixed(1)}
                      </span>
                    ) : null}
                    {offersCount ? (
                      <span className="absolute right-3 top-3 rounded-full bg-orange-500/90 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur">
                        {offersCount} {offersCount > 1 ? "offres" : "offre"}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                    <span className="text-lg">🏷️</span>
                    <span>{priceLabel}</span>
                  </div>
                  <p className="text-base leading-relaxed text-gray-700">
                    {product.short_description ||
                      product.description ||
                      "Découvrez ce produit sélectionné pour optimiser vos entraînements et votre bien-être."}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-600">Marque</p>
                    <p className="text-base font-semibold text-gray-900">{brandLabel || "Non renseignée"}</p>
                  </div>
                  <div className="rounded-2xl border border-orange-100 bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-600">Catégorie</p>
                    <p className="text-base font-semibold text-gray-900">{product.category || "Non renseignée"}</p>
                  </div>
                  <div className="rounded-2xl border border-orange-100 bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-600">Offres disponibles</p>
                    <p className="text-base font-semibold text-gray-900">{offersCount || "Aucune"}</p>
                  </div>
                  <div className="rounded-2xl border border-orange-100 bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-600">Note</p>
                    <p className="text-base font-semibold text-gray-900">
                      {product.rating ? `${Number(product.rating).toFixed(1)}/5` : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => favoriteMutation.mutate(isFavorite)}
                    disabled={favoriteMutation.isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span aria-hidden="true">{isFavorite ? "❤️" : "🤍"}</span>
                    {favoriteMutation.isPending
                      ? "Mise à jour..."
                      : isFavorite
                        ? "Retirer des favoris"
                        : "Ajouter aux favoris"}
                  </button>

                  {offersCount ? (
                    <button
                      type="button"
                      onClick={handleScrollToOffers}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                    >
                      Voir les offres
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Résumé</h3>
                {offersCount ? (
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                    {offersCount} {offersCount > 1 ? "offres" : "offre"}
                  </span>
                ) : null}
              </div>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <div className="flex items-center justify-between rounded-2xl bg-orange-50 px-4 py-3 text-base font-semibold text-orange-700">
                  <span>Prix</span>
                  <span>{priceLabel}</span>
                </div>
                {brandLabel ? (
                  <div className="flex items-center justify-between rounded-2xl border border-orange-50 px-4 py-3">
                    <span className="text-gray-600">Marque</span>
                    <span className="font-semibold text-gray-900">{brandLabel}</span>
                  </div>
                ) : null}
                {product.category ? (
                  <div className="flex items-center justify-between rounded-2xl border border-orange-50 px-4 py-3">
                    <span className="text-gray-600">Catégorie</span>
                    <span className="font-semibold text-gray-900">{product.category}</span>
                  </div>
                ) : null}
                {offersCount ? (
                  <div className="flex items-center justify-between rounded-2xl border border-orange-50 px-4 py-3">
                    <span className="text-gray-600">Offres</span>
                    <span className="font-semibold text-gray-900">{offersCount}</span>
                  </div>
                ) : null}
                {product.rating ? (
                  <div className="flex items-center justify-between rounded-2xl border border-orange-50 px-4 py-3">
                    <span className="text-gray-600">Note</span>
                    <span className="font-semibold text-gray-900">{Number(product.rating).toFixed(1)}/5</span>
                  </div>
                ) : null}
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Description</p>
                <p className="rounded-2xl border border-orange-50 bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-700">
                  {product.description ||
                    "Comparez les meilleures offres pour sélectionner l'option la plus adaptée à vos objectifs."}
                </p>
              </div>
            </div>
          </aside>
        </div>

        <section id="offers-section" className="mt-12 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Offres détaillées</p>
              <h2 className="text-2xl font-bold text-gray-900">Choisissez votre boutique</h2>
              <p className="text-sm text-gray-600">Comparez rapidement les prix, conditions et vendeurs.</p>
            </div>
            {offersCount ? (
              <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm">
                {offersCount} {offersCount > 1 ? "offres" : "offre"}
              </span>
            ) : null}
          </div>

          {offersCount ? (
            <div className="grid gap-4 md:grid-cols-2">
              {offers.map((offer) => {
                const offerPrice = formatCurrency(offer.price);
                return (
                  <div
                    key={offer.id || offer.title}
                    className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl text-orange-400">
                          🛒
                        </div>
                        <div className="space-y-1">
                          <p className="text-base font-semibold text-gray-900">{offer.title || "Offre partenaire"}</p>
                          {offer.description ? (
                            <p className="text-sm text-gray-600 line-clamp-2">{offer.description}</p>
                          ) : null}
                        </div>
                      </div>
                      {offerPrice ? (
                        <span className="rounded-lg bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">
                          {offerPrice}€
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-500">
                      {offer.gym_id ? (
                        <span className="rounded-full border border-orange-100 px-3 py-1 text-orange-700">Salle #{offer.gym_id}</span>
                      ) : null}
                      {offer.user_id ? (
                        <span className="rounded-full border border-orange-100 px-3 py-1 text-gray-700">Vendeur #{offer.user_id}</span>
                      ) : null}
                      {offer.seller ? (
                        <span className="rounded-full border border-orange-100 px-3 py-1 text-gray-700">{offer.seller}</span>
                      ) : null}
                    </div>

                    {offer.url ? (
                      <a
                        href={offer.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                      >
                        Accéder à l'offre
                      </a>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-orange-100 bg-white p-6 text-sm text-gray-600 shadow-sm">
              Aucune offre disponible pour le moment.
            </div>
          )}
        </section>

        <footer className="mt-10 flex items-center justify-between rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
          <span>Dernière mise à jour : {lastUpdate || "Non renseignée"}</span>
          {offersCount ? (
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
              {offersCount} {offersCount > 1 ? "offres" : "offre"}
            </span>
          ) : null}
        </footer>
      </div>
    </main>
  );
}

export default ProductDetail;
