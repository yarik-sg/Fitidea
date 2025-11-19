# Backend Fitidea (FastAPI)

## Structure
```
app/
 ├── main.py (FastAPI + CORS + startup seeds)
 ├── core/config.py (pydantic Settings, env vars, API prefix)
 ├── db/ (session + base)
 ├── auth/ (OAuth2, utils JWT)
 ├── models/ & schemas/ (products, gyms, workout programs, users...)
 ├── routes/
 │     auth_routes.py, product_routes.py, gym_routes.py, training_routes.py, compare_routes.py, favorite_routes.py
 └── services/
       serpapi_service.py, product_ingest_service.py, training_seed.py, cache_service.py
```

## Démarrage local
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Variables d'env : voir `core/config.py` (`DATABASE_URL`, `REDIS_URL`, `SECRET_KEY`, `SERPAPI_KEY`, `DEV_SEED`).

## SerpAPI
- Configurée via `SERPAPI_KEY` (`backend/.env`).
- `app/services/serpapi_service.py` expose `search_supplements(query, category, brand, price_min, price_max, source, page, page_size)`.
- `product_routes.search_products` bascule sur SerpAPI quand `use_live=true` ou quand la base ne contient rien pour la requête.
- `compare_routes` continue d'utiliser `search_product` pour les comparaisons rapides (résultat mis en cache dans Redis).

## Seeds & données
- `training_seed.seed_training_data()` est appelé au startup (`app/main.py`).
  - Crée des coachs + programmes + semaines + sessions.
  - Ajoute un utilisateur de démo (email `admin@example.com` / pass `password`).
  - Active, si `DEV_SEED=true`, des produits et gyms de démonstration.

## Endpoints principaux
- `GET /api/health` : statut + connectivité Redis.
- `POST /api/auth/signup` / `POST /api/auth/login` / `GET /api/auth/me`.
- `GET /api/products` & `GET /api/products/search` (filtres, fallback SerpAPI). `POST /api/products/scrape` pour importer une fiche.
- `POST /api/compare` + `GET /api/comparison`.
- `GET /api/gyms`, `GET /api/gyms/{id}`.
- `GET /api/programs`, `GET /api/programs/{id}`, `/weeks`, `/sessions`, `/coaches`.
- `POST /api/programs/{id}/favorite` / `DELETE /api/programs/{id}/favorite` (JWT obligatoire via `Authorization: Bearer`).

## Tests
```bash
pytest
```
Les tests utilisent la configuration SQLite (défaut) si `DATABASE_URL` n'est pas défini.
