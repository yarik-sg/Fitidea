# Frontend Fitidea (React/Vite)

## Stack
- React 18, Vite, React Router, TanStack Query.
- Tailwind CSS (config `tailwind.config.js`).
- Tests : Vitest + React Testing Library (`npm test`).

## Structure
```
src/
 ├── lib/
 │     apiClient.js (Axios + base URL + interceptor auth)
 │     auth.jsx (AuthProvider + `useAuth`)
 │     AuthStore.test.jsx
 ├── pages/ (Home, Products, Gyms, Programs, ProgramDetail, CoachDetail, Auth…)
 ├── components/ (cards, filtres, header, etc.)
 └── App.jsx / main.jsx
```

## Commandes
```bash
npm install
npm run dev -- --host --port 5173
npm run build
npm test
```

## Intégration API
- `VITE_API_BASE_URL` + `VITE_API_PREFIX` (définis dans `.env`).
- `apiClient` ajoute automatiquement le JWT stocké dans `localStorage` (`auth_token`).
- `AuthProvider` expose `{ isAuthenticated, user, status, login, signup, logout }`. Le contexte rafraîchit `/auth/me` quand un token existe.
- Les pages consomment l'API via TanStack Query (`useQuery`).

## Pages clés
- **Products.jsx** : filtres locaux → `/products/search`. Affiche les données BDD ou SerpAPI (IDs négatifs, bouton “Voir l'offre”).
- **Gyms.jsx** : `/gyms` (pagination, recherche). Les cards utilisent `GymCard`.
- **Programs.jsx / ProgramDetail.jsx / CoachDetail.jsx** : consomment `/programs` et `/programs/coaches`. Favoris nécessitent un token (bouton désactivé sinon).
- **Login/Signup** : formulaires stylés Tailwind, connectés au contexte Auth.

## Style
- Thème blanc/orange (`bg-white`, `bg-orange-50`, `text-orange-600`).
- Boutons arrondis (`rounded-full`) + ombres légères.
- Skeletons (`animate-pulse`) pour les chargements.
- Se référer à [`docs/design.md`](../docs/design.md) pour les conventions UI.
