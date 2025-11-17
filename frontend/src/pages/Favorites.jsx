import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import ProductCard from "../components/ProductCard";

function Favorites() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const { data } = await apiClient.get("/favorites");
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: (productId) => apiClient.delete(`/favorites/${productId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  if (isLoading) return <p className="text-muted-foreground">Chargement de vos favoris...</p>;
  if (isError) return <p className="text-destructive">Impossible de charger vos favoris.</p>;

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Favoris</p>
        <h2 className="page-title">Vos sélections</h2>
        <p className="text-muted-foreground">Retrouvez les produits que vous avez mis de côté.</p>
      </div>
      {data?.length ? (
        <div className="fit-grid">
          {data.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite
              onToggleFavorite={() => mutation.mutate(product.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Vous n'avez pas encore de favoris.</p>
      )}
    </div>
  );
}

export default Favorites;
