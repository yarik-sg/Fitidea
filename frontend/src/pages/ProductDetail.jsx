import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";

const formatPrice = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return null;
  return `${numeric.toFixed(2)}€`;
};

function ImageGallery({ images, name }) {
  const [active, setActive] = useState(0);
  if (!images?.length) return (
    <div className="flex h-full min-h-[360px] items-center justify-center rounded-3xl bg-gradient-to-br from-orange-50 via-white to-orange-100 text-5xl">
      🏋️
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
        <img src={images[active]} alt={name} className="h-full max-h-[420px] w-full object-cover" />
      </div>
      <div className="grid grid-cols-5 gap-3">
        {images.slice(0, 5).map((url, index) => (
          <button
            key={url}
            type="button"
            onClick={() => setActive(index)}
            className={`overflow-hidden rounded-2xl border ${active === index ? "border-orange-400 ring-2 ring-orange-200" : "border-orange-100"} bg-white`}
          >
            <img src={url} alt="" className="h-20 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  if (!value) return null;
  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm shadow-orange-50">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">{label}</p>
      <p className="mt-1 text-base font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function NutritionTable({ nutrition }) {
  if (!nutrition) return null;
  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">Profil nutritionnel</p>
      <p className="mt-2 text-sm text-gray-700">{nutrition}</p>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading, isError, refetch } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/products/${id}`);
      return data;
    },
  });

  const images = useMemo(() => (Array.isArray(product?.images) ? product.images : []), [product]);
  const priceLabel = formatPrice(product?.price);

  if (isLoading) {
    return <div className="h-80 animate-pulse rounded-3xl bg-orange-50" />;
  }

  if (isError || !product) {
    return (
      <div className="space-y-3 rounded-3xl border border-red-100 bg-red-50 p-6 text-red-700">
        <p className="text-lg font-semibold">Impossible de charger le produit</p>
        <button
          type="button"
          onClick={refetch}
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">{product.category || "Produit"}</p>
          <h1 className="text-3xl font-extrabold text-gray-900">{product.name}</h1>
          <p className="text-gray-600">{product.brand || product.source}</p>
        </div>
        <Link
          to="/products"
          className="rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm hover:bg-orange-100"
        >
          ← Retour
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <ImageGallery images={images} name={product.name} />
        <div className="space-y-4">
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm shadow-orange-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-extrabold text-orange-600">{priceLabel || "Prix non disponible"}</p>
                {product.rating ? (
                  <p className="text-sm text-gray-600">Note {Number(product.rating).toFixed(1)} ({product.reviews_count || 0} avis)</p>
                ) : null}
              </div>
              {product.url ? (
                <a
                  href={product.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
                >
                  Visiter le site
                </a>
              ) : null}
            </div>
            {product.description ? (
              <p className="mt-3 text-sm text-gray-700">{product.description}</p>
            ) : null}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <InfoCard label="Source" value={product.source} />
            <InfoCard label="Marque" value={product.brand} />
            <InfoCard label="Catégorie" value={product.category} />
            <InfoCard label="Avis" value={product.reviews_count ? `${product.reviews_count} avis` : null} />
          </div>

          <NutritionTable nutrition={product.nutrition} />
        </div>
      </div>

      {product.offers?.length ? (
        <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">Offres comparées</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-800">
            {product.offers.map((offer) => (
              <li key={offer.id} className="flex items-center justify-between rounded-xl bg-orange-50/60 px-3 py-2">
                <span className="font-semibold">Offre #{offer.id}</span>
                <span>{formatPrice(offer.price) || "-"}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="text-right">
        <Link to="/compare" className="text-sm font-semibold text-orange-700 hover:underline">
          Ajouter à la comparaison
        </Link>
      </div>
    </div>
  );
}

export default ProductDetail;
