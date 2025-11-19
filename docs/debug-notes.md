# Notes de débogage (prompt 24)

## Problèmes identifiés
- **Front ↔ Backend décalés** : le frontend appelait `/auth/login` et `/auth/signup` avec des payloads JSON (`username`, `confirmPassword`). FastAPI attendait un formulaire OAuth2 (`username/password`) et un schéma `UserCreate` sans champ `confirmPassword`, ce qui provoquait des 422.
- **Base URL multiple** : certaines pages (Programmes, Coach) utilisaient `VITE_API_URL` alors que le client HTTP global s'appuie sur `VITE_API_BASE_URL` + `/api`. Résultat : les requêtes contournaient Axios (pas d'en-têtes auth) et pointaient sur de mauvaises URLs.
- **Données manquantes** : pas de seeds activés par défaut → les pages Produits/Gyms retournaient des listes vides et restaient en skeleton. Aucun fallback SerpAPI n'était branché tant que la BDD répondait vide.
- **Favoris Programmes** : les endpoints `/programs/{id}/favorite` recevaient `user_id` en query. Le frontend n'envoyait jamais ce paramètre (il mettait `user_id=1` en dur). Les routes ne validaient pas l'authentification.
- **Programmes/coachs** : le frontend utilisait `fetch` + `VITE_API_URL` => aucune gestion d'erreur ni d'état de chargement cohérent avec les autres pages.
- **SerpAPI** : intégration limitée à `search_product` (sans filtres, sans pagination). Pas de parsing du prix et pas de `created_at`, ce qui cassait le schéma `ProductRead` lorsque l'API ne renvoyait rien.
- **Auth tokens** : `app/auth/utils.py` n'importait ni `datetime` ni `timedelta`. La création de compte (et la connexion) plantait avec un `NameError` lors de l'appel à `create_access_token`.

## Fichiers impactés par les correctifs
- Backend : `app/services/serpapi_service.py`, `routes/product_routes.py`, `routes/auth_routes.py`, `routes/gym_routes.py`, `routes/training_routes.py`, `services/training_seed.py`, `.env`.
- Frontend : `src/lib/auth.jsx`, `src/lib/AuthStore.test.jsx`, `src/pages/Login.jsx`, `src/pages/Signup.jsx`, `src/App.jsx`, `src/pages/Programs.jsx`, `src/pages/ProgramDetail.jsx`, `src/pages/CoachDetail.jsx`, `src/pages/Products.jsx`, `.env`.
- Documentation : README principaux + nouveaux fichiers dans `docs/`.

Ces notes servent de référence rapide pour comprendre pourquoi chaque changement a été effectué dans ce prompt.
