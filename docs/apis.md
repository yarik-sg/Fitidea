# API Fitidea

Base URL locale : `http://localhost:8000/api`. La documentation Swagger est disponible sur `http://localhost:8000/docs`.

## Authentification
- `POST /auth/signup` : JSON `{ email, password, full_name? }` → `201` + `{ access_token, token_type, user }`.
- `POST /auth/login` : formulaire `application/x-www-form-urlencoded` (`username`, `password`). Retourne le même `TokenResponse`.
- `GET /auth/me` : nécessite l'en-tête `Authorization: Bearer <token>`. Retourne `UserRead`.

## Produits / Suppléments
- `GET /products` : liste paginée, filtres `name`, `min_price`, `max_price`, `page`, `page_size`.
- `GET /products/search` : filtres `q`, `category`, `brand`, `price_min`, `price_max`, `rating_min`, `source`, `page`, `page_size`, `use_live`.
  - Si la BDD ne renvoie rien (ou si `use_live=true`), le backend bascule sur SerpAPI (Google Shopping) et renvoie des entrées « live » (IDs négatifs, bouton “Voir l'offre”).
- `GET /products/{id}` / `GET /products/{id}/offers` : détail produit + offres scrapées.
- `POST /products/scrape` et `/scrape-bulk` : ingestion de nouvelles fiches à partir d'une URL/source (utilise Redis + services d'ingest).

## Comparaison
- `POST /compare` : `{ "query": "whey" }` → déclenche une recherche SerpAPI et met en cache 5 min.
- `GET /comparison?ids=1,2,3` : retourne les produits existants en base + leurs offres pour alimenter la page de comparaison.

## Gyms
- `GET /gyms` : filtres `search`, `city`, `brand`, `page`, `page_size`. Retourne `PaginatedGymsResponse`.
- `GET /gyms/{id}` : détail complet (offres/programmes liés, photos, horaires, etc.).
- `POST /gyms/sync` ou `/scrape-all` : utilitaires internes pour importer/synchroniser les salles.

## Programmes (workouts)
- `GET /programs` : filtres `page`, `page_size`, `goal`, `level`, `duration`, `coach_id`, `search`. Retourne les `WorkoutProgramRead`.
- `GET /programs/{id}` : détail + coach.
- `GET /programs/{id}/weeks` : structure hebdomadaire.
- `GET /programs/{id}/sessions` : sessions + exercices.
- `POST /programs/{id}/favorite` / `DELETE /programs/{id}/favorite` : nécessitent un token, ajout/suppression d'un favori pour l'utilisateur connecté.
- `GET /programs/coaches` / `/programs/coaches/{coach_id}` : liste et détail des coachs.

## Santé
- `GET /health` : `{ "status": "ok", "redis": true/false }`.
