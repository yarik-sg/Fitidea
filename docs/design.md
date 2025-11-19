# Design system Fitidea

- **Palette** : blanc cassé, gris doux, dégradés orange (#f97316 → #fb923c) pour les accents, touches de rouge pour les erreurs.
- **Typographie** : système basé sur la stack Tailwind par défaut (`font-sans`). Les titres utilisent des `tracking-[0.2em]` pour un style "tech".
- **Composants réutilisables** :
  - `ProgramCard`, `GymCard`, `CoachCard` : cartes arrondies (radius 2xl), ombres douces (`shadow-orange-50`).
  - `ProgramFilters`, `Filters` (Produits) : grilles responsive, champs arrondis (`rounded-xl`) avec `border-orange-100`.
  - `SkeletonGrid` : placeholders animés pour attendre les données.
  - `Header` : sticky, fond translucide (`bg-white/80`), ombre quand on scrolle.
- **Thème clair/sombre** : seul le thème clair est stylé mais le CSS reste compatible (classes `bg-white/80`, `text-gray-900`).
- **Boutons** : arrondis (`rounded-full` pour actions primaires), accent orange pour les CTA, `hover:-translate-y-0.5` pour un léger relief.
- **Messages d'état** :
  - Succès neutre → badges orange.
  - Erreur → fonds `bg-red-50`, bordures `border-red-100`.
  - Loading → `animate-pulse` + dégradés orange.
- **Icônes** : emoji (📋, 🏋️) pour renforcer l'univers "coach" et rester léger.

Respecter ces conventions lors de l'ajout de nouveaux écrans (mêmes rayons, couleurs et animations).
