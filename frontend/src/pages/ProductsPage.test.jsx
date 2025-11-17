import React from "react";
import { render, screen } from "@testing-library/react";

import Products from "./Products";

const useQueryMock = vi.fn();
const createQueryClientMock = () => ({
  cancelQueries: vi.fn(),
  getQueriesData: vi.fn(() => []),
  setQueryData: vi.fn(),
});

vi.mock("@tanstack/react-query", () => ({
  useQuery: (...args) => useQueryMock(...args),
  useQueryClient: () => createQueryClientMock(),
  useMutation: () => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
  }),
}));

vi.mock("../components/ProductCard", () => ({
  __esModule: true,
  default: ({ title }) => <div data-testid="product-card">{title}</div>,
}));

afterEach(() => {
  useQueryMock.mockReset();
});

it("renders loading state", () => {
  useQueryMock.mockReturnValue({ isLoading: true, isError: false, data: null });

  const { container } = render(<Products />);

  expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
});

it("renders error state", () => {
  useQueryMock.mockReturnValue({ isLoading: false, isError: true, data: [] });

  render(<Products />);

  expect(screen.getByText(/Impossible de charger les produits/)).toBeInTheDocument();
});

it("renders product cards when data is available", () => {
  const products = [
    { id: 1, name: "Kettlebell" },
    { id: 2, name: "Tapis" },
  ];
  useQueryMock.mockReturnValue({ isLoading: false, isError: false, data: { items: products } });

  render(<Products />);

  expect(screen.getAllByTestId("product-card")).toHaveLength(products.length);
  expect(screen.getByText("Kettlebell")).toBeInTheDocument();
});
