import React from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import ProductCard from "../components/ProductCard";

function Products() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await apiClient.get("/products");
      return data;
    },
  });

  if (isLoading) return <p>Chargement des produits...</p>;
  if (isError) return <p>Impossible de charger les produits.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-emerald-200">Catalogue</p>
          <h2 className="text-3xl font-bold">Produits disponibles</h2>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Products;
