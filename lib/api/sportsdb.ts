import { SPORTSDB_CONFIG } from '@/lib/config/api';
import {
  SportsDBTeamsResponse,
  SportsDBPlayersResponse,
  SportsDBEventsResponse,
  Team,
  Player,
  Match,
} from '@/lib/types';
import { normalizeTeam, normalizePlayer, normalizeMatch } from './transformers';

// ============================================
// HELPER FETCH OPTIMISÉ POUR NEXT.JS 14
// ============================================

/**
 * Helper pour construire l'URL de l'API TheSportsDB
 */
function buildApiUrl(endpoint: string): string {
  return `${SPORTSDB_CONFIG.baseUrl}/${SPORTSDB_CONFIG.apiKey}/${endpoint}`;
}

/**
 * Fetch wrapper optimisé pour Next.js 14 Server Components
 * Utilise les options de cache natives de Next.js
 */
async function fetchFromAPI<T>(
  endpoint: string,
  options?: {
    revalidate?: number | false; // ISR: secondes avant revalidation
    cache?: 'force-cache' | 'no-store'; // SSG ou SSR
    tags?: string[]; // Pour revalidateTag
  }
): Promise<T> {
  const url = buildApiUrl(endpoint);

  try {
    const response = await fetch(url, {
      next: {
        revalidate: options?.revalidate,
        tags: options?.tags,
      },
      cache: options?.cache,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// ============================================
// SERVICES API - ÉQUIPES
// ============================================

/**
 * Récupère toutes les équipes NBA
 * Utilise ISR avec revalidation toutes les 24h (86400 secondes)
 */
export async function getNBATeams(): Promise<Team[]> {
  try {
    const leagueName = encodeURIComponent(SPORTSDB_CONFIG.leagueName);
    const data = await fetchFromAPI<SportsDBTeamsResponse>(
      `search_all_teams.php?l=${leagueName}`,
      { revalidate: 86400, tags: ['nba-teams'] } // ISR: 24h
    );

    if (!data.teams || data.teams.length === 0) {
      console.warn('Aucune équipe trouvée pour la NBA');
      return [];
    }

    return data.teams.map(normalizeTeam);
  } catch (error) {
    console.error('Error fetching NBA teams:', error);
    return [];
  }
}

// Alias pour compatibilité
export const getBALTeams = getNBATeams;

/**
 * Récupère une équipe spécifique par son ID
 * Utilise SSG avec force-cache pour pages statiques
 */
export async function getTeamById(teamId: string): Promise<Team | null> {
  try {
    const data = await fetchFromAPI<SportsDBTeamsResponse>(
      `lookupteam.php?id=${teamId}`,
      { cache: 'force-cache', tags: [`team-${teamId}`] } // SSG
    );

    if (!data.teams || data.teams.length === 0) {
      return null;
    }

    return normalizeTeam(data.teams[0]);
  } catch (error) {
    console.error(`Error fetching team ${teamId}:`, error);
    return null;
  }
}

// ============================================
// SERVICES API - JOUEURS
// ============================================

/**
 * Récupère tous les joueurs d'une équipe
 * Utilise SSG pour pages statiques d'équipe
 */
export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  try {
    const data = await fetchFromAPI<SportsDBPlayersResponse>(
      `lookup_all_players.php?id=${teamId}`,
      { cache: 'force-cache', tags: [`players-${teamId}`] } // SSG
    );

    if (!data.player || data.player.length === 0) {
      console.warn(`Aucun joueur trouvé pour l'équipe ${teamId}`);
      return [];
    }

    return data.player.map(normalizePlayer);
  } catch (error) {
    console.error(`Error fetching players for team ${teamId}:`, error);
    return [];
  }
}

/**
 * Récupère un joueur spécifique par son ID
 * Utilise SSG pour pages statiques de joueur
 */
export async function getPlayerById(playerId: string): Promise<Player | null> {
  try {
    const data = await fetchFromAPI<SportsDBPlayersResponse>(
      `lookupplayer.php?id=${playerId}`,
      { cache: 'force-cache', tags: [`player-${playerId}`] } // SSG
    );

    if (!data.player || data.player.length === 0) {
      return null;
    }

    return normalizePlayer(data.player[0]);
  } catch (error) {
    console.error(`Error fetching player ${playerId}:`, error);
    return null;
  }
}

// ============================================
// SERVICES API - MATCHS/ÉVÉNEMENTS
// ============================================

/**
 * Récupère les matchs d'une équipe pour une saison
 * Utilise ISR avec revalidation courte pour matchs récents
 */
export async function getTeamMatches(teamId: string, season?: string): Promise<Match[]> {
  try {
    const endpoint = `eventslast.php?id=${teamId}`;

    const [data, teams] = await Promise.all([
      fetchFromAPI<SportsDBEventsResponse>(endpoint, {
        revalidate: 3600,
        tags: [`matches-${teamId}`],
      }),
      getNBATeams(),
    ]);

    if (!data.events || data.events.length === 0) {
      console.warn(`Aucun match trouvé pour l'équipe ${teamId}`);
      return [];
    }

    // Créer une map des équipes
    const teamsMap = new Map(teams.map((team) => [team.id, { logo: team.logo }]));

    // Filtrer uniquement les matchs de basketball
    const basketballEvents = data.events.filter(
      (event: any) => event.strSport === 'Basketball' || event.strLeague.includes('Basketball')
    );

    return basketballEvents.map((event) => normalizeMatch(event, teamsMap));
  } catch (error) {
    console.error(`Error fetching matches for team ${teamId}:`, error);
    return [];
  }
}

/**
 * Récupère les prochains matchs d'une ligue
 * Utilise ISR avec revalidation fréquente
 */
export async function getUpcomingMatches(leagueId?: string): Promise<Match[]> {
  try {
    if (!leagueId) {
      console.warn('ID de ligue non fourni pour les prochains matchs');
      return [];
    }

    const [data, teams] = await Promise.all([
      fetchFromAPI<SportsDBEventsResponse>(`eventsnextleague.php?id=${leagueId}`, {
        revalidate: 1800,
        tags: ['upcoming-matches'],
      }),
      getNBATeams(),
    ]);

    if (!data.events || data.events.length === 0) {
      return [];
    }

    const teamsMap = new Map(teams.map((team) => [team.id, { logo: team.logo }]));
    return data.events.map((event) => normalizeMatch(event, teamsMap));
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
    return [];
  }
}

/**
 * Récupère les matchs passés d'une ligue
 * Utilise ISR avec revalidation moyenne
 */
export async function getPastMatches(leagueId?: string): Promise<Match[]> {
  try {
    if (!leagueId) {
      console.warn('ID de ligue non fourni pour les matchs passés');
      return [];
    }

    const [data, teams] = await Promise.all([
      fetchFromAPI<SportsDBEventsResponse>(`eventspastleague.php?id=${leagueId}`, {
        revalidate: 3600,
        tags: ['past-matches'],
      }),
      getNBATeams(),
    ]);

    if (!data.events || data.events.length === 0) {
      return [];
    }

    const teamsMap = new Map(teams.map((team) => [team.id, { logo: team.logo }]));
    return data.events.map((event) => normalizeMatch(event, teamsMap));
  } catch (error) {
    console.error('Error fetching past matches:', error);
    return [];
  }
}

/**
 * Récupère tous les matchs NBA (passés + à venir)
 * Utilise ISR avec revalidation courte pour calendrier en direct
 */
export async function getAllNBAMatches(season?: string): Promise<Match[]> {
  try {
    const leagueId = SPORTSDB_CONFIG.leagueId;
    const currentSeason = season || '2024-2025';

    // Récupérer les matchs ET les équipes en parallèle
    const [matchesData, teams] = await Promise.all([
      fetchFromAPI<SportsDBEventsResponse>(`eventsseason.php?id=${leagueId}&s=${currentSeason}`, {
        revalidate: 3600,
        tags: ['all-matches', `season-${currentSeason}`],
      }),
      getNBATeams(),
    ]);

    if (!matchesData.events || matchesData.events.length === 0) {
      console.warn(`Aucun match trouvé pour la saison ${currentSeason}`);
      return [];
    }

    // Créer une map des équipes pour lookup rapide
    const teamsMap = new Map(teams.map((team) => [team.id, { logo: team.logo }]));

    // Filtrer uniquement les matchs de basketball et normaliser avec logos
    const basketballMatches = matchesData.events.filter(
      (event: any) => event.strSport === 'Basketball'
    );
    return basketballMatches.map((event) => normalizeMatch(event, teamsMap));
  } catch (error) {
    console.error('Error fetching all NBA matches:', error);
    return [];
  }
}

// ============================================
// SERVICES UTILITAIRES
// ============================================

/**
 * Récupère toutes les données nécessaires pour une équipe (équipe + joueurs + matchs)
 */
export async function getTeamWithDetails(teamId: string) {
  try {
    const [team, players, matches] = await Promise.all([
      getTeamById(teamId),
      getPlayersByTeam(teamId),
      getTeamMatches(teamId),
    ]);

    return {
      team,
      players,
      matches,
    };
  } catch (error) {
    console.error(`Error fetching team details for ${teamId}:`, error);
    return {
      team: null,
      players: [],
      matches: [],
    };
  }
}

/**
 * Recherche une ligue par nom et retourne son ID
 * Utilise cache statique car les ligues changent rarement
 */
export async function searchLeague(leagueName: string): Promise<string | null> {
  try {
    const data = await fetchFromAPI<{ leagues?: Array<{ idLeague: string; strLeague: string }> }>(
      `search_all_leagues.php?s=${encodeURIComponent(SPORTSDB_CONFIG.sport)}`,
      { cache: 'force-cache', tags: ['leagues'] } // SSG
    );

    if (!data.leagues) {
      return null;
    }

    const league = data.leagues.find((l: any) =>
      l.strLeague.toLowerCase().includes(leagueName.toLowerCase())
    );

    return league?.idLeague || null;
  } catch (error) {
    console.error('Error searching league:', error);
    return null;
  }
}
