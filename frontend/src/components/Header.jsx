import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "../lib/auth";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? "text-emerald-400" : "text-slate-200 hover:text-emerald-300"}`;

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b border-slate-800/60 bg-slate-900/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center space-x-3 text-lg font-semibold">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-slate-900">FI</span>
          <span>Fitidea</span>
        </Link>
        <nav className="flex items-center space-x-6">
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
