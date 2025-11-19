# Changements livrés (prompt 24)

1. **SerpAPI + backend**
   - Nouveau client `search_supplements` avec filtres, parsing prix/devise, pagination et logs.
   - Route `/products/search` capable de basculer en live (`use_live=true`) et de retourner des objets compatibles `ProductRead`.
   - Seeds améliorés (`training_seed.py`) : coaches/programmes structurés, produits démo supplémentaires, gyms démo lorsque `DEV_SEED=true`.
   - Endpoints `programs/{id}/favorite` sécurisés via JWT, logs supplémentaires sur auth/produits/gyms/programmes.
   - Correctif supplémentaire : import explicite de `datetime`/`timedelta` dans `app/auth/utils.py` pour empêcher le `NameError` lors de la génération des tokens.

2. **Frontend**
   - Auth provider : gestion du token (`localStorage`), auto-refresh via `/auth/me`, payloads conformes (login form-urlencoded, signup sans `confirmPassword`).
   - Pages Programmes / Coach / ProgramDetail migrées sur `apiClient` + React Query (états de chargement, erreurs, pagination).
   - Page Produits : filtres normalisés, affichage des résultats SerpAPI (désactivation des comparaisons pour les ID live, lien vers l'offre), message "aucun résultat".
   - UI Auth : champs cohérents (full name), route `/signup` connectée.

3. **Documentation**
   - README racine + nouveaux README frontend/backend (lancement, variables d'env, intégration SerpAPI, seeds, structure).
   - Dossier `docs/` : architecture, API, design, debug-notes, récapitulatif des changements.

4. **Environnements**
   - `backend/.env` active `DEV_SEED=true` et réutilise la clé SerpAPI fournie.
   - `frontend/.env` explicite `VITE_API_PREFIX=/api` pour aligner l'axios client.
