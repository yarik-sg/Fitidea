import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
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

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;
  if (isError || !product) return <p className="text-destructive">Produit introuvable.</p>;

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <CardTitle className="text-3xl text-white">{product.name}</CardTitle>
              <Badge variant="outline">{product.category}</Badge>
            </div>
            <span className="text-xl font-semibold text-primary">{product.price} €</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>{product.description}</p>
        </CardContent>
      </Card>
      <div className="space-y-4">
        <Card>
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
