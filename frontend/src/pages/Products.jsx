import React, { useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import ProductCard from "../components/ProductCard";

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function useProductsQuery({ page, pageSize, name, minPrice, maxPrice }) {
  return useQuery({
    queryKey: ["products", { page, pageSize, name, minPrice, maxPrice }],
    queryFn: async () => {
      const params = {
        page,
        page_size: pageSize,
        name: name || undefined,
        min_price: minPrice || undefined,
        max_price: maxPrice || undefined,
      };

      const { data } = await apiClient.get("/products", { params });
      return data;
    },
    keepPreviousData: true,
    staleTime: 1000 * 30,
  });
}

function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="flex h-full flex-col overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm"
        >
          <div className="relative aspect-square bg-orange-50">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50" />
          </div>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-gray-200" />
            <div className="h-3 w-1/2 animate-pulse rounded-full bg-gray-200" />
            <div className="h-4 w-1/3 animate-pulse rounded-full bg-gray-200" />
            <div className="mt-auto flex gap-3">
              <div className="h-10 w-24 animate-pulse rounded-lg bg-orange-100" />
              <div className="h-10 w-10 animate-pulse rounded-full bg-orange-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();

  const filters = useMemo(
    () => ({
      page: 1,
      pageSize: 20,
      name: debouncedSearch.trim(),
      minPrice: minPrice || "",
      maxPrice: maxPrice || "",
    }),
    [debouncedSearch, minPrice, maxPrice]
  );

  const { data, isLoading, isError, refetch, isFetching } = useProductsQuery(filters);
  const products = data?.items || [];

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

      const previousQueries = queryClient.getQueriesData({ queryKey: ["products"] });

      previousQueries.forEach(([key, cachedData]) => {
        if (!cachedData?.items) return;

        const updatedItems = cachedData.items.map((product) =>
          product.id === productId ? { ...product, is_favorite: !currentlyFavorite } : product
        );

        queryClient.setQueryData(key, { ...cachedData, items: updatedItems });
      });

      return { previousQueries };
    },
    onError: (_error, _variables, context) => {
      context?.previousQueries?.forEach(([key, cachedData]) => {
        queryClient.setQueryData(key, cachedData);
      });
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

  const handleResetFilters = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Produits</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Produits</h1>
              <p className="text-base text-gray-600">
                Explorez et comparez les meilleures offres fitness
              </p>
            </div>
            {data?.total !== undefined ? (
              <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
                {data.total} résultats
              </div>
            ) : null}
          </div>
        </header>

        <section className="mb-8 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
          <form className="grid grid-cols-1 gap-4 md:grid-cols-4" onSubmit={(e) => e.preventDefault()}>
            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="text-sm font-medium text-gray-700">Recherche</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Trouvez un produit..."
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Prix min (€)</span>
              <input
                type="number"
                min="0"
                inputMode="decimal"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                placeholder="0"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-700">Prix max (€)</span>
              <input
                type="number"
                min="0"
                inputMode="decimal"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="500"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </label>

            <div className="flex items-end justify-end gap-3 md:col-span-4">
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                Réinitialiser
              </button>
            </div>
          </form>
        </section>

        {isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold">Impossible de charger les produits.</p>
                <p className="text-sm text-red-600">Vérifiez votre connexion ou réessayez plus tard.</p>
              </div>
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
              >
                Réessayer
              </button>
            </div>
          </div>
        ) : null}

        {isLoading ? (
          <SkeletonCards />
        ) : (
          <div className="space-y-6">
            {isFetching ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="h-2 w-2 rounded-full bg-orange-400" />
                Mise à jour des résultats...
              </div>
            ) : null}

            {products.length ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.name || product.title}
                    price={product.price ?? product.min_price ?? product.max_price}
                    image={product.image_url || product.image}
                    rating={product.rating}
                    isFavorite={Boolean(product.is_favorite)}
                    onToggleFavorite={() => handleToggleFavorite(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-orange-100 bg-white p-10 text-center shadow-sm">
                <p className="text-lg font-semibold text-gray-900">Aucun produit trouvé</p>
                <p className="mt-2 text-sm text-gray-600">
                  Ajustez vos filtres ou réinitialisez-les pour découvrir de nouvelles offres.
                </p>
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default Products;
