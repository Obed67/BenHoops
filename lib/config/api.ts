// Configuration de l'API TheSportsDB

export const SPORTSDB_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_SPORTSDB_BASE_URL || 'https://www.thesportsdb.com/api/v1/json',
  apiKey: process.env.NEXT_PUBLIC_SPORTSDB_API_KEY,
  leagueId: '4387', // NBA League ID
  leagueName: 'NBA',
  sport: 'Basketball',
} as const;

// Configuration ESPN API (gratuite, fonctionne sur Vercel)
export const ESPN_API_CONFIG = {
  baseUrl: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba',
} as const;

// Mapping des IDs TheSportsDB -> ESPN Team Slugs
export const ESPN_TEAM_MAPPING: Record<string, string> = {
  '134860': 'atl', // Atlanta Hawks
  '134861': 'bos', // Boston Celtics
  '134862': 'bkn', // Brooklyn Nets
  '134863': 'cha', // Charlotte Hornets
  '134864': 'chi', // Chicago Bulls
  '134865': 'cle', // Cleveland Cavaliers
  '134866': 'dal', // Dallas Mavericks
  '134867': 'den', // Denver Nuggets
  '134868': 'det', // Detroit Pistons
  '134869': 'gs', // Golden State Warriors
  '134870': 'hou', // Houston Rockets
  '134871': 'ind', // Indiana Pacers
  '134872': 'lac', // LA Clippers
  '134873': 'lal', // LA Lakers
  '134874': 'mem', // Memphis Grizzlies
  '134875': 'mia', // Miami Heat
  '134876': 'mil', // Milwaukee Bucks
  '134877': 'min', // Minnesota Timberwolves
  '134878': 'no', // New Orleans Pelicans
  '134879': 'ny', // New York Knicks
  '134880': 'okc', // Oklahoma City Thunder
  '134881': 'orl', // Orlando Magic
  '134882': 'phi', // Philadelphia 76ers
  '134883': 'phx', // Phoenix Suns
  '134884': 'por', // Portland Trail Blazers
  '134885': 'sac', // Sacramento Kings
  '134886': 'sa', // San Antonio Spurs
  '134887': 'tor', // Toronto Raptors
  '134888': 'utah', // Utah Jazz
  '134889': 'wsh', // Washington Wizards
};

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
