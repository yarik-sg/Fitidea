import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import apiClient from "../lib/apiClient";
import GymCard from "../components/GymCard";

const BRANDS = [
  { value: "", label: "Toutes les enseignes" },
  { value: "basicfit", label: "Basic-Fit" },
  { value: "fitnesspark", label: "Fitness Park" },
  { value: "neoness", label: "Neoness" },
  { value: "onair", label: "OnAir" },
  { value: "keepcool", label: "KeepCool" },
];

const PAGE_SIZE = 9;

function Gyms() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");
  const [cityValue, setCityValue] = useState(searchParams.get("city") ?? "");
  const [brandValue, setBrandValue] = useState(searchParams.get("brand") ?? "");

  const page = Number(searchParams.get("page") ?? "1");

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") ?? "",
      city: searchParams.get("city") ?? "",
      brand: searchParams.get("brand") ?? "",
      page,
    }),
    [searchParams, page]
  );

  useEffect(() => {
    setSearchValue(searchParams.get("search") ?? "");
    setCityValue(searchParams.get("city") ?? "");
    setBrandValue(searchParams.get("brand") ?? "");
  }, [searchParams]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.delete("page");
    setSearchParams(next, { replace: true });
  };

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["gyms", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page_size", String(PAGE_SIZE));
      params.set("page", String(filters.page ?? 1));
      if (filters.search) params.set("search", filters.search);
      if (filters.city) params.set("city", filters.city);
      if (filters.brand) params.set("brand", filters.brand);

      const url = `/gyms?${params.toString()}`;
      const { data: response } = await apiClient.get(url);
      return response;
    },
    keepPreviousData: true,
  });

  const gyms = data?.items ?? [];
  const total = data?.total ?? gyms.length;
  const totalPages = Math.max(1, Math.ceil(total / (data?.page_size ?? PAGE_SIZE)));

  const handlePageChange = (direction) => {
    const nextPage = Math.min(Math.max(1, page + direction), totalPages);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(nextPage));
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <main className="min-h-screen space-y-8">
      <div className="flex flex-col gap-3 text-center">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-700">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-base">🏋️</span>
          Salles de sport
        </p>
        <h1 className="page-title">Trouvez la salle idéale près de chez vous</h1>
        <p className="mx-auto max-w-2xl text-sm text-gray-600">
          Filtrez par ville, enseigne ou mot-clé et découvrez les meilleures salles partenaires Fitidea.
        </p>
      </div>

      <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-lg shadow-orange-50">
        <div className="grid gap-4 md:grid-cols-[2fr,1.2fr,1.2fr]">
          <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
            Recherche
            <div className="relative">
              <input
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                onBlur={() => updateParam("search", searchValue)}
                placeholder="Nom, adresse…"
                className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-inner shadow-orange-50 focus:border-orange-400 focus:outline-none"
              />
              {searchValue ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchValue("");
                    updateParam("search", "");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                >
                  Réinitialiser
                </button>
              ) : null}
            </div>
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
            Ville
            <input
              type="text"
              value={cityValue}
              onChange={(event) => setCityValue(event.target.value)}
              onBlur={() => updateParam("city", cityValue)}
              placeholder="Paris, Lyon, Marseille…"
              className="rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-inner shadow-orange-50 focus:border-orange-400 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-gray-700">
            Chaîne
            <select
              value={brandValue}
              onChange={(event) => updateParam("brand", event.target.value)}
              className="rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-inner shadow-orange-50 focus:border-orange-400 focus:outline-none"
            >
              {BRANDS.map((brand) => (
                <option key={brand.value || "all"} value={brand.value}>
                  {brand.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm text-gray-600">
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
          {isFetching ? "Mise à jour…" : `${total} salles`}
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-2 text-xs font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
        >
          Découvrir les compléments
        </Link>
      </div>

      {isError ? (
        <div className="rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-50 via-white to-orange-100 p-8 text-sm text-gray-700 shadow-md shadow-orange-50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold text-gray-900">Impossible de charger les salles</p>
                <p className="text-gray-600">Vérifiez votre connexion ou réessayez dans quelques instants.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={refetch}
              className="inline-flex items-center rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
            >
              Réessayer
            </button>
          </div>
        </div>
      ) : null}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <div
              key={index}
              className="h-full animate-pulse rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-orange-100 p-6"
            >
              <div className="mb-4 h-6 w-2/3 rounded bg-orange-100" />
              <div className="mb-2 h-4 w-1/3 rounded bg-orange-100" />
              <div className="h-32 rounded-xl bg-orange-50" />
            </div>
          ))
        ) : gyms.length ? (
          gyms.map((gym) => <GymCard key={gym.id} gym={gym} />)
        ) : (
          <div className="col-span-full rounded-3xl border border-orange-200 bg-white p-10 text-center text-sm text-gray-600 shadow-sm">
            Aucune salle ne correspond à votre recherche pour le moment.
          </div>
        )}
      </section>

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => handlePageChange(-1)}
            className="rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={page <= 1 || isLoading}
          >
            ← Précédent
          </button>
          <span className="text-xs font-semibold text-gray-600">Page {page} / {totalPages}</span>
          <button
            type="button"
            onClick={() => handlePageChange(1)}
            className="rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={page >= totalPages || isLoading}
          >
            Suivant →
          </button>
        </div>
      ) : null}
    </main>
  );
}

export default Gyms;
