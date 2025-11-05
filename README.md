# 🏀 BenHoops - NBA Stats & Live Scores

Application web moderne pour suivre la NBA en temps réel. Statistiques, classements, calendrier et profils d'équipes avec données live via l'API TheSportsDB.

[![Next.js](https://img.shields.io/badge/Next.js-13.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ Fonctionnalités

- 🏀 **Équipes NBA** - Logos, stats, profils complets
- 📊 **Classement en direct** - Conférence Est/Ouest avec statistiques
- 📅 **Calendrier complet** - Matchs passés et à venir
- 🔍 **Recherche avancée** - Équipes, joueurs et matchs
- 🌓 **Dark Mode** - Interface adaptative avec next-themes
- ⚡ **Performance optimale** - ISR + cache mémoire pour vitesse maximale
- 📱 **Responsive Design** - Mobile-first avec Tailwind CSS
- 🎨 **UI moderne** - shadcn/ui + Radix UI components

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** 18.x ou supérieur
- **npm** ou **yarn** ou **pnpm**
- Compte GitHub (pour déploiement Vercel)

### Installation

1. **Cloner le repository**

```bash
git clone https://github.com/Obed67/benhoops.git
cd benhoops
```

2. **Installer les dépendances**

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configurer l'environnement** (optionnel)

Créer `.env.local` (la clé par défaut fonctionne):

```bash
# Clé API TheSportsDB (gratuite: '123', limite 10 req/min)
NEXT_PUBLIC_SPORTSDB_API_KEY=123

# Base URL API
NEXT_PUBLIC_SPORTSDB_BASE_URL=https://www.thesportsdb.com/api/v1/json
```

4. **Lancer le serveur de développement**

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur 🎉

### Scripts Disponibles

```bash
npm run dev        # Serveur de développement (port 3000)
npm run build      # Build production
npm run start      # Démarrer en mode production
npm run lint       # Linter le code
npm run typecheck  # Vérifier les types TypeScript
```

## 📁 Architecture du Projet

```
benhoops/
├── app/                          # Next.js 13 App Router
│   ├── layout.tsx               # Layout principal avec metadata
│   ├── page.tsx                 # 🏠 Homepage - Hero + matchs récents
│   ├── loading.tsx              # Loading state global
│   ├── error.tsx                # Error boundary global
│   ├── not-found.tsx            # Page 404 personnalisée
│   │
│   ├── teams/                   # 🏀 Section Équipes
│   │   ├── page.tsx            # Liste des équipes NBA (ISR 1h)
│   │   └── [id]/
│   │       ├── page.tsx        # Profil équipe (ISR 1h)
│   │       ├── loading.tsx     # Skeleton pour équipe
│   │       └── error.tsx       # Error boundary équipe
│   │
│   ├── schedule/                # 📅 Calendrier
│   │   └── page.tsx            # Matchs passés + à venir
│   │
│   ├── standings/               # 📊 Classement
│   │   └── page.tsx            # Est/Ouest avec stats (ISR 5min)
│   │
│   └── search/                  # 🔍 Recherche
│       └── page.tsx            # Recherche équipes/joueurs/matchs
│
├── components/                   # Composants React
│   ├── cards/
│   │   ├── match-card.tsx      # Card match avec scores
│   │   ├── team-card.tsx       # Card équipe avec logo
│   │   └── player-card.tsx     # Card joueur avec stats
│   │
│   ├── navigation/
│   │   ├── navbar.tsx          # Navigation principale
│   │   └── footer.tsx          # Footer avec liens
│   │
│   ├── search/
│   │   └── search-input.tsx    # Input recherche avec debounce
│   │
│   ├── loading/
│   │   └── page-loading.tsx    # Loading component réutilisable
│   │
│   ├── ui/                      # shadcn/ui components (40+)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── tabs.tsx
│   │   └── ...                 # Accordion, Alert, Dialog, etc.
│   │
│   ├── theme-provider.tsx       # Provider dark mode
│   └── theme-toggle.tsx         # Toggle dark/light
│
├── lib/                          # Logique métier
│   ├── api/
│   │   ├── sportsdb.ts         # Client API TheSportsDB + cache
│   │   └── transformers.ts     # Normalisation données API
│   │
│   ├── types/
│   │   └── index.ts            # Types TypeScript (Team, Player, Match)
│   │
│   ├── config/
│   │   └── api.ts              # Config API + constantes
│   │
│   └── utils.ts                 # Helpers (cn, formatters)
│
├── data/                         # Données statiques
│   ├── teams.ts                 # Fallback teams si API fail
│   ├── matches.ts               # Fallback matches
│   └── standings.ts             # Fallback classement
│
├── hooks/
│   └── use-toast.ts             # Hook toast notifications
│
├── public/                       # Assets statiques
│   ├── grid.svg                 # Background pattern
│   └── logos/                   # Logos locaux (vide)
│
├── .env.local                    # Variables d'environnement (gitignore)
├── next.config.js               # Config Next.js
├── tailwind.config.ts           # Config Tailwind + thème NBA
├── tsconfig.json                # Config TypeScript strict
├── components.json              # Config shadcn/ui
└── package.json                 # Dépendances
```

### Flux de Données

### Stratégie de Rendu (ISR + SSR)

| Page          | Stratégie | Revalidation | Description                            |
| ------------- | --------- | ------------ | -------------------------------------- |
| `/`           | ISR       | 5 min        | Homepage avec matchs récents           |
| `/teams`      | ISR       | 1 heure      | Liste des équipes NBA                  |
| `/teams/[id]` | ISR       | 1 heure      | Profil équipe (3 équipes pré-générées) |
| `/schedule`   | ISR       | 1 heure      | Calendrier des matchs                  |
| `/standings`  | ISR       | 5 min        | Classement mis à jour fréquemment      |
| `/search`     | Dynamic   | No cache     | Recherche en temps réel                |

**ISR (Incremental Static Regeneration)** :

- Pages statiques générées au build
- Revalidation automatique après expiration
- Fallback : `false` (404 si non généré)
- Cache mémoire pour éviter doublons API pendant build

**Cache Mémoire** :

```typescript
// lib/api/sportsdb.ts
const apiCache = new Map<string, any>();

// Évite les appels répétés pendant build
// Exemple: getNBATeams() appelé 3x → 1 seul appel API réel
```

**Rate Limiting** :

- 500ms de délai entre chaque requête API
- Retry automatique (max 2 tentatives) sur erreur 429
- Logs détaillés : `📦 [CACHE HIT]` / `💾 [CACHE SET]`

## 🛠️ Stack Technique

### Core

| Technologie      | Version | Description                       |
| ---------------- | ------- | --------------------------------- |
| **Next.js**      | 13.5.1  | Framework React avec App Router   |
| **React**        | 18.2.0  | Library UI avec Server Components |
| **TypeScript**   | 5.2.2   | Typage statique strict            |
| **Tailwind CSS** | 3.3.3   | Utility-first CSS framework       |

### UI & Styling

| Package                      | Version | Description                           |
| ---------------------------- | ------- | ------------------------------------- |
| **shadcn/ui**                | Latest  | 40+ composants Radix UI préconfigurés |
| **Radix UI**                 | Latest  | Primitives UI accessibles             |
| **Lucide React**             | 0.446   | 446 icônes SVG optimisées             |
| **next-themes**              | 0.3.0   | Dark mode avec `class` strategy       |
| **tailwindcss-animate**      | 1.0.7   | Animations Tailwind prédéfinies       |
| **class-variance-authority** | 0.7.0   | Variants de composants typés          |

### Forms & Validation

| Package                 | Version | Description                            |
| ----------------------- | ------- | -------------------------------------- |
| **React Hook Form**     | 7.53    | Gestion formulaires performante        |
| **Zod**                 | 3.23    | Validation de schémas TypeScript-first |
| **@hookform/resolvers** | 3.9     | Intégration Zod + React Hook Form      |

### Utilities

| Package            | Version | Description                           |
| ------------------ | ------- | ------------------------------------- |
| **date-fns**       | 3.6     | Manipulation de dates                 |
| **clsx**           | 2.1     | Conditional classNames                |
| **tailwind-merge** | 2.5     | Merge Tailwind classes intelligemment |

### Charts & Visualization

| Package            | Version | Description                   |
| ------------------ | ------- | ----------------------------- |
| **Recharts**       | 2.12    | Graphiques React pour stats   |
| **Embla Carousel** | 8.3     | Carrousel pour images équipes |

## 🎨 Design System

### Couleurs NBA

```typescript
// tailwind.config.ts
colors: {
  primary: '#F26522',      // Orange NBA officiel
  accent: '#FF6B00',       // Orange vif
  chart: {
    1: '#F26522',          // Orange NBA
    2: '#DC2626',          // Rouge NBA
    3: '#197E3E',          // Vert accent
  }
}
```

### Polices

- **Inter** : Police principale (sans-serif)
- **Bebas Neue** : Titres display (NBA style)

### Thème

- **Light Mode** : Fond blanc, texte noir
- **Dark Mode** : Fond `#0A0A0A`, texte blanc
- Transition automatique via `next-themes`

## 🔧 Configuration Avancée

### Variables d'Environnement

`.env.local` (optionnel):

````bash

#### Flux de Données

```mermaid
graph TD
    A[TheSportsDB API] -->|HTTP Request| B[lib/api/sportsdb.ts]
    B -->|Memory Cache Check| C{Cache Hit?}
    C -->|Yes| D[Return Cached Data]
    C -->|No| E[Fetch from API + 500ms delay]
    E -->|Normalize| F[transformers.ts]
    F -->|Cache Result| G[Memory Cache]
    F -->|Return| H[Server Components]
    D -->|Return| H
    H -->|Props| I[Client Components]
    I -->|Render| J[Browser]
````

### Stratégie de Rendu (ISR + SSR)

`.env.local` (optionnel):

```bash
# API TheSportsDB (clé gratuite par défaut: '3')
NEXT_PUBLIC_SPORTSDB_API_KEY=3

# Base URL API
NEXT_PUBLIC_SPORTSDB_BASE_URL=https://www.thesportsdb.com/api/v1/json

# Pour upgrade Patreon (optionnel)
# NEXT_PUBLIC_SPORTSDB_API_KEY=votre_cle_patreon
```

### TypeScript Configuration

`tsconfig.json` - **Strict Mode** activé:

```json
{
  "compilerOptions": {
    "strict": true, // Type safety maximal
    "noEmit": true, // Pas de fichiers JS générés
    "esModuleInterop": true, // Import ES modules
    "moduleResolution": "bundler", // Résolution Next.js 13+
    "paths": {
      "@/*": ["./*"] // Imports absolus
    }
  }
}
```

### Tailwind Configuration

`tailwind.config.ts` - Thème NBA:

```typescript
export default {
  darkMode: ['class'], // Dark mode avec class
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['var(--font-bebas)'],
      },
      colors: {
        primary: 'hsl(16 90% 55%)', // Orange NBA
      },
      keyframes: {
        'fade-in': {
          /* ... */
        },
        'slide-up': {
          /* ... */
        },
      },
    },
  },
};
```

## 📊 API TheSportsDB

### Endpoints Utilisés

| Endpoint                 | Description             | Params               | Utilisé Pour           |
| ------------------------ | ----------------------- | -------------------- | ---------------------- |
| `search_all_teams.php`   | Liste équipes par ligue | `l=NBA`              | Page `/teams`          |
| `lookupteam.php`         | Détails d'une équipe    | `id={teamId}`        | Page `/teams/[id]`     |
| `lookup_all_players.php` | Joueurs d'une équipe    | `id={teamId}`        | Profil équipe + Search |
| `eventsnext.php`         | Prochains matchs (5)    | `id={teamId}`        | Page `/schedule`       |
| `eventslast.php`         | Derniers matchs (5)     | `id={teamId}`        | Homepage + Schedule    |
| `eventspastleague.php`   | Matchs passés ligue     | `id=4387` (NBA)      | Calendrier             |
| `lookuptable.php`        | Classement ligue        | `l=4387&s=2024-2025` | Page `/standings`      |

### Limitations API Gratuite

⚠️ **Rate Limit** : 10 requêtes/minute (clé `'3'`)

**Solutions implémentées** :

- ✅ Cache mémoire pendant build (évite doublons)
- ✅ ISR avec revalidation longue (1h pour teams)
- ✅ Délai 500ms entre requêtes
- ✅ Retry automatique sur erreur 429
- ✅ Fallback vers données statiques si fail

**Upgrade Patreon** : Pour clé illimitée ($2/mois) → [thesportsdb.com/patreon](https://www.thesportsdb.com/patreon)

### Normalisation des Données

```typescript
// lib/api/transformers.ts

// TheSportsDB → Types internes
SportsDBTeam → Team {
  id, name, logo, stadium, description,
  primaryColor, secondaryColor, fanart, ...
}

SportsDBPlayer → Player {
  id, name, position, number, nationality,
  birthdate, height, weight, photo, ...
}

SportsDBEvent → Match {
  id, homeTeam, awayTeam, homeScore, awayScore,
  date, status, venue, thumbnail, ...
}
```

## 🚢 Déploiement

### Vercel (Recommandé)

1. **Push vers GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Importer sur Vercel**

- Aller sur [vercel.com](https://vercel.com)
- Cliquer "Import Project"
- Sélectionner le repo GitHub
- Vercel détecte automatiquement Next.js ✅

3. **Variables d'environnement** (optionnel)

- Settings → Environment Variables
- Ajouter `NEXT_PUBLIC_SPORTSDB_API_KEY` si clé Patreon

4. **Deploy** 🚀

- Vercel build et déploie automatiquement
- URL : `https://benhoops.vercel.app`

### Build Local

```bash
# Build pour production
npm run build

# Tester le build localement
npm run start

# Build output dans .next/
```

**Optimisations Build** :

- ✅ Images optimisées (WebP)
- ✅ Code splitting automatique
- ✅ Tree shaking
- ✅ Minification CSS/JS
- ✅ Cache statique agressif

## 🧪 Développement

### Structure des Composants

**Server Components** (par défaut):

```typescript
// app/teams/page.tsx
export default async function TeamsPage() {
  const teams = await getNBATeams(); // Fetch côté serveur
  return <div>{/* ... */}</div>;
}
```

**Client Components** (interactivité):

```typescript
// components/search/search-input.tsx
'use client';

export function SearchInput() {
  const [query, setQuery] = useState('');
  // ... debounce, router.push, etc.
}
```

### Ajouter un Composant shadcn/ui

```bash
npx shadcn-ui@latest add dialog
# Ajoute components/ui/dialog.tsx

# Utilisation
import { Dialog } from '@/components/ui/dialog';
```

### Créer une Nouvelle Page

1. **Créer le fichier**

```typescript
// app/players/page.tsx
export default async function PlayersPage() {
  return <div>Liste des joueurs</div>;
}
```

2. **Ajouter au menu**

```typescript
// components/navigation/navbar.tsx
const navLinks = [
  // ...
  { href: '/players', label: 'Joueurs' },
];
```

### Debugging

**Logs serveur** :

```typescript
// lib/api/sportsdb.ts
console.log('📦 [CACHE HIT]:', endpoint);
console.log('💾 [CACHE SET]:', endpoint);
console.log('❌ [ERROR]:', error);
```

**Outils** :

- Next.js devtools (automatique en dev)
- React DevTools (extension Chrome)
- TypeScript errors dans VS Code

## 🎯 Roadmap

### Fonctionnalités Actuelles ✅

- [x] Liste des équipes NBA disponibles
- [x] Profils équipes avec logo, stats, stade
- [x] Calendrier matchs (passés + à venir)
- [x] Classement Conférence Est/Ouest
- [x] Recherche équipes, joueurs, matchs
- [x] Dark mode
- [x] Loading states + error boundaries
- [x] ISR + cache mémoire optimisé
- [x] Responsive design mobile-first
- [x] SEO metadata complet

### À Venir 🔜

- [ ] Stats joueurs individuelles
- [ ] Comparaison équipes (head-to-head)
- [ ] Favoris localStorage
- [ ] Notifications matchs live (PWA)
- [ ] Graphiques stats avancées
- [ ] Filtres avancés (conférence, division)
- [ ] Internationalisation (EN/FR)
- [ ] Tests unitaires (Jest + React Testing Library)
- [ ] Tests E2E (Playwright)

## 🤝 Contribution

### Guidelines

1. **Fork** le repo
2. **Créer une branche** : `git checkout -b feature/ma-feature`
3. **Commit** : `git commit -m "feat: ajout de ma feature"`
4. **Push** : `git push origin feature/ma-feature`
5. **Pull Request** sur `main`

### Conventions de Code

- **TypeScript strict** : Pas de `any`
- **Composants** : PascalCase (`TeamCard.tsx`)
- **Fonctions** : camelCase (`getNBATeams()`)
- **Constantes** : UPPER_SNAKE_CASE (`REVALIDATE_TIME`)
- **Commits** : [Conventional Commits](https://www.conventionalcommits.org/)
  - `feat:` nouvelle fonctionnalité
  - `fix:` correction de bug
  - `docs:` documentation
  - `style:` formatage
  - `refactor:` refactoring code

### Structure à Respecter

```
app/           → Pages Next.js (Server Components)
components/    → Composants réutilisables
lib/           → Logique métier + API
data/          → Données statiques
```

## 📝 Troubleshooting

### Erreur 429 (Too Many Requests)

**Symptôme** : Build échoue avec erreur API

**Solution** :

```typescript
// lib/api/sportsdb.ts
// ✅ Déjà implémenté :
// - Cache mémoire (évite doublons)
// - Délai 500ms entre requêtes
// - Retry automatique (max 2)
```

### Build Lent

**Solution** : Réduire le nombre de pages pré-générées

```typescript
// app/teams/[id]/page.tsx
export async function generateStaticParams() {
  return [
    { id: '134870' }, // Lakers
    { id: '134871' }, // Warriors
    { id: '134872' }, // Celtics
  ]; // Seulement 3 au lieu de 30
}
```

### Images Cassées

**Symptôme** : Logos équipes ne s'affichent pas

**Solution** : Vérifier `next.config.js`

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'www.thesportsdb.com',
    },
  ],
}
```

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [TheSportsDB API](https://www.thesportsdb.com/api.php)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

MIT License - Voir [LICENSE](LICENSE)

---

**Fait avec 🏀 par [Obed67](https://github.com/Obed67)**
