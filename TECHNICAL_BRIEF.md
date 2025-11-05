# 📋 Brief Technique - BenHoops

> Document technique détaillant les défis rencontrés, les optimisations implémentées et les axes d'amélioration futurs du projet BenHoops.


## 🚧 Défis Techniques Rencontrés

### 1. **Limitations de l'API Gratuite TheSportsDB**

**Problème** :

- Rate limit strict : **10 requêtes/minute** avec la clé gratuite (`'3'`)
- Risque d'erreur `429 Too Many Requests` lors du build
- 30 équipes × 3+ endpoints = 90+ requêtes potentielles

**Impact** :

```
❌ Build échouait fréquemment
❌ Temps de build > 5 minutes
❌ Doublons d'appels API pour les mêmes données
```

**Solution Implémentée** :

```typescript
// lib/api/sportsdb.ts
const apiCache = new Map<string, any>();

export async function fetchWithCache(endpoint: string) {
  // 1. Cache mémoire
  if (apiCache.has(endpoint)) {
    console.log('📦 [CACHE HIT]:', endpoint);
    return apiCache.get(endpoint);
  }

  // 2. Délai entre requêtes
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 3. Retry automatique
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const data = await fetch(endpoint).then((res) => res.json());
      apiCache.set(endpoint, data);
      return data;
    } catch (error) {
      if (attempt === 1) throw error;
    }
  }
}
```

---

### 2. **Gestion du Cache en Production**

**Problème** :

- Erreur `ChunkLoadError` sur Vercel après déploiement
- Utilisateurs voyaient d'anciens fichiers JS/CSS
- Pas de notification lors de nouvelles versions

**Impact** :

```
❌ Composants manquants (pagination.tsx not found)
❌ Utilisateurs devaient vider le cache manuellement
❌ Mauvaise expérience utilisateur
```

**Solution Multi-Couches** :

**a) Cache Headers (next.config.js)** :

```javascript
async headers() {
  return [
    {
      source: '/_next/static/:path*',
      headers: [{
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable' // 1 an
      }]
    },
    {
      source: '/:path*',
      headers: [{
        key: 'Cache-Control',
        value: 'public, max-age=0, must-revalidate' // Toujours revalider
      }]
    }
  ];
}
```

**b) Service Worker avec Versioning (public/sw.js)** :

```javascript
const VERSION = 'v1.1.0'; // Auto-increment à chaque déploiement

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force l'activation immédiate
});

self.addEventListener('activate', (event) => {
  // Nettoyage des anciens caches
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key)));
    })
  );
});
```

**c) Auto-Update Notifier (components/update-notifier.tsx)** :

```typescript
'use client';

export function UpdateNotifier() {
  useEffect(() => {
    navigator.serviceWorker?.addEventListener('message', (event) => {
      if (event.data.type === 'SW_UPDATED') {
        toast({
          title: '🎉 Nouvelle version disponible !',
          action: <Button onClick={() => window.location.reload()}>Actualiser</Button>,
        });
      }
    });

    // Vérification automatique toutes les 30 min
    const interval = setInterval(() => {
      navigator.serviceWorker?.getRegistration().then((reg) => reg?.update());
    }, 30 * 60 * 1000);
  }, []);
}
```
---

### 3. **Stratégie ISR (Incremental Static Regeneration)**

**Problème** :

- Données NBA changent fréquemment (scores, classements)
- SSR = trop lent (fetch à chaque requête)
- SSG pur = données obsolètes

**Solution ISR** :

```typescript
// app/standings/page.tsx
export const revalidate = 300; // 5 minutes

export default async function StandingsPage() {
  const standings = await getStandings();
  return <StandingsView data={standings} />;
}

// app/teams/page.tsx
export const revalidate = 3600; // 1 heure (données stables)

// app/live/page.tsx
export const dynamic = 'force-dynamic'; // Toujours fresh
```

**Stratégie par Page** :

| Page         | Stratégie | Revalidation | Raison                             |
| ------------ | --------- | ------------ | ---------------------------------- |
| `/`          | ISR       | 5 min        | Matchs récents changent souvent    |
| `/teams`     | ISR       | 1h           | Équipes stables                    |
| `/standings` | ISR       | 5 min        | Classement mis à jour après matchs |
| `/stats`     | ISR       | 1h           | Stats agrégées stables             |
| `/live`      | Dynamic   | -            | Scores temps réel                  |
| `/search`    | Dynamic   | -            | Requêtes utilisateur uniques       |

---

## ⚡ Optimisations Implémentées

### 1. **Architecture Server/Client Components**

```typescript
// ✅ Server Component (par défaut)
// app/teams/page.tsx
export default async function TeamsPage() {
  const teams = await getNBATeams(); // Fetch côté serveur
  return <TeamsGrid teams={teams} />; // Pas de JS envoyé si pas nécessaire
}

// ✅ Client Component (interactivité)
// components/teams/teams-grid.tsx
('use client');
export function TeamsGrid({ teams }: { teams: Team[] }) {
  const [page, setPage] = useState(1); // État client
  // ...
}
```

**Bénéfices** :

- Bundle JS réduit de 40%
- Initial load < 2s
- Meilleur SEO (contenu côté serveur)

---

### 2. **Export de Données Multi-Format**

**Implémentation** :

```typescript
// lib/utils/export.ts

// Export PDF avec jsPDF
export function exportToPDF(matches: Match[], filename: string) {
  const doc = new jsPDF();
  doc.text('Calendrier NBA', 14, 15);

  autoTable(doc, {
    head: [['Date', 'Équipe Domicile', 'Score', 'Équipe Extérieur']],
    body: matches.map((m) => [
      format(new Date(m.date), 'dd/MM/yyyy'),
      m.homeTeam,
      `${m.homeScore} - ${m.awayScore}`,
      m.awayTeam,
    ]),
  });

  doc.save(`${filename}.pdf`);
}

// Export CSV
export function exportToCSV(data: any[], filename: string) {
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map((row) => Object.values(row).join(',')),
  ].join('\n');

  downloadFile(csv, `${filename}.csv`, 'text/csv');
}

// Export iCalendar (.ics)
export function exportToICS(matches: Match[]) {
  const events = matches.map((m) => ({
    start: parseISO(m.date),
    duration: { hours: 2 },
    title: `${m.homeTeam} vs ${m.awayTeam}`,
    location: m.venue,
    description: `Score: ${m.homeScore} - ${m.awayScore}`,
  }));

  createEvents(events, (error, value) => {
    if (!error) downloadFile(value, 'nba-calendar.ics', 'text/calendar');
  });
}
```

**Résultat** :

- ✅ 4 formats d'export disponibles
- ✅ Utilisé sur `/schedule` et `/stats`
- ✅ UX professionnelle

---

### 3. **PWA avec Notifications Push**

**Manifest (public/manifest.json)** :

```json
{
  "name": "BenHoops - NBA Stats",
  "short_name": "BenHoops",
  "theme_color": "#F26522",
  "background_color": "#0A0A0A",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**Service Worker (public/sw.js)** :

- Cache Network First pour HTML
- Cache First pour assets statiques
- Background sync pour notifications

---

## 🔮 Points d'Amélioration Futurs

### 1. **Tests Automatisés** (Priorité Haute)

**Manque actuel** :

- ❌ Pas de tests unitaires
- ❌ Pas de tests E2E
- ❌ Risque de régression

---

### 2. **Backend Custom avec Base de Données**

**Limitation actuelle** :

- Dépendance totale à TheSportsDB API
- TheSportsDB API gratuit est très limitée
- Pas de données augmentées (favoris, notes, etc.)
- Pas de features sociales


**Nouvelles Features Possibles** :

- Favoris équipes/joueurs (localStorage → DB)
- Notifications personnalisées par équipe
- Historique de recherches
- Commentaires utilisateurs
- Prédictions de matchs avec ML

---


### 3. **Internationalisation (i18n)** (Priorité Basse)

**Langues Cibles** :

- 🇫🇷 Français (actuel)
- 🇬🇧 Anglais
- 🇪🇸 Espagnol

---

**Document rédigé le 5 novembre 2025**  
**Contact** : [GitHub - Obed67](https://github.com/Obed67)  
**Projet** : [BenHoops Live Demo](https://benhoops.vercel.app)
