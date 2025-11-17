import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import apiClient from "../lib/apiClient";

const sortOptions = [
  { label: "Pertinence", value: "relevance" },
  { label: "Prix croissant", value: "price_asc" },
  { label: "Prix décroissant", value: "price_desc" },
  { label: "Meilleures évaluations", value: "rating" },
  { label: "Plus d'offres", value: "offers" },
];

const ratingOptions = [
  { label: "4★ et +", value: "4" },
  { label: "3★ et +", value: "3" },
  { label: "2★ et +", value: "2" },
];

const availabilityOptions = [
  { label: "Avec offres", value: "offers" },
  { label: "En stock", value: "in_stock" },
];

const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return null;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(parsed);
};

function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex h-full flex-col gap-4 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm shadow-orange-50"
        >
          <div className="aspect-square w-full animate-pulse rounded-xl bg-gradient-to-br from-orange-50 via-white to-orange-100" />
          <div className="space-y-3">
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-orange-100" />
            <div className="h-3 w-1/2 animate-pulse rounded-full bg-orange-50" />
            <div className="h-4 w-1/3 animate-pulse rounded-full bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-24 animate-pulse rounded-xl bg-orange-100" />
              <div className="h-10 w-10 animate-pulse rounded-full bg-orange-200/80" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-orange-500">🔍</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Rechercher un supplément, une marque..."
        className="w-full rounded-2xl border border-orange-100 bg-white px-5 py-3 pl-12 text-base text-gray-900 shadow-sm shadow-orange-50 transition focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
      />
      {value ? (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          Effacer
        </button>
      ) : null}
    </div>
  );
}

function FilterSidebar({
  categories,
  brands,
  filters,
  onFilterChange,
  onReset,
}) {
  return (
    <aside className="sticky top-4 flex flex-col gap-6 rounded-3xl border border-orange-100 bg-white/90 p-5 shadow-md shadow-orange-50">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Filtres</p>
          <p className="text-sm text-gray-500">Affinez vos résultats en temps réel</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-semibold text-orange-600 underline-offset-4 hover:underline"
        >
          Réinitialiser
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">Catégorie</h3>
        <div className="space-y-2">
          {categories.length ? (
            categories.map((category) => (
              <label key={category} className="flex cursor-pointer items-center gap-3 rounded-xl border border-orange-50 bg-orange-50/40 px-3 py-2 text-sm text-gray-800 transition hover:border-orange-200">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={() => onFilterChange("category", filters.category === category ? "" : category)}
                  className="h-4 w-4 rounded border-orange-300 text-orange-500 focus:ring-orange-400"
                />
                <span>{category}</span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500">Aucune catégorie disponible</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">Fourchette de prix</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Min (€)</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(event) => onFilterChange("minPrice", event.target.value)}
              className="w-full rounded-xl border border-orange-100 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
              min={0}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Max (€)</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(event) => onFilterChange("maxPrice", event.target.value)}
              className="w-full rounded-xl border border-orange-100 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
              min={0}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">Marque</h3>
        <div className="space-y-2">
          {brands.length ? (
            brands.map((brand) => (
              <label key={brand} className="flex cursor-pointer items-center gap-3 rounded-xl border border-orange-50 bg-orange-50/40 px-3 py-2 text-sm text-gray-800 transition hover:border-orange-200">
                <input
                  type="radio"
                  name="brand"
                  value={brand}
                  checked={filters.brand === brand}
                  onChange={() => onFilterChange("brand", filters.brand === brand ? "" : brand)}
                  className="h-4 w-4 rounded border-orange-300 text-orange-500 focus:ring-orange-400"
                />
                <span>{brand}</span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500">Aucune marque détectée</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">Note minimale</h3>
        <div className="flex flex-col gap-2">
          {ratingOptions.map((option) => (
            <label key={option.value} className="flex cursor-pointer items-center gap-3 rounded-xl border border-orange-50 bg-orange-50/40 px-3 py-2 text-sm text-gray-800 transition hover:border-orange-200">
              <input
                type="radio"
                name="rating"
                value={option.value}
                checked={filters.rating === option.value}
                onChange={() => onFilterChange("rating", filters.rating === option.value ? "" : option.value)}
                className="h-4 w-4 rounded border-orange-300 text-orange-500 focus:ring-orange-400"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">Disponibilité</h3>
        <div className="flex flex-col gap-2">
          {availabilityOptions.map((option) => (
            <label key={option.value} className="flex cursor-pointer items-center gap-3 rounded-xl border border-orange-50 bg-orange-50/40 px-3 py-2 text-sm text-gray-800 transition hover:border-orange-200">
              <input
                type="radio"
                name="availability"
                value={option.value}
                checked={filters.availability === option.value}
                onChange={() => onFilterChange("availability", filters.availability === option.value ? "" : option.value)}
                className="h-4 w-4 rounded border-orange-300 text-orange-500 focus:ring-orange-400"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

function SortBar({ sort, onChange, total, isUpdating }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-sm shadow-orange-50">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">Catalogue</span>
        <span className="text-gray-800">{total} suppléments</span>
        {isUpdating ? (
          <span className="flex items-center gap-2 text-xs font-semibold text-orange-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
            Mise à jour...
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Trier par</span>
        <div className="relative">
          <select
            value={sort}
            onChange={(event) => onChange(event.target.value)}
            className="cursor-pointer rounded-xl border border-orange-100 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function RatingStars({ rating }) {
  if (!rating) return null;
  const rounded = Math.round(Number(rating) * 2) / 2;
  return (
    <div className="flex items-center gap-1 text-sm text-gray-700">
      {Array.from({ length: 5 }).map((_, index) => {
        const value = index + 1;
        if (rounded >= value) return <span key={value}>⭐</span>;
        if (rounded + 0.5 === value) return <span key={value}>✨</span>;
        return <span key={value} className="text-gray-300">★</span>;
      })}
      <span className="ml-1 text-xs font-semibold text-gray-600">{Number(rating).toFixed(1)}</span>
    </div>
  );
}

function ProductCard({ product, onToggleFavorite }) {
  const priceLabel = useMemo(() => {
    const { price, min_price: minPrice, max_price: maxPrice } = product;
    const formattedPrice = formatPrice(price);
    const formattedMin = formatPrice(minPrice);
    const formattedMax = formatPrice(maxPrice);

    if (formattedMin && formattedMax) return `${formattedMin} - ${formattedMax}`;
    if (formattedPrice) return formattedPrice;
    if (formattedMin) return formattedMin;
    if (formattedMax) return formattedMax;
    return "Prix non communiqué";
  }, [product]);

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-sm shadow-orange-50 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100">
      <div className="relative overflow-hidden rounded-xl bg-orange-50/40 p-2">
        <div className="aspect-square overflow-hidden rounded-xl bg-white shadow-sm shadow-orange-100">
          {product.image_url || product.image ? (
            <img
              src={product.image_url || product.image}
              alt={product.name || product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-2xl text-orange-500">📦</div>
          )}
        </div>
        {product.is_promo ? (
          <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
            Promo
          </span>
        ) : null}
        {product.is_popular ? (
          <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-orange-600 shadow">
            Populaire
          </span>
        ) : null}
        <button
          type="button"
          onClick={onToggleFavorite}
          className="absolute right-3 bottom-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg text-orange-600 shadow-md transition hover:-translate-y-0.5 hover:bg-orange-50"
        >
          {product.is_favorite ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
              {product.category || product.brand || "Catégorie"}
            </p>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name || product.title}</h3>
          </div>
          {product.offers_count ? (
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-100">
              {product.offers_count} offres
            </span>
          ) : null}
        </div>

        <RatingStars rating={product.rating} />

        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">Meilleure offre</p>
            <p className="text-xl font-bold text-gray-900">{priceLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onReset, hasQuery }) {
  return (
    <div className="rounded-3xl border border-orange-100 bg-white p-12 text-center shadow-sm shadow-orange-50">
      <div className="text-4xl">🧭</div>
      <h3 className="mt-4 text-xl font-semibold text-gray-900">Aucun résultat trouvé</h3>
      <p className="mt-2 text-sm text-gray-600">
        {hasQuery
          ? "Ajustez vos filtres ou modifiez votre recherche pour découvrir plus d'options."
          : "Ajoutez un mot-clé ou choisissez une catégorie pour explorer les suppléments."}
      </p>
      <div className="mt-5 flex justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        >
          Revenir au catalogue
        </button>
      </div>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-50 via-white to-orange-100 p-8 shadow-md shadow-orange-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-md shadow-orange-100">⚠️</div>
          <div>
            <p className="text-lg font-semibold text-gray-900">Une erreur est survenue</p>
            <p className="text-sm text-gray-600">Impossible de charger les suppléments pour le moment. Réessayez dans un instant.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center rounded-xl border border-orange-200 bg-white px-5 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}

function Products() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") ?? "");

  const filters = useMemo(
    () => ({
      q: searchParams.get("q") ?? "",
      minPrice: searchParams.get("min_price") ?? "",
      maxPrice: searchParams.get("max_price") ?? "",
      category: searchParams.get("category") ?? "",
      brand: searchParams.get("brand") ?? "",
      rating: searchParams.get("rating") ?? "",
      availability: searchParams.get("availability") ?? "",
      sort: searchParams.get("sort") ?? "relevance",
    }),
    [searchParams]
  );

  useEffect(() => {
    setSearchValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === "" || value === null || value === undefined) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const resetFilters = () => {
    setSearchParams({}, { replace: true });
  };

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.q) params.set("q", filters.q);
      if (filters.minPrice) params.set("min_price", filters.minPrice);
      if (filters.maxPrice) params.set("max_price", filters.maxPrice);
      if (filters.category) params.set("category", filters.category);
      if (filters.brand) params.set("brand", filters.brand);
      if (filters.rating) params.set("rating", filters.rating);
      if (filters.sort) params.set("sort", filters.sort);
      if (filters.availability) params.set("availability", filters.availability);

      const queryString = params.toString();
      const url = queryString ? `/products?${queryString}` : "/products";
      const { data: response } = await apiClient.get(url);
      return response;
    },
    keepPreviousData: true,
  });

  const products = data?.items ?? [];
  const totalProducts = useMemo(() => data?.total ?? products.length ?? 0, [data, products.length]);

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((product) => {
      if (product.category) set.add(product.category);
    });
    return Array.from(set);
  }, [products]);

  const brands = useMemo(() => {
    const set = new Set();
    products.forEach((product) => {
      if (product.brand) set.add(product.brand);
    });
    return Array.from(set);
  }, [products]);

  const favoriteMutation = useMutation({
    mutationFn: async ({ productId, currentlyFavorite }) => {
      if (currentlyFavorite) {
        await apiClient.delete(`/favorites/${productId}`);
      } else {
        await apiClient.post(`/favorites/${productId}`);
      }
    },
    onMutate: async ({ productId, currentlyFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousData = queryClient.getQueryData(["products"]);

      if (previousData?.items) {
        const updatedItems = previousData.items.map((product) =>
          product.id === productId ? { ...product, is_favorite: !currentlyFavorite } : product
        );
        queryClient.setQueryData(["products"], { ...previousData, items: updatedItems });
      }

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["products"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleToggleFavorite = (product) => {
    favoriteMutation.mutate({
      productId: product.id,
      currentlyFavorite: Boolean(product.is_favorite),
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/70 via-white to-white py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <p className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-base">📦</span>
                Tous les suppléments
            </p>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Catalogue premium de suppléments Fitidea</h1>
            <p className="max-w-3xl text-sm text-gray-600">
                Explorez, filtrez et comparez en un clin d'œil. Une expérience inspirée d'Idealo, Google Shopping et Amazon pour trouver vos prochains suppléments.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                <span className="text-lg">⟳</span>
                Rafraîchir
              </button>
            </div>
          </div>

          <SearchBar
            value={searchValue}
            onChange={(value) => {
              setSearchValue(value);
              updateFilter("q", value);
            }}
            onClear={() => {
              setSearchValue("");
              updateFilter("q", "");
            }}
          />
        </header>

        <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <FilterSidebar
            categories={categories}
            brands={brands}
            filters={filters}
            onFilterChange={(key, value) => {
              const paramKey =
                key === "minPrice"
                  ? "min_price"
                  : key === "maxPrice"
                  ? "max_price"
                  : key;
              updateFilter(paramKey, value);
            }}
            onReset={resetFilters}
          />

          <div className="space-y-4">
            <SortBar sort={filters.sort} onChange={(value) => updateFilter("sort", value)} total={totalProducts} isUpdating={isFetching} />

            {isError ? <ErrorState onRetry={refetch} /> : null}

            {isLoading ? (
              <SkeletonGrid />
            ) : products.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onToggleFavorite={() => handleToggleFavorite(product)} />
                ))}
              </div>
            ) : (
              <EmptyState onReset={resetFilters} hasQuery={Boolean(filters.q || filters.category || filters.brand)} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Products;
