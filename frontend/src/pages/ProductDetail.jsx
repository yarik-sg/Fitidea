import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import OfferTable from "../components/OfferTable";

const formatCurrency = (value) => {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) return null;

  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue);
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
  <main className="min-h-screen bg-gray-50 pb-12 pt-10">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 h-6 w-1/3 animate-pulse rounded-full bg-gray-200" />
      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-4 rounded-2xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-50">
          <div className="aspect-square w-full animate-pulse rounded-2xl bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="aspect-square animate-pulse rounded-xl bg-gray-100"
              />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-12 w-full animate-pulse rounded-2xl bg-white shadow-lg shadow-orange-50" />
          <div className="h-44 w-full animate-pulse rounded-2xl bg-white shadow-lg shadow-orange-50" />
          <div className="h-24 w-full animate-pulse rounded-2xl bg-white shadow-lg shadow-orange-50" />
        </div>
      </div>
    </div>
  </main>
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

  const { data: product, isLoading, isError, refetch } = useQuery({
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

  const minPrice = useMemo(() => {
    const prices = [];
    if (product?.min_price !== undefined) prices.push(Number(product.min_price));
    if (product?.price !== undefined) prices.push(Number(product.price));

    offers.forEach((offer) => {
      if (offer?.price !== undefined) prices.push(Number(offer.price));
    });

    const numericPrices = prices.filter((value) => Number.isFinite(value));
    if (!numericPrices.length) return null;
    return Math.min(...numericPrices);
  }, [product, offers]);

  const priceLabel = minPrice ? `À partir de ${formatCurrency(minPrice)}€` : "Prix non disponible";

  const bulletPoints = useMemo(() => {
    const bullets = [];
    if (brandLabel) bullets.push(`Marque : ${brandLabel}`);
    if (product?.category) bullets.push(`Catégorie : ${product.category}`);
    if (offersCount) bullets.push(`${offersCount} offre${offersCount > 1 ? "s" : ""} comparée${offersCount > 1 ? "s" : ""}`);
    if (product?.rating) bullets.push(`Note moyenne ${Number(product.rating).toFixed(1)}/5`);
    if (product?.stock_status) bullets.push(product.stock_status);
    while (bullets.length < 3) {
      bullets.push("Sélection premium par Fitidea pour vos performances");
    }
    return bullets.slice(0, 6);
  }, [brandLabel, offersCount, product]);

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
    <main className="min-h-screen bg-gray-50 pb-14 pt-8 font-sans">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-200 hover:bg-orange-50"
          >
            ← Retour aux produits
          </Link>
          {offersCount ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
              Offres disponibles : {offersCount}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="text-orange-600 hover:underline">
            Accueil
          </Link>
          <span>→</span>
          <Link to="/products" className="text-orange-600 hover:underline">
            Produits
          </Link>
          <span>→</span>
          <span className="font-semibold text-gray-900">{product.name}</span>
        </div>

        <header className="mt-4 space-y-3 rounded-2xl bg-white/60 p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-orange-700">
              Produit premium
            </span>
            {brandLabel ? (
              <span className="rounded-full border border-orange-100 px-3 py-1 text-xs font-semibold text-gray-700">
                {brandLabel}
              </span>
            ) : null}
            {offersCount ? (
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                {offersCount} offre{offersCount > 1 ? "s" : ""}
              </span>
            ) : null}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{product.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {product.category ? (
              <span className="text-sm font-semibold text-gray-700">{product.category}</span>
            ) : null}
            {product.rating !== undefined && product.rating !== null ? (
              <RatingStars rating={product.rating} />
            ) : null}
            {product.reviews_count ? (
              <span className="text-xs font-semibold text-gray-500">{product.reviews_count} avis</span>
            ) : null}
          </div>
        </header>

        <section className="mt-6 grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
          <div className="space-y-4 rounded-2xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-50">
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
                {offersCount ? (
                  <span className="absolute right-3 top-3 rounded-full bg-orange-500/90 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur">
                    {offersCount} offre{offersCount > 1 ? "s" : ""}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[product.image_url, ...(product.gallery || [])].slice(0, 3).map((image, index) => (
                <div
                  key={index}
                  className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-orange-50 bg-gray-50"
                >
                  {image ? (
                    <img src={image} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl text-orange-300">🛒</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-50">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">À partir de</p>
                  <p className="text-4xl font-bold text-gray-900">{priceLabel}</p>
                  <p className="text-sm text-gray-500">Prix dynamique basé sur nos partenaires.</p>
                </div>
                <button
                  type="button"
                  onClick={() => favoriteMutation.mutate(isFavorite)}
                  disabled={favoriteMutation.isPending}
                  aria-pressed={isFavorite}
                  aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-orange-100 bg-white text-lg shadow-md transition hover:scale-110 hover:border-orange-200 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span aria-hidden="true">{isFavorite ? "🧡" : "🤍"}</span>
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleScrollToOffers}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
                >
                  Voir l'offre la moins chère
                </button>
                <button
                  type="button"
                  onClick={() => favoriteMutation.mutate(isFavorite)}
                  disabled={favoriteMutation.isPending}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-6 py-3 text-sm font-semibold text-orange-700 shadow-sm transition hover:border-orange-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {favoriteMutation.isPending ? "Mise à jour..." : isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="rounded-2xl border border-orange-50 bg-orange-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-600">Marque</p>
                  <p className="text-base font-semibold text-gray-900">{brandLabel || "Non renseignée"}</p>
                </div>
                <div className="rounded-2xl border border-orange-50 bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-600">Catégorie</p>
                  <p className="text-base font-semibold text-gray-900">{product.category || "Non renseignée"}</p>
                </div>
                <div className="rounded-2xl border border-orange-50 bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-600">Offres</p>
                  <p className="text-base font-semibold text-gray-900">{offersCount || "Aucune"}</p>
                </div>
                <div className="rounded-2xl border border-orange-50 bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-600">Note</p>
                  <p className="text-base font-semibold text-gray-900">
                    {product.rating ? `${Number(product.rating).toFixed(1)}/5` : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-lg shadow-orange-50">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">À propos du produit</p>
              <h2 className="mt-2 text-xl font-bold text-gray-900">Pourquoi nos utilisateurs l'adorent</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                {product.short_description ||
                  product.description ||
                  "Découvrez une sélection premium conçue pour booster vos performances et votre bien-être."}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                {bulletPoints.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 text-orange-500">✔️</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 grid gap-2 rounded-2xl border border-dashed border-orange-100 bg-orange-50 p-4 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">Référence</span>
                  <span className="rounded-full bg-white px-3 py-1 font-semibold text-orange-600 shadow-sm">#{product.id}</span>
                </div>
                {product.sku ? (
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">SKU</span>
                    <span className="font-semibold text-gray-700">{product.sku}</span>
                  </div>
                ) : null}
                {product.stock_status ? (
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">Disponibilité</span>
                    <span className="font-semibold text-emerald-600">{product.stock_status}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </aside>
        </section>

        <section id="offers-section" className="mt-10 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Comparateur</p>
              <h2 className="text-2xl font-bold text-gray-900">Choisissez votre boutique</h2>
              <p className="text-sm text-gray-600">Comparez rapidement les prix, conditions et vendeurs.</p>
            </div>
            {offersCount ? (
              <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm">
                {offersCount} offre{offersCount > 1 ? "s" : ""}
              </span>
            ) : null}
          </div>

          <OfferTable offers={offers} />
        </section>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
          <span>Dernière mise à jour : {lastUpdate || "Non renseignée"}</span>
          {offersCount ? (
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
              {offersCount} offre{offersCount > 1 ? "s" : ""}
            </span>
          ) : null}
        </footer>
      </div>
    </main>
  );
}

export default ProductDetail;
