import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

function Home() {
  const highlights = ["Programmes", "Accessoires", "Coaching", "Nutrition"];

  return (
    <div className="section-spacing">
      <section className="glass-surface rounded-3xl p-10">
        <div className="flex flex-col items-start space-y-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <p className="eyebrow">Bienvenue</p>
            <h1 className="page-title">
              Boostez vos idées fitness avec <span className="fit-gradient-text">Fitidea</span>
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Parcourez notre catalogue, enregistrez vos produits favoris et retrouvez-les à tout moment.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/products">Explorer les produits</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/signup">Créer un compte</Link>
              </Button>
            </div>
          </div>
          <div className="grid w-full max-w-lg grid-cols-2 gap-4">
            {highlights.map((item) => (
              <Card key={item} className="border-border/70">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white flex items-center justify-between">
                    {item}
                    <Badge variant="outline">Focus</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
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
