import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../lib/auth";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const mutation = useMutation({
    mutationFn: () => login(form),
    onSuccess: () => navigate("/products"),
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="mx-auto max-w-md">
      <Card className="border-slate-800 bg-slate-900/80">
        <CardHeader>
          <CardTitle className="text-2xl">Connexion</CardTitle>
          <p className="text-sm text-slate-400">Ravi de vous revoir !</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-200" htmlFor="email">
                Email
              </label>
              <Input
                required
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="vous@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200" htmlFor="password">
                Mot de passe
              </label>
              <Input
                required
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="********"
              />
            </div>
            {mutation.isError && (
              <p className="text-sm text-red-400">Identifiants invalides, veuillez réessayer.</p>
            )}
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? "Connexion..." : "Se connecter"}
            </Button>
            <p className="text-center text-sm text-slate-400">
              Pas encore de compte ? {" "}
              <Link to="/signup" className="text-emerald-400 hover:underline">
                Inscrivez-vous
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
