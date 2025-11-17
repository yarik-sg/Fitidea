import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

function ProductCard({ product, actionLabel, onAction }) {
  return (
    <Card className="flex flex-col border-slate-800 bg-slate-900/70">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl text-slate-50">
          <span>{product.name}</span>
          <span className="text-lg font-semibold text-emerald-400">{product.price} €</span>
        </CardTitle>
        <p className="text-sm text-slate-400">{product.category || "Catégorie"}</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-4">
        <p className="text-sm text-slate-200 line-clamp-3">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <Link to={`/products/${product.id}`} className="text-emerald-300 hover:underline">
            Voir le détail
          </Link>
          {actionLabel && (
            <Button variant="outline" onClick={() => onAction?.(product)}>
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
