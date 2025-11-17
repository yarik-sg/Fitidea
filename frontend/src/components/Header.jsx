import React, { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../lib/auth";

const navLinks = [
  { to: "/", label: "Accueil", end: true },
  { to: "/products", label: "Produits" },
  { to: "/favorites", label: "Favoris" },
];

const getFirstName = (user) => {
  if (!user) return null;
  if (user.firstName) return user.firstName;
  if (user.name) return user.name.split(" ")[0];
  if (user.fullName) return user.fullName.split(" ")[0];
  return null;
};

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const firstName = useMemo(() => getFirstName(user), [user]);

  const linkBaseClass =
    "inline-flex items-center text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-orange-500";

  const buttonBaseClass =
    "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200";

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-orange-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
            <span className="text-2xl font-extrabold tracking-tight text-orange-500">Fitidea</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4 md:hidden">
          {isAuthenticated && firstName && (
            <span className="text-sm font-semibold text-gray-700">Bonjour {firstName}</span>
          )}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-orange-100 bg-white text-orange-500 transition-colors duration-200 hover:border-orange-300"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Ouvrir le menu"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="hidden items-center space-x-8 md:flex">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${linkBaseClass} ${isActive ? "text-orange-500" : ""}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center space-x-3 md:flex">
          {isAuthenticated ? (
            <>
              {firstName && (
                <span className="text-sm font-semibold text-gray-700">Bonjour {firstName}</span>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className={`${buttonBaseClass} border border-orange-200 bg-white text-orange-500 hover:border-orange-400 hover:text-orange-600`}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`${buttonBaseClass} border border-orange-200 bg-white text-orange-500 hover:border-orange-400 hover:text-orange-600`}
              >
                Connexion
              </Link>
              <Link
                to="/signup"
                className={`${buttonBaseClass} bg-orange-500 text-white shadow-sm hover:bg-orange-600`}
              >
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="mx-auto max-w-6xl space-y-4 px-4 pb-4 sm:px-6 lg:px-8">
            <nav className="flex flex-col space-y-2">
              {navLinks.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `${linkBaseClass} rounded-lg px-2 py-2 ${
                      isActive ? "bg-orange-50 text-orange-500" : "hover:bg-orange-50"
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
            <div className="flex flex-col space-y-2 border-t border-orange-100 pt-4">
              {isAuthenticated ? (
                <>
                  {firstName && (
                    <span className="text-sm font-semibold text-gray-700">Bonjour {firstName}</span>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`${buttonBaseClass} border border-orange-200 bg-white text-orange-500 hover:border-orange-400 hover:text-orange-600`}
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`${buttonBaseClass} border border-orange-200 bg-white text-orange-500 hover:border-orange-400 hover:text-orange-600`}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className={`${buttonBaseClass} bg-orange-500 text-white shadow-sm hover:bg-orange-600`}
                  >
                    Créer un compte
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
