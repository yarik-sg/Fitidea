import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ProductCard from "./ProductCard";

const baseProduct = {
  id: 1,
  name: "Gourde inox",
  brand: "Fitidea",
  image_url: "https://example.com/gourde.jpg",
  min_price: 19,
  max_price: 39,
  rating: 4.2,
  offers_count: 3,
};

const renderCard = (props = {}) =>
  render(
    <MemoryRouter>
      <ProductCard product={baseProduct} {...props} />
    </MemoryRouter>
  );

describe("ProductCard", () => {
  it("renders product information with pricing and rating", () => {
    renderCard();

    expect(screen.getByText(/Gourde inox/)).toBeInTheDocument();
    expect(screen.getByText(/Fitidea/)).toBeInTheDocument();
    expect(screen.getByText("19€ - 39€")).toBeInTheDocument();
    expect(screen.getByText(/⭐⭐⭐⭐✩/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Voir le produit/ })).toHaveAttribute(
      "href",
      "/products/1"
    );
  });

  it("shows a placeholder when no image is provided", () => {
    renderCard({ product: { ...baseProduct, image_url: undefined } });

    expect(screen.getByText("🛒")).toBeInTheDocument();
  });

  it("calls the favorite toggle callback without reloading", () => {
    const onToggleFavorite = vi.fn();
    renderCard({ isFavorite: true, onToggleFavorite });

    fireEvent.click(screen.getByRole("button", { name: /Retirer des favoris/ }));
    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it("falls back to min price label when only min price is present", () => {
    renderCard({ product: { ...baseProduct, max_price: undefined } });

    expect(screen.getByText("À partir de 19€")).toBeInTheDocument();
  });
});
