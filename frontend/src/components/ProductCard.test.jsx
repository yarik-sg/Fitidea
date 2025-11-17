import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ProductCard from "./ProductCard";

const baseProps = {
  id: 1,
  title: "Gourde inox",
  price: 29,
  image: "https://example.com/gourde.jpg",
  rating: 4.2,
};

const renderCard = (props = {}) =>
  render(
    <MemoryRouter>
      <ProductCard {...baseProps} {...props} />
    </MemoryRouter>
  );

describe("ProductCard", () => {
  it("renders product information with formatted price and rating", () => {
    renderCard();

    expect(screen.getByText(baseProps.title)).toBeInTheDocument();
    expect(screen.getByText("29€")).toBeInTheDocument();
    expect(screen.getByText("⭐ 4.2/5")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /produit/i })[0]).toHaveAttribute(
      "href",
      "/products/1"
    );
  });

  it("shows a fallback when no image is provided", () => {
    renderCard({ image: null });

    expect(screen.getByText("🛒")).toBeInTheDocument();
  });

  it("calls favorite toggle with the product id", () => {
    const onToggleFavorite = vi.fn();
    renderCard({ isFavorite: true, onToggleFavorite });

    fireEvent.click(screen.getByRole("button", { name: /Retirer des favoris/ }));
    expect(onToggleFavorite).toHaveBeenCalledWith(baseProps.id);
  });

  it("handles missing price gracefully", () => {
    renderCard({ price: null });

    expect(screen.getByText(/Prix non disponible/)).toBeInTheDocument();
  });
});
