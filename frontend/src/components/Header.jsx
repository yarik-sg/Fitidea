import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../lib/auth";

const baseNavLinks = [
  { to: "/", label: "Accueil", end: true },
  { to: "/products", label: "Suppléments" },
  { to: "/products", label: "Salles de sport" },
  { to: "/products", label: "Programmes" },
];

const getUserInitial = (user) => {
  if (!user) return "";
  const name = user.firstName || user.name || user.fullName || user.email || "";
  return name.charAt(0)?.toUpperCase() || "";
};

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [withShadow, setWithShadow] = useState(false);

  const navLinks = useMemo(
    () => (isAuthenticated ? [...baseNavLinks, { to: "/favorites", label: "Favoris" }] : baseNavLinks),
    [isAuthenticated]
  );

  const userInitial = useMemo(() => getUserInitial(user), [user]);

  useEffect(() => {
    const handleScroll = () => setWithShadow(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobile = () => setIsMobileOpen(false);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleLogout = () => {
    logout();
    closeMobile();
    closeDropdown();
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-orange-100 transition-all duration-200 ${
        withShadow ? "shadow-lg shadow-orange-50" : ""
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link to="/" className="group flex items-center gap-2" aria-label="Fitidea" onClick={closeMobile}>
            <span className="text-2xl font-black tracking-tight text-gray-900 group-hover:text-orange-500 transition">
              Fitidea
            </span>
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600 shadow-sm">🧡</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 hover:text-orange-600 hover:bg-orange-50 ${
                  isActive ? "text-orange-600 bg-orange-50 shadow-inner shadow-orange-50" : "text-gray-700"
                }`
              }
              onClick={closeMobile}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-orange-100 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-200 hover:border-orange-200 hover:text-orange-600"
                onClick={() => setIsDropdownOpen((open) => !open)}
                aria-label="Ouvrir le menu utilisateur"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white shadow-md">
                  {userInitial || "😊"}
                </span>
                <span className="hidden sm:inline">
                  {user?.firstName || user?.name || user?.fullName || "Mon espace"}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-orange-100 bg-white p-2 shadow-lg shadow-orange-50">
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Navigation</div>
                  <NavLink
                    to="/products"
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-orange-50 ${
                        isActive ? "text-orange-600" : "text-gray-700"
                      }`
                    }
                    onClick={() => {
                      closeDropdown();
                    }}
                  >
                    🏋️‍♂️ Mon espace
                  </NavLink>
                  <NavLink
                    to="/favorites"
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-orange-50 ${
                        isActive ? "text-orange-600" : "text-gray-700"
                      }`
                    }
                    onClick={() => {
                      closeDropdown();
                    }}
                  >
                    ⭐ Favoris
                  </NavLink>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
                  >
                    🔒 Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-700"
              >
                Connexion
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-600"
              >
                Créer un compte
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          {isAuthenticated && (
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">Bienvenue</span>
          )}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-orange-100 bg-white text-orange-600 shadow-sm transition hover:border-orange-200 hover:bg-orange-50"
            onClick={() => setIsMobileOpen((open) => !open)}
            aria-label="Ouvrir le menu"
          >
            <span className="text-xl">{isMobileOpen ? "✖" : "☰"}</span>
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm" onClick={closeMobile} aria-hidden />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto border-l border-orange-100 bg-white/95 px-5 py-6 shadow-lg shadow-orange-50">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-gray-900">Fitidea</span>
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">🔥</span>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-orange-100 bg-white text-orange-600 shadow-sm transition hover:border-orange-200"
                onClick={closeMobile}
                aria-label="Fermer le menu"
              >
                ✖
              </button>
            </div>

            <nav className="space-y-3">
              {navLinks.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-2xl border px-4 py-3 text-base font-semibold transition-all duration-200 shadow-sm ${
                      isActive
                        ? "border-orange-200 bg-orange-50 text-orange-600"
                        : "border-orange-100 bg-white text-gray-800 hover:scale-[1.01] hover:shadow-lg hover:shadow-orange-50"
                    }`
                  }
                  onClick={closeMobile}
                >
                  <span>{label}</span>
                  <span aria-hidden className="text-orange-500">→</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-6 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 shadow-inner">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-lg font-bold text-white shadow-md">
                      {userInitial || "😊"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        {user?.firstName || user?.name || user?.fullName || "Membre Fitidea"}
                      </span>
                      <span className="text-xs text-gray-600">Accès premium</span>
                    </div>
                  </div>

                  <NavLink
                    to="/favorites"
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                        isActive ? "border-orange-200 bg-orange-50 text-orange-600" : "border-orange-100 bg-white text-gray-800"
                      }`
                    }
                    onClick={closeMobile}
                  >
                    <span>⭐ Favoris</span>
                    <span aria-hidden>→</span>
                  </NavLink>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm font-semibold text-orange-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
                  >
                    🔒 Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobile}
                    className="flex items-center justify-center rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm font-semibold text-orange-600 shadow-sm transition hover:scale-[1.01] hover:border-orange-300"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMobile}
                    className="flex items-center justify-center rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:scale-[1.01] hover:bg-orange-600"
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
