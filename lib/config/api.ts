// Configuration de l'API TheSportsDB

export const SPORTSDB_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_SPORTSDB_BASE_URL || 'https://www.thesportsdb.com/api/v1/json',
  apiKey: process.env.NEXT_PUBLIC_SPORTSDB_API_KEY,
  leagueId: '4387', // NBA League ID
  leagueName: 'NBA',
  sport: 'Basketball',
} as const;

// Configuration NBA Official API (gratuite, sans clé)
export const NBA_API_CONFIG = {
  baseUrl: 'https://stats.nba.com/stats',
  season: '2024-25',
  leagueId: '00',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.nba.com/',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Origin': 'https://www.nba.com',
    'Connection': 'keep-alive',
    'x-nba-stats-origin': 'stats',
    'x-nba-stats-token': 'true',
  },
  timeout: 8000, // 8 secondes max
} as const;

// Mapping entre IDs TheSportsDB et IDs NBA Official API
// TheSportsDB ID -> NBA Team ID
export const TEAM_ID_MAPPING: Record<string, string> = {
  '134860': '1610612737', // Atlanta Hawks
  '134861': '1610612738', // Boston Celtics
  '134862': '1610612751', // Brooklyn Nets
  '134863': '1610612766', // Charlotte Hornets
  '134864': '1610612741', // Chicago Bulls
  '134865': '1610612739', // Cleveland Cavaliers
  '134866': '1610612742', // Dallas Mavericks
  '134867': '1610612743', // Denver Nuggets
  '134868': '1610612765', // Detroit Pistons
  '134869': '1610612744', // Golden State Warriors
  '134870': '1610612745', // Houston Rockets
  '134871': '1610612754', // Indiana Pacers
  '134872': '1610612746', // LA Clippers
  '134873': '1610612747', // LA Lakers
  '134874': '1610612763', // Memphis Grizzlies
  '134875': '1610612748', // Miami Heat
  '134876': '1610612749', // Milwaukee Bucks
  '134877': '1610612750', // Minnesota Timberwolves
  '134878': '1610612740', // New Orleans Pelicans
  '134879': '1610612752', // New York Knicks
  '134880': '1610612760', // Oklahoma City Thunder
  '134881': '1610612753', // Orlando Magic
  '134882': '1610612755', // Philadelphia 76ers
  '134883': '1610612756', // Phoenix Suns
  '134884': '1610612757', // Portland Trail Blazers
  '134885': '1610612758', // Sacramento Kings
  '134886': '1610612759', // San Antonio Spurs
  '134887': '1610612761', // Toronto Raptors
  '134888': '1610612762', // Utah Jazz
  '134889': '1610612764', // Washington Wizards
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
