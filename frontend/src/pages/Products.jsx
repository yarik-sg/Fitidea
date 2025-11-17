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

  if (isLoading) return <p className="text-muted-foreground">Chargement des produits...</p>;
  if (isError) return <p className="text-destructive">Impossible de charger les produits.</p>;

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Catalogue</p>
        <h2 className="page-title">Produits disponibles</h2>
        <p className="text-muted-foreground">Explorez l'offre Fitidea pour accompagner vos entraînements.</p>
      </div>
      <div className="fit-grid">
        {data?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Products;
