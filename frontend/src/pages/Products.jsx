import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import apiClient from "../lib/apiClient";

const FILTER_DEFAULTS = {
  q: "",
  category: "",
  brand: "",
  price_min: "",
  price_max: "",
  rating_min: "",
  source: "",
};

const formatCurrency = (value) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return null;
  return `${parsed.toFixed(2)}€`;
};

const formatRating = (value) => {
  if (value === null || value === undefined) return "-";
  const parsed = Number(value);
  return Number.isNaN(parsed) ? "-" : `${parsed.toFixed(1)}★`;
};

const getStoredComparisons = () => {
  try {
    const stored = localStorage.getItem("compare_products");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Unable to read compare list", error);
    return [];
  }
};

const saveComparisons = (items) => {
  localStorage.setItem("compare_products", JSON.stringify(items));
};

function ProductCard({ product, onCompare }) {
  const priceLabel = formatCurrency(product.price) || "Prix non disponible";
  const image = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null;

  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm shadow-orange-50">
      <div className="relative">
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 via-white to-orange-100">
          {image ? (
            <img src={image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl">🏋️</div>
          )}
        </div>
        {product.source ? (
          <span className="absolute left-2 top-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-orange-600 shadow-sm">
            {product.source}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
            {product.category || "Produit"}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-gray-900">{product.name}</h3>
          {product.brand ? <p className="text-sm text-gray-500">{product.brand}</p> : null}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-orange-600">{priceLabel}</p>
            <p className="text-sm text-gray-500">Note {formatRating(product.rating)}</p>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/products/${product.id}`}
              className="rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:border-orange-200 hover:bg-orange-100"
            >
              Détails
            </Link>
            <button
              type="button"
              onClick={() => onCompare(product)}
              className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
            >
              Comparer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Filters({ filters, onChange, onReset }) {
  return (
    <div className="grid gap-4 rounded-3xl border border-orange-100 bg-white/90 p-4 shadow-sm shadow-orange-50 md:grid-cols-2 lg:grid-cols-3">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Recherche</label>
        <input
          type="search"
          value={filters.q}
          onChange={(event) => onChange("q", event.target.value)}
          placeholder="Whey, créatine, équipements..."
          className="w-full rounded-xl border border-orange-100 px-3 py-2 shadow-sm focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Catégorie</label>
        <input
          type="text"
          value={filters.category}
          onChange={(event) => onChange("category", event.target.value)}
          placeholder="whey, créatine, accessoires..."
          className="w-full rounded-xl border border-orange-100 px-3 py-2 shadow-sm focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Marque</label>
        <input
          type="text"
          value={filters.brand}
          onChange={(event) => onChange("brand", event.target.value)}
          placeholder="MyProtein, Prozis..."
          className="w-full rounded-xl border border-orange-100 px-3 py-2 shadow-sm focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Prix min</label>
        <input
          type="number"
          min={0}
          value={filters.price_min}
          onChange={(event) => onChange("price_min", event.target.value)}
          className="w-full rounded-xl border border-orange-100 px-3 py-2 shadow-sm focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Prix max</label>
        <input
          type="number"
          min={0}
          value={filters.price_max}
          onChange={(event) => onChange("price_max", event.target.value)}
          className="w-full rounded-xl border border-orange-100 px-3 py-2 shadow-sm focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Note minimale</label>
        <input
          type="number"
          min={0}
          max={5}
          step="0.1"
          value={filters.rating_min}
          onChange={(event) => onChange("rating_min", event.target.value)}
          className="w-full rounded-xl border border-orange-100 px-3 py-2 shadow-sm focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Source</label>
        <input
          type="text"
          value={filters.source}
          onChange={(event) => onChange("source", event.target.value)}
          placeholder="Amazon, Decathlon..."
          className="w-full rounded-xl border border-orange-100 px-3 py-2 shadow-sm focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>
      <div className="flex items-end">
        <button
          type="button"
          onClick={onReset}
          className="w-full rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-100"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}

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

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({ ...FILTER_DEFAULTS });
  const [compareList, setCompareList] = useState(getStoredComparisons());

  useEffect(() => {
    const nextFilters = { ...FILTER_DEFAULTS };
    searchParams.forEach((value, key) => {
      nextFilters[key] = value;
    });
    setFilters(nextFilters);
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    const params = new URLSearchParams();
    Object.entries(next).forEach(([paramKey, paramValue]) => {
      if (paramValue) {
        params.set(paramKey, paramValue);
      }
    });
    setSearchParams(params);
  };

  const handleReset = () => {
    setFilters({ ...FILTER_DEFAULTS });
    setSearchParams({});
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const { data: response } = await apiClient.get("/products/search", { params: filters });
      return response;
    },
  });

  const addToCompare = (product) => {
    const existing = getStoredComparisons();
    if (existing.find((item) => item.id === product.id)) return;
    const next = [...existing, { id: product.id, name: product.name, price: product.price, brand: product.brand, images: product.images }].slice(-3);
    setCompareList(next);
    saveComparisons(next);
  };

  const products = useMemo(() => data?.items || [], [data]);

  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Comparateur</p>
        <h1 className="text-3xl font-extrabold text-gray-900">Produits & suppléments</h1>
        <p className="text-gray-600">Filtrez par catégorie, marque, prix ou source et ajoutez jusqu'à trois produits à comparer.</p>
      </header>

      <Filters filters={filters} onChange={handleFilterChange} onReset={handleReset} />

      {compareList.length ? (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
          <p className="text-sm font-semibold text-orange-700">Sélection pour comparaison :</p>
          {compareList.map((item) => (
            <Link
              key={item.id}
              to={`/products/${item.id}`}
              className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-orange-700 shadow-sm"
            >
              {item.images?.[0] ? <img src={item.images[0]} alt="" className="h-8 w-8 rounded-full object-cover" /> : <span>🏷️</span>}
              {item.name}
            </Link>
          ))}
          <Link
            to="/compare"
            className="ml-auto rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
          >
            Ouvrir la comparaison
          </Link>
        </div>
      ) : null}

      {isLoading ? (
        <SkeletonGrid />
      ) : isError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-700">
          <p className="text-lg font-semibold">Une erreur est survenue</p>
          <p className="text-sm text-red-600">Impossible de récupérer les produits.</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100"
          >
            Réessayer
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onCompare={addToCompare} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
