import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const registerMutation = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      return data;
    },
    onSuccess: () => {
      setErrorMessage("");
      setSuccessMessage("Compte créé ! Redirection...");
      setTimeout(() => navigate("/login"), 1200);
    },
    onError: (error) => {
      const apiMessage =
        error.response?.data?.detail || "Impossible de créer le compte, réessayez.";
      setSuccessMessage("");
      setErrorMessage(apiMessage);
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    registerMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/80 via-white to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-orange-100 bg-white shadow-sm px-6 py-8 sm:px-8 sm:py-10">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-orange-500">Fitidea</h1>
            <p className="mt-2 text-lg font-medium text-gray-800">Créez votre compte 💪</p>
            <p className="text-sm text-gray-500">Rejoignez l'aventure Fitidea et suivez vos produits.</p>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 p-3 text-sm">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 rounded-lg bg-green-50 border border-green-200 text-green-700 p-3 text-sm">
              {successMessage}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                Nom complet
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Alex Coach"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
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
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
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
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full rounded-lg bg-orange-500 px-4 py-2 text-white font-semibold shadow-sm hover:bg-orange-600 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {registerMutation.isPending ? "Création..." : "Créer le compte"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Déjà un compte ?{" "}
            <Link to="/login" className="font-semibold text-orange-500 hover:text-orange-600">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
