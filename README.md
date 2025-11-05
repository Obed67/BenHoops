# 🏀 BenHoops - NBA Stats & Live Scores

Application web moderne pour suivre la NBA en temps réel. Statistiques, classements, calendrier et profils d'équipes avec données live via l'API TheSportsDB.

[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Documentation Technique

**[Voir le Brief Technique Complet](./TECHNICAL_BRIEF.md)**

_Document détaillant les défis rencontrés, optimisations implémentées et points d'amélioration futurs (2 pages)._

---

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

3. **Configurer l'environnement**

Créer `.env`:

```bash
# Clé API TheSportsDB (gratuite: '3', limite 10 req/min)
NEXT_PUBLIC_SPORTSDB_API_KEY=3

# Base URL API
NEXT_PUBLIC_SPORTSDB_BASE_URL=https://www.thesportsdb.com/api/v1/json

# URL de l'application (production)
NEXT_PUBLIC_BASE_URL=https://benhoops.vercel.app
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

## ✨ Fonctionnalités

### 📋 Fonctionnalités Attendues

#### ✅ Résultats récents

- Affichage des derniers matchs NBA sur la homepage
- Scores finaux et statut des matchs
- Actualisation automatique avec ISR (5 minutes)

#### ✅ Gestion des équipes

- **Liste complète** - 30 équipes NBA avec pagination (12/page)
- **Détail équipe** - Logo, stade, description, couleurs officielles
- **Roster complet** - 780+ joueurs avec positions, photos, stats

#### ✅ Calendrier et résultats des matchs

- Matchs passés, à venir et en cours
- Pagination intelligente (9-12 matchs/page)
- Filtrage par statut (Live, À venir, Terminés)
- Détails complets de chaque match

#### ✅ Classements de la ligue

- Conférence Est et Ouest
- Statistiques détaillées (V-D, %, Streak)
- Mise à jour fréquente (ISR 5 minutes)

#### ✅ Recherche globale

- Recherche multi-critères (équipes, joueurs, matchs)
- Résultats paginés (12/page)
- Debounce pour performance optimale

#### ✅ Navigation responsive

- Design mobile-first
- Menu adaptatif
- Footer complet avec toutes les sections
- Navigation fluide entre les pages

#### ✅ Mode sombre/clair

- Toggle dark/light avec next-themes
- Transition fluide
- Préférence sauvegardée
- Couleurs NBA optimisées pour les deux modes

#### ✅ Optimisation SEO

- Metadata complète sur toutes les pages
- Open Graph pour réseaux sociaux
- Structure sémantique HTML
- URLs optimisées

#### ✅ Animations fluides

- Transitions Tailwind CSS
- Loading states élégants avec skeletons
- Animations sur interactions (hover, click)
- Scroll smooth automatique

---

### 🎁 Bonus Créatifs

#### ✅ Statistiques avancées avec data visualization

- **Graphiques interactifs** - Recharts pour visualisation moderne
- **Vue d'ensemble ligue** - Stats globales NBA (moyennes, totaux)
- **Comparaison équipes** - Graphiques radar head-to-head
- **Top performers** - Classement par victoires, points, efficacité
- **Charts dynamiques** - Bar charts, line charts, radar charts

#### ✅ Mode spectateur live (simulation temps réel)

- **Auto-refresh** - Actualisation automatique toutes les 30 secondes
- **Pause/Resume** - Contrôle manuel du refresh
- **Matchs en cours** - Section dédiée aux matchs live
- **Updates temps réel** - Scores qui se mettent à jour automatiquement
- **Statut visuel** - Indicateurs visuels pour matchs en direct

#### ✅ Système de notifications push

- **PWA complet** - Application installable (mobile + desktop)
- **Push notifications** - Alertes pour matchs importants
- **Gestion permissions** - Interface pour activer/désactiver
- **Page settings** - Configuration complète des notifications
- **Service Worker v1.1.0** - Cache intelligent + offline mode
- **Auto-update** - Notification des nouvelles versions

#### ✅ Export de données

- **Calendrier** - Export au format iCalendar (.ics)
- **Stats** - Export CSV, JSON pour analyse externe
- **Rapports PDF** - Génération de PDF pour calendrier et stats
- **Boutons dédiés** - Interface simple sur /schedule et /stats
- **Données complètes** - Export de toutes les informations disponibles

## 📁 Architecture du Projet

```
benhoops/
├── app/                         # Next.js 14 App Router
│   ├── layout.tsx               # Layout principal avec metadata
│   ├── page.tsx                 # 🏠 Homepage - Hero + matchs récents + 780 joueurs
│   ├── loading.tsx              # Loading state global
│   ├── error.tsx                # Error boundary global
│   ├── not-found.tsx            # Page 404 personnalisée
│   │
│   ├── teams/                   # 🏀 Section Équipes
│   │   ├── page.tsx             # Liste des 30 équipes NBA (ISR 1h, pagination 12/page)
│   │   └── [id]/
│   │       ├── page.tsx        # Profil équipe (ISR 1h)
│   │       ├── loading.tsx     # Skeleton pour équipe
│   │       └── error.tsx       # Error boundary équipe
│   │
│   ├── schedule/                # 📅 Calendrier
│   │   └── page.tsx             # Matchs (pagination 9-12/page, export ICS + PDF)
│   │
│   ├── standings/               # 📊 Classement
│   │   └── page.tsx             # Est/Ouest avec stats (ISR 5min)
│   │
│   ├── stats/                   # 📈 Statistiques Avancées
│   │   └── page.tsx             # Graphiques Recharts + export CSV/JSON/PDF
│   │
│   ├── live/                    # � Mode Live (NOUVEAU)
│   │   └── page.tsx             # Auto-refresh 30s + pause/resume
│   │
│   ├── settings/                # ⚙️ Paramètres PWA (NOUVEAU)
│   │   └── page.tsx             # Gestion notifications push
│   │
│   ├── search/                  # 🔍 Recherche
│   │   └── page.tsx             # Équipes/joueurs/matchs (pagination 12/page)
│   │
│   └── matches/
│   │   └── [id]/               # 🏆 Détail Match
│   │       ├── page.tsx        # Détails d'un match spécifique
│   │       ├── loading.tsx     # Skeleton pour match
│   │       └── error.tsx       # Error boundary match
│
├── components/                   # Composants React
│   ├── cards/
│   │   ├── match-card.tsx        # Card match avec scores
│   │   ├── team-card.tsx         # Card équipe avec logo
│   │   └── player-card.tsx       # Card joueur avec stats
│   │   └── skeleton-cards.tsx    # Skeleton
│   │
│   ├── navigation/
│   │   ├── navbar.tsx          # Navigation principale
│   │   └── footer.tsx          # Footer avec liens (toutes les pages)
│   │
│   ├── stats/                   # 📈 Composants Stats (NOUVEAU)
│   │   ├── league-overview.tsx  # Vue d'ensemble ligue avec graphiques
│   │   ├── team-comparison.tsx  # Comparaison équipes (radar charts)
│   │   └── top-performers.tsx   # Top équipes par victoires/points
│   │
│   ├── live/                    # 🔴 Composants Live (NOUVEAU)
│   │   └── live-match-card.tsx  # Card match avec refresh auto
│   │
│   ├── export/                          # 📤 Export Données (NOUVEAU)
│   │   ├── schedule-export-buttons.tsx  # Export ICS + PDF calendrier
│   │   └── stats-export-buttons.tsx     # Export CSV/JSON/PDF stats
│   │
│   ├── teams/                   # Composants équipes
│   │   └── teams-grid.tsx       # Grille avec pagination (12/page)
│   │
│   ├── schedule/                # Composants calendrier
│   │   └── matches-grid.tsx     # Grille matchs avec pagination (9-12/page)
│   │
│   ├── search/                      # Composants recherche
│   │   ├── search-input.tsx         # Input avec debounce
│   │   ├── teams-search-grid.tsx    # Résultats équipes (pagination)
│   │   ├── players-search-grid.tsx  # Résultats joueurs (pagination)
│   │   └── matches-search-grid.tsx  # Résultats matchs (pagination)
│   │
│   ├── settings/                     # ⚙️ Composants Settings
│   │   └── notification-settings.tsx # Gestion notifications PWA
│   │   └── test-notifications.tsx    # Gestion notifications PWA
│   │
│   ├── loading/
│   │   └── page-loading.tsx    # Loading component réutilisable
│   │
│   ├── ui/                      # shadcn/ui components (40+)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── tabs.tsx
│   │   ├── pagination-custom.tsx    # Pagination réutilisable
│   │   └── ...                      # Accordion, Alert, Dialog, etc.
│   │
│   ├── theme-provider.tsx       # Provider dark mode
│   ├── theme-toggle.tsx         # Toggle dark/light
│   └── update-notifier.tsx      # Notification nouvelle version
│   └── search-input.tsx
│
├── lib/                          # Logique métier
│   ├── api/
│   │   ├── sportsdb.ts         # Client API TheSportsDB + cache
│   │   ├── transformers.ts     # Normalisation données API
│   │   └── standings.ts        # Calcul des classements
│   │
│   ├── utils/                   # Utilitaires
│   │   ├── stats.ts            # Calcul stats avancées (NOUVEAU)
│   │   └── export.ts           # Export PDF/CSV/ICS (NOUVEAU)
│   │
│   ├── types/
│   │   └── index.ts            # Types TypeScript (Team, Player, Match)
│   │
│   ├── config/
│   │   └── api.ts              # Config API + constantes
│   │
│   └── utils.ts                 # Helpers (cn, formatters)
│
├── hooks/
│   └── use-toast.ts             # Hook toast notifications
│
├── public/                       # Assets statiques
│   ├── manifest.json            # PWA manifest (NOUVEAU)
│   ├── sw.js                    # Service Worker v1.1.0 (NOUVEAU)
│   ├── icon-192.png             # Icône PWA 192x192
│   ├── icon-512.png             # Icône PWA 512x512
│   ├── icon-generator.html      # Générateur d'icônes PWA
│   ├── grid.svg                 # Background pattern
│   └── logos/                   # Logos locaux (vide)
│
├── .env                         # Variables d'environnement (gitignore)
├── .env.example                 # Variables d'environnement d'example
├── next.config.js               # Config Next.js + cache headers (MODIFIÉ)
├── tailwind.config.ts           # Config Tailwind + thème NBA
├── tsconfig.json                # Config TypeScript strict
├── components.json              # Config shadcn/ui
└── package.json                 # Dépendances
```

### Flux de Données

### Stratégie de Rendu (ISR + SSR)

| Page            | Stratégie | Revalidation | Description                                   |
| --------------- | --------- | ------------ | --------------------------------------------- |
| `/`             | ISR       | 5 min        | Homepage avec matchs récents + 780 joueurs    |
| `/teams`        | ISR       | 1 heure      | Liste des 30 équipes (pagination 12/page)     |
| `/teams/[id]`   | ISR       | 1 heure      | Profil équipe avec joueurs                    |
| `/schedule`     | ISR       | 1 heure      | Calendrier (pagination 9-12/page, export ICS) |
| `/standings`    | ISR       | 5 min        | Classement Est/Ouest mis à jour fréquemment   |
| `/stats`        | ISR       | 1 heure      | Stats avancées + graphiques (export CSV/PDF)  |
| `/live`         | Dynamic   | No cache     | Matchs live avec auto-refresh 30s             |
| `/search`       | Dynamic   | No cache     | Recherche temps réel (pagination 12/page)     |
| `/settings`     | Static    | -            | Page paramètres notifications PWA             |
| `/matches/[id]` | ISR       | 5 min        | Détail d'un match                             |

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
| **Next.js**      | 14.2.15 | Framework React avec App Router   |
| **React**        | 18.3.1  | Library UI avec Server Components |
| **TypeScript**   | 5.2.2   | Typage statique strict            |
| **Tailwind CSS** | 3.3.3   | Utility-first CSS framework       |

### UI & Styling

| Package                      | Version | Description                           |
| ---------------------------- | ------- | ------------------------------------- |
| **shadcn/ui**                | Latest  | 40+ composants Radix UI préconfigurés |
| **Radix UI**                 | Latest  | Primitives UI accessibles             |
| **Lucide React**             | 0.446.0 | 446+ icônes SVG optimisées            |
| **next-themes**              | 0.3.0   | Dark mode avec `class` strategy       |
| **tailwindcss-animate**      | 1.0.7   | Animations Tailwind prédéfinies       |
| **class-variance-authority** | 0.7.0   | Variants de composants typés          |

### Forms & Validation

| Package                 | Version | Description                            |
| ----------------------- | ------- | -------------------------------------- |
| **React Hook Form**     | 7.53.0  | Gestion formulaires performante        |
| **Zod**                 | 3.23.8  | Validation de schémas TypeScript-first |
| **@hookform/resolvers** | 3.9.0   | Intégration Zod + React Hook Form      |

### Charts & Export

| Package             | Version | Description                          |
| ------------------- | ------- | ------------------------------------ |
| **Recharts**        | 2.12.7  | Graphiques React pour stats avancées |
| **jsPDF**           | 3.0.3   | Génération de PDF                    |
| **jsPDF-AutoTable** | 5.0.2   | Tableaux pour PDF                    |
| **ics**             | 3.8.1   | Export calendrier iCalendar          |

### Utilities & Other

| Package            | Version | Description                           |
| ------------------ | ------- | ------------------------------------- |
| **date-fns**       | 3.6.0   | Manipulation de dates                 |
| **clsx**           | 2.1.1   | Conditional classNames                |
| **tailwind-merge** | 2.5.2   | Merge Tailwind classes intelligemment |
| **Embla Carousel** | 8.3.0   | Carrousel pour images équipes         |
| **Sonner**         | 1.5.0   | Toast notifications modernes          |
| **Vaul**           | 0.9.9   | Drawer mobile                         |
| **cmdk**           | 1.0.0   | Command palette                       |

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
```

---

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [TheSportsDB API](https://www.thesportsdb.com/api.php)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

MIT License - Voir [LICENSE](LICENSE)

---

<div align="center">

**Créé par [ObeDev](https://github.com/Obed67)**

[🌐 Demo Live](https://benhoops.vercel.app) • [📖 Documentation](https://github.com/Obed67/benhoops) • [🐛 Report Bug](https://github.com/Obed67/benhoops/issues)

</div>
