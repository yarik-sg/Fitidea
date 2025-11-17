import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import ProductCard from "../components/ProductCard";

const filterLabels = ["Type", "Prix", "Popularité", "Nouveautés"];

function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="flex h-full flex-col rounded-2xl border border-orange-100 bg-white/70 p-4 shadow-sm shadow-orange-50 backdrop-blur-sm"
        >
          <div className="relative overflow-hidden rounded-xl border border-orange-50 bg-gradient-to-br from-orange-50 via-white to-orange-100">
            <div className="aspect-square w-full animate-pulse bg-gradient-to-br from-orange-100 via-orange-50 to-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-orange-100/50" />
          </div>
          <div className="mt-4 flex flex-1 flex-col gap-3">
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-orange-100" />
            <div className="h-3 w-1/2 animate-pulse rounded-full bg-orange-50" />
            <div className="h-4 w-1/3 animate-pulse rounded-full bg-gray-200" />
            <div className="mt-auto flex items-center gap-3">
              <div className="h-10 w-28 animate-pulse rounded-xl bg-orange-100" />
              <div className="h-10 w-10 animate-pulse rounded-full bg-orange-200/80" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Products() {
  const [activeFilter, setActiveFilter] = useState("Nouveautés");
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data: response } = await apiClient.get("/products");
      return response;
    },
  });

  const products = data?.items ?? [];
  const totalProducts = useMemo(() => data?.total ?? products.length ?? 0, [data, products.length]);

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
    <main className="min-h-screen bg-gradient-to-b from-orange-50/70 via-white to-white py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-base">📦</span>
              Catalogue
            </span>
            <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm ring-1 ring-orange-100">
              {totalProducts} produits
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Produits</h1>
              <p className="max-w-2xl text-base text-gray-600">
                Découvrez une sélection premium d'équipements et d'accessoires fitness, triés pour leurs meilleures offres.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {isFetching ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-100">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" /> Mise à jour...
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                <span aria-hidden="true">⟳</span>
                Rafraîchir
              </button>
            </div>
          </div>
        </header>

        <section className="mb-8 space-y-4 rounded-3xl border border-orange-100 bg-white/80 p-6 shadow-sm shadow-orange-50">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">Filtres visuels</p>
              <h2 className="text-lg font-bold text-gray-900">Affinez votre recherche en un clic</h2>
            </div>
            <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-100">
              Interface inspirée Idealo
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {filterLabels.map((label) => {
              const isActive = activeFilter === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveFilter(label)}
                  className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                      : "bg-orange-50 text-orange-700 ring-1 ring-orange-100 hover:-translate-y-0.5 hover:bg-orange-100"
                  }`}
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/70 text-xs text-orange-600 shadow-sm">
                    {isActive ? "●" : "○"}
                  </span>
                  {label}
                  {isActive ? (
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-white/90">Actif</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </section>

        {isError ? (
          <div className="mb-10 rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-50 via-white to-orange-100 p-8 shadow-md shadow-orange-50">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-md shadow-orange-100">⚠️</div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">Une erreur est survenue</p>
                  <p className="text-sm text-gray-600">Impossible de charger les produits pour le moment. Réessayez dans un instant.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center justify-center rounded-xl border border-orange-200 bg-white px-5 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
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
            {products.length ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group h-full transform rounded-2xl border border-orange-50 bg-white/90 p-0.5 shadow-sm shadow-orange-50 transition duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-glow"
                  >
                    <ProductCard
                      id={product.id}
                      title={product.name || product.title}
                      price={product.price ?? product.min_price ?? product.max_price}
                      image={product.image_url || product.image}
                      rating={product.rating}
                      isFavorite={Boolean(product.is_favorite)}
                      onToggleFavorite={() => handleToggleFavorite(product)}
                      isPopular={Boolean(product.is_popular)}
                      isPromo={Boolean(product.is_promo)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-orange-100 bg-white p-12 text-center shadow-sm shadow-orange-50">
                <p className="text-lg font-semibold text-gray-900">Aucun produit disponible pour le moment</p>
                <p className="mt-2 text-sm text-gray-600">
                  Ajustez vos filtres visuels ou rafraîchissez la page pour découvrir de nouvelles offres sélectionnées.
                </p>
                <div className="mt-5 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveFilter("Nouveautés")}
                    className="inline-flex items-center rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                  >
                    Réinitialiser les filtres
                  </button>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="inline-flex items-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                  >
                    Rafraîchir
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <footer className="mt-12 flex items-center justify-between rounded-2xl border border-orange-100 bg-white px-6 py-4 text-sm text-gray-600 shadow-sm shadow-orange-50">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-lg">🧭</span>
            Dernière mise à jour automatique
          </div>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-100">
            {new Date().toLocaleDateString()}
          </span>
        </footer>
      </div>
    </main>
  );
}

export default Products;
