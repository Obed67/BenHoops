// Configuration de l'API TheSportsDB

export const SPORTSDB_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_SPORTSDB_BASE_URL || 'https://www.thesportsdb.com/api/v1/json',
  apiKey: process.env.NEXT_PUBLIC_SPORTSDB_API_KEY || '123', // '123' est la clé gratuite qui fonctionne pour la NBA
  leagueId: '4387', // NBA League ID
  leagueName: 'NBA',
  sport: 'Basketball',
} as const;

// Durée de revalidation pour ISR (en secondes)
export const REVALIDATE_TIME = {
  teams: 86400, // 24 heures - les équipes changent rarement
  players: 43200, // 12 heures
  matches: 3600, // 1 heure - pour obtenir les scores mis à jour
  standings: 3600, // 1 heure
} as const;

// Cache headers pour les API routes
export const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
} as const;
