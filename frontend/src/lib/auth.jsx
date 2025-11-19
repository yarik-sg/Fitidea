import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "./apiClient";

const AuthContext = createContext(null);

const AUTH_TOKEN_KEY = "auth_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setStatus("idle");
      return;
    }
    if (user) {
      setStatus("authenticated");
      return;
    }

    let cancelled = false;
    setStatus("loading");
    apiClient
      .get("/auth/me")
      .then(({ data }) => {
        if (!cancelled) {
          setUser(data);
          setStatus("authenticated");
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.warn("Unable to refresh session", error);
          setToken(null);
          setUser(null);
          setStatus("idle");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token, user]);

  const login = useCallback(async ({ email, password }) => {
    const body = new URLSearchParams();
    body.set("username", email);
    body.set("password", password);

    const { data } = await apiClient.post("/auth/login", body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    setUser(data.user || null);
    setToken(data.access_token);
    setStatus("authenticated");
    return data;
  }, []);

  const signup = useCallback(async ({ email, password, full_name }) => {
    const payload = { email, password };
    if (full_name) {
      payload.full_name = full_name;
    }
    const { data } = await apiClient.post("/auth/signup", payload);
    setUser(data.user || null);
    setToken(data.access_token);
    setStatus("authenticated");
    return data;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setStatus("idle");
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      token,
      user,
      status,
      login,
      signup,
      logout,
    }),
    [token, user, status, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
