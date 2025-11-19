# Fitidea

Comparateur fitness tout-en-un : suppléments, salles de sport et programmes guidés. L'application se compose d'une API FastAPI (PostgreSQL + Redis + SerpAPI) et d'un frontend React/Vite (Tailwind, TanStack Query).

## Stack
- **Frontend** : React 18, Vite, React Router, TanStack Query, Tailwind CSS.
- **Backend** : FastAPI, SQLAlchemy, Pydantic v2, Passlib/JWT, Redis (cache), SerpAPI (Google Shopping) et PostgreSQL.
- **Infra locale** : Docker Compose avec backend, frontend, PostgreSQL, Redis et PgAdmin.

## Architecture rapide
```
Utilisateur → React/Vite (apiClient Axios) → FastAPI (/api)
                                   ├── PostgreSQL (produits, gyms, workouts)
                                   ├── Redis (cache comparaison)
                                   └── SerpAPI (recherche live suppléments)
```

## Prérequis
- Docker + Docker Compose (recommandé)
- Ou : Node.js 18+, Python 3.11+, PostgreSQL/Redis si vous lancez les services séparément.

## Lancer le projet (Docker)
```bash
docker-compose up --build
```
Services exposés :
- Frontend : http://localhost:5173
- Backend : http://localhost:8000 (Swagger sur `/docs`)
- PostgreSQL : `localhost:5432` (`postgres/postgres`)
- Redis : `localhost:6379`
- PgAdmin (profil `admin`) : http://localhost:5050

## Variables d'environnement
### Backend (`backend/.env`)
- `DATABASE_URL` : (injectée par docker-compose).
- `REDIS_URL` : `redis://redis:6379/0`.
- `SECRET_KEY` : clé JWT.
- `SERPAPI_KEY` : clé Google Shopping/SerpAPI (déjà fournie dans le dépôt).
- `DEV_SEED=true` : crée des données de démonstration (produits, gyms, programmes) au démarrage.

### Frontend (`frontend/.env`)
- `VITE_API_BASE_URL=http://localhost:8000`
- `VITE_API_PREFIX=/api`

Toutes les requêtes passent par `src/lib/apiClient.js` qui concatène `BASE_URL + PREFIX` et ajoute le token JWT depuis `localStorage`.

## Lancer sans Docker
### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Assurez-vous que PostgreSQL & Redis tournent localement (mettez à jour `backend/.env`).

### Frontend
```bash
cd frontend
npm install
npm run dev -- --host --port 5173
```

## SerpAPI & données
- `app/services/serpapi_service.py` gère les appels SerpAPI (timeout, parsing prix/devise, filtres). La route `/products/search` bascule automatiquement sur SerpAPI si la base n'a pas de résultat (ou via `use_live=true`).
- `training_seed.py` crée des coachs/programmes/séances, un utilisateur de démo et – quand `DEV_SEED=true` – quelques produits & gyms pour illustrer l'UI.

## Documentation complémentaire
- [`backend/README.md`](backend/README.md) : structure de l'API, commandes, description des services.
- [`frontend/README.md`](frontend/README.md) : organisation des pages/components et commandes npm.
- [`docs/architecture.md`](docs/architecture.md) : schéma détaillé.
- [`docs/apis.md`](docs/apis.md) : endpoints principaux et paramètres.
- [`docs/design.md`](docs/design.md) : conventions UI.
- [`docs/debug-notes.md`](docs/debug-notes.md) : problèmes identifiés durant ce prompt.
- [`docs/changes-prompt24.md`](docs/changes-prompt24.md) : résumé des modifications livrées.

## Tests
- Backend : `cd backend && pytest`
- Frontend : `cd frontend && npm test`

Bon build ✌️
