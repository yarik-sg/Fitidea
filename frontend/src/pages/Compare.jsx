import React, { useEffect, useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import { Link } from "react-router-dom";

const fetchProduct = async (id) => {
  const { data } = await apiClient.get(`/products/${id}`);
  return data;
};

const getStoredComparisons = () => {
  const stored = localStorage.getItem("compare_products");
  return stored ? JSON.parse(stored) : [];
};

const saveComparisons = (items) => {
  localStorage.setItem("compare_products", JSON.stringify(items));
};

function SearchModal({ open, onClose, onSelect }) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const { data } = await apiClient.get("/products/search", {
        params: { q: term, page_size: 5 },
      });
      setResults(data.items || []);
    } finally {
      setIsSearching(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Ajouter un produit</h3>
          <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">
            Fermer
          </button>
        </div>
        <div className="mt-4 flex gap-3">
          <input
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Rechercher whey, créatine, équipement..."
            className="flex-1 rounded-xl border border-orange-100 px-3 py-2 shadow-sm focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-700"
          >
            {isSearching ? "Recherche..." : "Rechercher"}
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {results.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className="flex w-full items-center justify-between rounded-xl border border-orange-100 px-3 py-2 text-left shadow-sm hover:border-orange-200"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">{item.brand || item.category}</p>
              </div>
              <span className="text-sm font-semibold text-orange-600">{item.price ? `${Number(item.price).toFixed(2)}€` : "-"}</span>
            </button>
          ))}
          {!results.length && !isSearching ? (
            <p className="text-sm text-gray-500">Aucun résultat pour l'instant</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ComparisonTable({ products }) {
  const labels = [
    { key: "brand", label: "Marque" },
    { key: "price", label: "Prix" },
    { key: "rating", label: "Note" },
    { key: "category", label: "Catégorie" },
    { key: "description", label: "Description" },
    { key: "nutrition", label: "Protéines/portion" },
    { key: "reviews_count", label: "Avis" },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-orange-100 bg-white shadow-sm shadow-orange-50">
      <table className="min-w-full divide-y divide-orange-100">
        <thead className="bg-orange-50/60">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Feature</th>
            {products.map((product) => (
              <th key={product.id} className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                {product.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-orange-50">
          {labels.map((item) => (
            <tr key={item.key}>
              <td className="px-4 py-3 text-sm font-semibold text-gray-600">{item.label}</td>
              {products.map((product) => (
                <td key={`${product.id}-${item.key}`} className="px-4 py-3 text-sm text-gray-800">
                  {item.key === "price"
                    ? product.price ? `${Number(product.price).toFixed(2)}€` : "-"
                    : product[item.key] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Compare() {
  const [selected, setSelected] = useState(getStoredComparisons());
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    saveComparisons(selected);
  }, [selected]);

  const productQueries = useQueries({
    queries: selected.map((item) => ({
      queryKey: ["product", item.id],
      queryFn: () => fetchProduct(item.id),
      enabled: Boolean(item.id),
    })),
  });

  const products = useMemo(
    () =>
      productQueries
        .map((entry) => entry.data)
        .filter(Boolean)
        .slice(0, 3),
    [productQueries]
  );

  const addProduct = (product) => {
    if (selected.find((item) => item.id === product.id)) return;
    const next = [...selected, { id: product.id, name: product.name, images: product.images }].slice(-3);
    setSelected(next);
    setOpenModal(false);
  };

  const removeProduct = (id) => {
    const next = selected.filter((item) => item.id !== id);
    setSelected(next);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Comparateur</p>
          <h1 className="text-3xl font-extrabold text-gray-900">Comparer les produits</h1>
          <p className="text-gray-600">Ajoutez jusqu'à trois produits et analysez les caractéristiques clés.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpenModal(true)}
          className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700"
        >
          Ajouter un produit
        </button>
      </header>

      <div className="flex flex-wrap gap-3">
        {selected.map((item) => (
          <div key={item.id} className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-orange-700 shadow-sm">
            {item.images?.[0] ? (
              <img src={item.images[0]} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <span>🏷️</span>
            )}
            <span>{item.name}</span>
            <button
              type="button"
              onClick={() => removeProduct(item.id)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {products.length ? <ComparisonTable products={products} /> : <p className="text-gray-600">Ajoutez un produit pour commencer la comparaison.</p>}

      <SearchModal open={openModal} onClose={() => setOpenModal(false)} onSelect={addProduct} />

      <div className="text-right">
        <Link to="/products" className="text-sm font-semibold text-orange-700 hover:underline">
          Retour aux produits
        </Link>
      </div>
    </div>
  );
}

export default Compare;
