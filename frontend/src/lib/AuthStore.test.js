import { renderHook, act } from "@testing-library/react";
import React from "react";

import { AuthProvider, useAuth } from "./auth";
import apiClient from "./apiClient";

vi.mock("./apiClient", () => ({
  default: {
    post: vi.fn(),
  },
}));

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

it("logs in and persists token", async () => {
  const credentials = { username: "user@example.com", password: "secret" };
  apiClient.post.mockResolvedValue({ data: { token: "abc123", user: { email: credentials.username } } });

  const { result } = renderHook(() => useAuth(), { wrapper });

  await act(async () => {
    await result.current.login(credentials);
  });

  expect(apiClient.post).toHaveBeenCalledWith("/auth/login", credentials);
  expect(result.current.token).toBe("abc123");
  expect(result.current.user.email).toBe(credentials.username);
  expect(localStorage.getItem("auth_token")).toBe("abc123");
});

it("logs out and clears state", async () => {
  apiClient.post.mockResolvedValue({ data: { token: "token", user: { email: "user@example.com" } } });
  const { result } = renderHook(() => useAuth(), { wrapper });

  await act(async () => {
    await result.current.login({ username: "user@example.com", password: "secret" });
  });

  act(() => {
    result.current.logout();
  });

  expect(result.current.token).toBeNull();
  expect(result.current.user).toBeNull();
  expect(localStorage.getItem("auth_token")).toBeNull();
});
