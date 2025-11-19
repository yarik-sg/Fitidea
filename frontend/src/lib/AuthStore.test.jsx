import { renderHook, act } from "@testing-library/react";
import React from "react";

import { AuthProvider, useAuth } from "./auth";
import apiClient from "./apiClient";

vi.mock("./apiClient", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

const wrapper = ({ children }) => React.createElement(AuthProvider, null, children);

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

it("logs in and persists token", async () => {
  const credentials = { email: "user@example.com", password: "secret" };
  apiClient.post.mockResolvedValue({ data: { access_token: "abc123", user: { email: credentials.email } } });
  apiClient.get.mockResolvedValue({ data: { email: credentials.email } });

  const { result } = renderHook(() => useAuth(), { wrapper });

  await act(async () => {
    await result.current.login(credentials);
  });

  expect(apiClient.post).toHaveBeenCalledWith(
    "/auth/login",
    expect.any(URLSearchParams),
    expect.objectContaining({ headers: expect.objectContaining({ "Content-Type": "application/x-www-form-urlencoded" }) })
  );
  const params = apiClient.post.mock.calls[0][1];
  expect(params.get("username")).toBe(credentials.email);
  expect(result.current.token).toBe("abc123");
  expect(result.current.user.email).toBe(credentials.email);
  expect(localStorage.getItem("auth_token")).toBe("abc123");
});

it("logs out and clears state", async () => {
  apiClient.post.mockResolvedValue({ data: { access_token: "token", user: { email: "user@example.com" } } });
  apiClient.get.mockResolvedValue({ data: { email: "user@example.com" } });
  const { result } = renderHook(() => useAuth(), { wrapper });

  await act(async () => {
    await result.current.login({ email: "user@example.com", password: "secret" });
  });

  act(() => {
    result.current.logout();
  });

  expect(result.current.token).toBeNull();
  expect(result.current.user).toBeNull();
  expect(localStorage.getItem("auth_token")).toBeNull();
});
