import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Products from "./Products";

const useQueryMock = vi.fn();

const createQueryClientMock = () => ({
  cancelQueries: vi.fn(),
  getQueryData: vi.fn(() => undefined),
  setQueryData: vi.fn(),
  invalidateQueries: vi.fn(),
});

vi.mock("@tanstack/react-query", () => ({
  useQuery: (...args) => useQueryMock(...args),
  useQueryClient: () => createQueryClientMock(),
  useMutation: () => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
  }),
}));

vi.mock("../lib/apiClient", () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

afterEach(() => {
  useQueryMock.mockReset();
});

const renderWithRouter = () =>
  render(
    <MemoryRouter initialEntries={["/products"]}>
      <Products />
    </MemoryRouter>
  );

it("renders loading state", () => {
  useQueryMock.mockReturnValue({ isLoading: true, isError: false, data: null });

  const { container } = renderWithRouter();

  expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
});

it("renders error state", () => {
  useQueryMock.mockReturnValue({ isLoading: false, isError: true, data: [], refetch: vi.fn() });

  renderWithRouter();

  expect(screen.getByText(/Une erreur est survenue/)).toBeInTheDocument();
});

it("renders product cards when data is available", () => {
  const products = [
    { id: 1, name: "Kettlebell" },
    { id: 2, name: "Tapis" },
  ];
  useQueryMock.mockReturnValue({ isLoading: false, isError: false, data: { items: products } });

  renderWithRouter();

  expect(screen.getAllByText(/Kettlebell|Tapis/)).toHaveLength(products.length);
});
