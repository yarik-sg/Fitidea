import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import apiClient from "../lib/apiClient";
import ProductCard from "../components/ProductCard";

function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
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

function Favorites() {
  const queryClient = useQueryClient();
  const [recentlyRemoved, setRecentlyRemoved] = useState(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const { data: response } = await apiClient.get("/favorites");
      return response;
    },
    staleTime: 1000 * 30,
  });

  const favorites = data?.items || [];

  useEffect(() => {
    if (!recentlyRemoved) return;

    const timeout = setTimeout(() => setRecentlyRemoved(null), 2200);
    return () => clearTimeout(timeout);
  }, [recentlyRemoved]);

  const deleteFavorite = useMutation({
    mutationFn: async ({ productId }) => apiClient.delete(`/favorites/${productId}`),
    onMutate: async ({ productId }) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });

      const previousData = queryClient.getQueryData(["favorites"]);
      const productToRemove = previousData?.items?.find((item) => item.id === productId);
      const updatedItems = previousData?.items?.filter((item) => item.id !== productId) || [];

      queryClient.setQueryData(["favorites"], {
        ...(previousData || {}),
        items: updatedItems,
      });

      if (productToRemove?.name) {
        setRecentlyRemoved(productToRemove.name);
      }

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["favorites"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const handleToggleFavorite = (productId) => {
    deleteFavorite.mutate({ productId });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">Favoris</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Vos favoris</h1>
              <p className="text-base text-gray-600">
                Retrouvez vos produits enregistrés en un clic
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              {isLoading ? "Chargement..." : `${favorites.length} favoris`}
            </div>
          </div>
        </header>

        {recentlyRemoved ? (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
            <span className="text-lg" aria-hidden="true">
              ✅
            </span>
            Retiré des favoris : {recentlyRemoved}
          </div>
        ) : null}

        {isError ? (
          <div className="mb-8 rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold">Impossible de charger vos favoris.</p>
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
        ) : favorites.length ? (
          <div className="space-y-6">
            {isFetching ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="h-2 w-2 rounded-full bg-orange-400" />
                Mise à jour des favoris...
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={true}
                  onToggleFavorite={() => handleToggleFavorite(product.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-orange-200 bg-white px-8 py-14 text-center shadow-sm">
            <div className="text-5xl">🧡</div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Vous n'avez encore aucun favori</h2>
            <p className="mt-2 max-w-md text-sm text-gray-600">
              Enregistrez les produits qui vous intéressent pour les retrouver facilement. Explorez notre sélection pour commencer.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              Explorer les produits
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default Favorites;
