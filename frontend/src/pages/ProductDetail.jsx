import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

function ProductDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/products/${id}`);
      return data;
    },
  });

  const { mutate: toggleFavorite, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post(`/products/${id}/favorite`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  if (isLoading) return <p>Chargement...</p>;
  if (isError || !product) return <p>Produit introuvable.</p>;

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <Card className="md:col-span-2 border-slate-800 bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-3xl text-slate-50">{product.name}</CardTitle>
          <p className="text-slate-400">{product.category}</p>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-200">
          <p>{product.description}</p>
          <div className="flex items-center space-x-2 text-lg font-semibold text-emerald-400">
            <span>{product.price} €</span>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-4">
        <Card className="border-slate-800 bg-slate-900/70">
          <CardHeader>
            <CardTitle className="text-xl">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" onClick={() => toggleFavorite()} disabled={isPending}>
              {isPending ? "Enregistrement..." : "Ajouter aux favoris"}
            </Button>
            <Button variant="outline" className="w-full">
              Contacter le vendeur
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProductDetail;
