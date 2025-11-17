import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { useAuth } from "../lib/auth";

const navLinkClass = ({ isActive }) =>
  cn(
    "text-sm font-medium transition-colors",
    isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
  );

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur">
      <div className="section-shell flex items-center justify-between py-4">
        <Link to="/" className="flex items-center space-x-3 text-lg font-semibold">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">FI</span>
          <span className="text-white">Fitidea</span>
        </Link>
        <nav className="hidden items-center space-x-6 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Accueil
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Produits
          </NavLink>
          <NavLink to="/favorites" className={navLinkClass}>
            Favoris
          </NavLink>
        </nav>
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <Button variant="outline" onClick={handleLogout}>
              Déconnexion
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>Connexion</Button>
              <Button onClick={() => navigate("/signup")}>Créer un compte</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
