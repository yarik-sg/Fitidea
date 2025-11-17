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

  if (isLoading) return <p>Chargement de vos favoris...</p>;
  if (isError) return <p>Impossible de charger vos favoris.</p>;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-widest text-emerald-200">Favoris</p>
        <h2 className="text-3xl font-bold">Vos sélections</h2>
        <p className="text-slate-400">Retrouvez les produits que vous avez mis de côté.</p>
      </div>
      {data?.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              actionLabel={mutation.isPending ? "..." : "Retirer"}
              onAction={() => mutation.mutate(product.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">Vous n'avez pas encore de favoris.</p>
      )}
    </div>
  );
}

export default Favorites;
