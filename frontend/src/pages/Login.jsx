import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../lib/auth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const loginMutation = useMutation({
    mutationFn: async () => {
      const data = await login({ email: form.email, password: form.password });
      return data;
    },
    onSuccess: () => {
      setErrorMessage("");
      navigate("/products");
    },
    onError: (error) => {
      const apiMessage =
        error.response?.data?.detail || "Impossible de vous connecter. Vérifiez vos identifiants.";
      setErrorMessage(apiMessage);
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/80 via-white to-white px-4 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 lg:flex-row lg:justify-between">
        <div className="max-w-xl space-y-4 text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600 shadow-sm">
            🔒 Connexion sécurisée
          </p>
          <h1 className="text-4xl font-black text-gray-900 sm:text-5xl">Connexion</h1>
          <p className="text-lg text-gray-600">Accédez à votre espace Fitidea en toute simplicité.</p>
          <div className="grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
            <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-lg shadow-orange-50">
              <p className="text-sm font-semibold text-gray-900">Interface premium</p>
              <p className="text-sm text-gray-600">Design inspiré de Stripe et Linear pour une expérience fluide.</p>
            </div>
            <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-lg shadow-orange-50">
              <p className="text-sm font-semibold text-gray-900">Favoris instantanés</p>
              <p className="text-sm text-gray-600">Retrouvez vos produits préférés dès la connexion.</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-orange-100 bg-white p-8 shadow-lg shadow-orange-50">
            <div className="mb-6 space-y-1 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
              <p className="text-sm font-medium text-gray-600">Accédez à votre espace Fitidea</p>
            </div>

            {errorMessage && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="vous@example.com"
                  className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700" htmlFor="password">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Mot de passe oublié ?</span>
                <Link to="/signup" className="font-semibold text-orange-600 hover:text-orange-700">
                  Créer un compte
                </Link>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:scale-[1.01] hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loginMutation.isPending ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Pas encore de compte ?{" "}
              <Link to="/signup" className="font-semibold text-orange-600 hover:text-orange-700">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
