import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

function Home() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-r from-emerald-500/20 via-sky-500/10 to-purple-500/10 p-10 shadow-xl">
        <div className="flex flex-col items-start space-y-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-widest text-emerald-200">Bienvenue</p>
            <h1 className="text-4xl font-bold text-slate-50 md:text-5xl">
              Boostez vos idées fitness avec Fitidea
            </h1>
            <p className="max-w-2xl text-lg text-slate-200">
              Parcourez notre catalogue, enregistrez vos produits favoris et retrouvez-les à tout moment.
            </p>
            <div className="flex space-x-3">
              <Button asChild>
                <Link to="/products">Explorer les produits</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/signup">Créer un compte</Link>
              </Button>
            </div>
          </div>
          <div className="grid w-full max-w-sm grid-cols-2 gap-4 md:max-w-lg">
            {["Programmes", "Accessoires", "Coaching", "Nutrition"].map((item) => (
              <Card key={item} className="border-slate-800/80 bg-slate-900/80">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-100">{item}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-400">
                  Découvrez une sélection premium pour vos objectifs.
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
