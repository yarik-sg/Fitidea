# Architecture Fitidea

```
Utilisateur → Frontend (React/Vite + TanStack Query)
          ↘ appels REST via Axios (`apiClient`)
             Backend FastAPI (`/api` prefix)
               ├── PostgreSQL (SQLAlchemy + Alembic)
               ├── Redis (cache SerpAPI/comparaison)
               ├── SerpAPI (produits live)
               └── Services de seeds (programmes, gyms, produits)
```

- **Frontend** : composants UI (pages, cards, filtres) + context `AuthProvider`. Toutes les requêtes passent par `src/lib/apiClient.js` qui ajoute `Authorization: Bearer <token>` quand un utilisateur est connecté.
- **Backend** : `app/main.py` ajoute CORS large, instancie Redis et démarre le seed des données d'entraînement. Les routes sont regroupées dans `app/routes/*` avec un préfixe `/api` défini par `Settings`.
- **Base de données** : SQLAlchemy (PostgreSQL dans Docker). Les relations principales : `products/offers/favorites`, `gyms/programs`, `workout_programs` et `coaches`.
- **Cache** : Redis est utilisé pour conserver les comparaisons SerpAPI (évite de reconsommer l'API pour des requêtes identiques).
- **SerpAPI** : le service `app/services/serpapi_service.py` centralise la configuration et expose `search_supplements(...)`. Il est invoqué côté backend uniquement (produits live, comparaison, fallback quand la base n'a pas de données).

## Flux majeurs

1. **Auth** : formulaire React → `AuthProvider` → `apiClient.post('/auth/login')` (form-urlencoded) → FastAPI Auth → génération JWT (passlib + jose). Le token est stocké en localStorage et réutilisé pour `/auth/me`, `/favorites`, `/programs/{id}/favorite`.
2. **Suppléments** : `Products.jsx` envoie les filtres au backend. FastAPI interroge la BDD (`Product`), puis bascule sur SerpAPI si aucune donnée ou si `use_live=true`. Les résultats sont renvoyés sous forme paginée pour correspondre à `ProductRead`.
3. **Gyms** : `Gyms.jsx` consomme `/gyms` (filtres `search/city/brand`). Les seeds créent quelques salles de test via `training_seed.py` quand `DEV_SEED=true`.
4. **Programmes** : `Programs.jsx`, `ProgramDetail.jsx`, `CoachDetail.jsx` consomment `training_routes`. Les seeds créent des coachs, programmes, semaines et sessions. Les favoris utilisent maintenant `get_current_user` (token obligatoire).

## Déploiement local

- `docker-compose up --build` démarre : backend (FastAPI), frontend (Vite dev), PostgreSQL, Redis, PgAdmin.
- Ports : frontend 5173, backend 8000, Postgres 5432, Redis 6379, PgAdmin 5050.
