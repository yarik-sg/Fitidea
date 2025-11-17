import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

function ProductCard({ product, actionLabel, onAction }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <CardTitle className="flex-1 text-xl text-white">
            {product.name}
          </CardTitle>
          <span className="text-lg font-semibold text-primary">{product.price} €</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{product.category || "Catégorie"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <Link to={`/products/${product.id}`} className="text-primary transition hover:text-primary/80">
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
