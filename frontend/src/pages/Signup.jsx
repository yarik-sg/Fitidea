import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../lib/auth";

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const signupMutation = useMutation({
    mutationFn: async () => {
      if (form.password !== form.confirmPassword) {
        throw new Error("Les mots de passe doivent correspondre.");
      }
      const data = await signup({ email: form.email, password: form.password, confirmPassword: form.confirmPassword });
      return data;
    },
    onSuccess: () => {
      setErrorMessage("");
      navigate("/products");
    },
    onError: (error) => {
      const apiMessage = error.response?.data?.detail || error.message || "Impossible de créer votre compte.";
      setErrorMessage(apiMessage);
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    signupMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/70 via-white to-white px-4 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 lg:flex-row lg:justify-between">
        <div className="max-w-xl space-y-4 text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600 shadow-sm">
            🧡 Communauté Fitidea
          </p>
          <h1 className="text-4xl font-black text-gray-900 sm:text-5xl">Créer un compte</h1>
          <p className="text-lg text-gray-600">Rejoignez la communauté Fitidea et débloquez vos favoris.</p>
          <div className="grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
            <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-lg shadow-orange-50">
              <p className="text-sm font-semibold text-gray-900">Onboarding rapide</p>
              <p className="text-sm text-gray-600">Un formulaire clair, des actions accessibles, un design premium.</p>
            </div>
            <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-lg shadow-orange-50">
              <p className="text-sm font-semibold text-gray-900">Sécurité</p>
              <p className="text-sm text-gray-600">Mot de passe sécurisé avec focus en orange et alertes claires.</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-orange-100 bg-white p-8 shadow-lg shadow-orange-50">
            <div className="mb-6 space-y-1 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Créer un compte</h2>
              <p className="text-sm font-medium text-gray-600">Rejoignez la communauté Fitidea</p>
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

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700" htmlFor="confirmPassword">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <p className="text-xs text-gray-500">En créant un compte, vous acceptez les CGU.</p>

              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:scale-[1.01] hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {signupMutation.isPending ? "Création..." : "Créer mon compte"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Déjà inscrit ?{" "}
              <Link to="/login" className="font-semibold text-orange-600 hover:text-orange-700">
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
