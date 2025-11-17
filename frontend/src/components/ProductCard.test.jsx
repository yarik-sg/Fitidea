import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ProductCard from "./ProductCard";

const product = {
  id: 1,
  name: "Test Product",
  description: "A useful product",
  price: "19.99",
  category: "Accessoires",
};

function renderCard(props = {}) {
  return render(
    <MemoryRouter>
      <ProductCard product={product} {...props} />
    </MemoryRouter>
  );
}

it("renders product details", () => {
  renderCard();

  expect(screen.getByText(/Test Product/)).toBeInTheDocument();
  expect(screen.getByText(/19.99/)).toBeInTheDocument();
  expect(screen.getByText(/Accessoires/)).toBeInTheDocument();
  expect(screen.getByText(/Voir le détail/)).toHaveAttribute("href", "/products/1");
});

it("triggers callback when action button is clicked", () => {
  const onAction = vi.fn();

  renderCard({ actionLabel: "Ajouter", onAction });

  fireEvent.click(screen.getByRole("button", { name: /Ajouter/ }));
  expect(onAction).toHaveBeenCalledWith(product);
});

it("shows fallback category when none is provided", () => {
  renderCard({ product: { ...product, category: undefined } });

  expect(screen.getByText(/Catégorie/)).toBeInTheDocument();
});
