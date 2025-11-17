# Fitidea

Plateforme de comparaison et de recommandation fitness articulée autour d'une API FastAPI et d'un frontend React. Elle combine des données produits (via SerpAPI), des salles de sport, des programmes et un système de favoris.

## Stack technique
- **Backend** : FastAPI, SQLAlchemy, Pydantic, Redis (cache), PostgreSQL (via Docker), authentification JWT, tests Pytest.
- **Frontend** : React 18 + React Router, TanStack Query pour la data-fetching, Vite, Testing Library/Vitest.
- **Infra locale** : Docker Compose (services backend, frontend, PostgreSQL, Redis, PgAdmin), hot-reload via volumes montés.

## Installation backend
1. Créer un environnement Python 3.11+ et installer les dépendances :
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. Lancer l'API en local :
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
3. Les routes sont exposées sous le préfixe `/api` (voir **API Reference**). Le point de santé est disponible sur `/health`.

## Installation frontend
1. Installer les dépendances Node :
   ```bash
   cd frontend
   npm install
   ```
2. Démarrer le serveur de dev Vite :
   ```bash
   npm run dev -- --host --port 5173
   ```

## Configuration environnement
Copier `.env.example` vers `.env` à la racine et renseigner les variables :
- `DB_URL` / `DATABASE_URL` : URL de connexion SQLAlchemy/psycopg2 (ex. `postgresql://postgres:postgres@localhost:5432/postgres`).
- `REDIS_URL` : URL Redis (ex. `redis://localhost:6379/0`).
- `SECRET_KEY` : clé secrète pour signer les tokens JWT.
- `SERPAPI_KEY` : clé API SerpAPI pour la recherche produits.

Le backend charge automatiquement `.env` via `pydantic.BaseSettings`.

## Utilisation avec Docker
1. Construire et lancer tous les services (backend, frontend, PostgreSQL, Redis) :
   ```bash
   docker-compose up --build
   ```
2. Interfaces principales :
   - Backend : http://localhost:8000 (documentation auto FastAPI sur `/docs`).
   - Frontend : http://localhost:5173
   - PgAdmin (profil `admin`) : http://localhost:5050
3. Les volumes `postgres_data`, `redis_data` et `pgadmin_data` préservent les données. Les services Redis/PostgreSQL ont des healthchecks et le backend attend leur disponibilité.

## Scripts
- `frontend` :
  - `npm run dev` : serveur de dev Vite.
  - `npm test` : suite de tests Vitest/Testing Library.
- `backend` :
  - `pytest` : exécute les tests API.
  - `uvicorn app.main:app --reload` : démarre l'API en local.

## Structure d’arborescence
```
backend/
  app/
    main.py
    core/config.py
    db/session.py
    auth/
      auth.py
      utils.py
    models/
      user.py, product.py, offer.py, favorite.py, program.py, exercise.py, gym.py
    schemas/
      user.py, product.py, offer.py, favorite.py, program.py, exercise.py, gym.py
    routes/
      auth_routes.py, product_routes.py, favorite_routes.py,
      compare_routes.py, gym_routes.py, program_routes.py
    services/
      serpapi_service.py, cache_service.py
  tests/
    conftest.py, test_auth.py, test_products.py, test_compare.py, test_favorites.py
frontend/
  src/
    App.jsx, main.jsx, index.css,
    components/, pages/, lib/
  package.json, vitest.config.js, tailwind.config.js, index.html
```

## API Reference (principales routes)
- `GET /health` : statut de l’application et disponibilité Redis.
- Auth (`/api/auth`)
  - `POST /signup` : inscription, renvoie un token d’accès et le profil utilisateur.
  - `POST /login` : authentification, renvoie un token d’accès et le profil utilisateur.
  - `GET /me` : profil de l’utilisateur connecté.
- Produits (`/api/products`)
  - `GET /` : liste paginée avec filtres `name`, `min_price`, `max_price`, `page`, `page_size`.
  - `GET /{product_id}` : détail produit + offres associées.
  - `GET /{product_id}/offers` : offres d’un produit.
- Favoris (`/api/favorites`) — nécessite un token
  - `POST /{product_id}` : ajoute (ou retourne) le favori pour l’utilisateur courant en choisissant la meilleure offre.
  - `DELETE /{product_id}` : supprime un favori.
  - `GET /` : liste des favoris de l’utilisateur courant.
- Comparaison
  - `POST /api/compare` : lance une recherche SerpAPI pour une requête, avec cache Redis.
  - `GET /api/comparison?ids=1,2` : renvoie les produits/offres pour les IDs fournis.
- Gyms (`/api/gyms`)
  - `GET /` : liste paginée avec recherche textuelle.
  - `GET /{gym_id}` : détail + relations (offres, programmes).
- Programmes (`/api/programs`)
  - `GET /` : liste paginée avec filtres `name`, `user_id`, `gym_id`.
  - `GET /{program_id}` : détail programme + exercices associés.

## TODO / Roadmap
- Compléter les modèles et migrations pour PostgreSQL (les placeholders actuels utilisent SQLite par défaut).
- Ajouter la gestion complète du cycle de vie JWT (refresh tokens, expiration configurable).
- Couvrir les routes restantes (création/mise à jour/suppression) pour produits, offres, programmes, salles.
- Intégrer la configuration Tailwind/Design System et pages manquantes côté frontend.
- Mettre en place CI (lint, tests backend/frontend) et déploiement containerisé.
