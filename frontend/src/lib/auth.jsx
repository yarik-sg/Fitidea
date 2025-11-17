import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "./apiClient";

const AuthContext = createContext(null);

const AUTH_TOKEN_KEY = "auth_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));

  useEffect(() => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [token]);

  const login = async (credentials) => {
    const { data } = await apiClient.post("/auth/login", credentials);
    setUser(data.user || null);
    setToken(data.token);
    return data;
  };

  const signup = async (payload) => {
    const { data } = await apiClient.post("/auth/signup", payload);
    setUser(data.user || null);
    setToken(data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      token,
      user,
      login,
      signup,
      logout,
    }),
    [token, user]
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
