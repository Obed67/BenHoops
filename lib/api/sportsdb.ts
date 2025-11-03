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
// CLIENT HTTP GÉNÉRIQUE
// ============================================

class SportsDBClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = SPORTSDB_CONFIG.baseUrl;
    this.apiKey = SPORTSDB_CONFIG.apiKey;
  }

  private getUrl(endpoint: string): string {
    return `${this.baseUrl}/${this.apiKey}/${endpoint}`;
  }

  async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = this.getUrl(endpoint);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }
}

const client = new SportsDBClient();

// ============================================
// SERVICES API - ÉQUIPES
// ============================================

/**
 * Récupère toutes les équipes NBA
 */
export async function getNBATeams(): Promise<Team[]> {
  try {
    const leagueName = encodeURIComponent(SPORTSDB_CONFIG.leagueName);
    const data = await client.fetch<SportsDBTeamsResponse>(`search_all_teams.php?l=${leagueName}`);

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
 */
export async function getTeamById(teamId: string): Promise<Team | null> {
  try {
    const data = await client.fetch<SportsDBTeamsResponse>(`lookupteam.php?id=${teamId}`);

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
 */
export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  try {
    const data = await client.fetch<SportsDBPlayersResponse>(`lookup_all_players.php?id=${teamId}`);

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
 */
export async function getPlayerById(playerId: string): Promise<Player | null> {
  try {
    const data = await client.fetch<SportsDBPlayersResponse>(`lookupplayer.php?id=${playerId}`);

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
 */
export async function getTeamMatches(teamId: string, season?: string): Promise<Match[]> {
  try {
    const seasonParam = season || new Date().getFullYear().toString();
    const endpoint = `eventslast.php?id=${teamId}`;

    const data = await client.fetch<SportsDBEventsResponse>(endpoint);

    if (!data.events || data.events.length === 0) {
      console.warn(`Aucun match trouvé pour l'équipe ${teamId}`);
      return [];
    }

    // Filtrer uniquement les matchs de basketball
    const basketballEvents = data.events.filter(
      (event) => event.strSport === 'Basketball' || event.strLeague.includes('Basketball')
    );

    return basketballEvents.map(normalizeMatch);
  } catch (error) {
    console.error(`Error fetching matches for team ${teamId}:`, error);
    return [];
  }
}

/**
 * Récupère les prochains matchs d'une ligue
 */
export async function getUpcomingMatches(leagueId?: string): Promise<Match[]> {
  try {
    // Pour la BAL, on pourrait avoir besoin de l'ID de la ligue
    // Si pas disponible, on retourne un tableau vide et on utilisera les matchs par équipe
    if (!leagueId) {
      console.warn('ID de ligue non fourni pour les prochains matchs');
      return [];
    }

    const data = await client.fetch<SportsDBEventsResponse>(`eventsnextleague.php?id=${leagueId}`);

    if (!data.events || data.events.length === 0) {
      return [];
    }

    return data.events.map(normalizeMatch);
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
    return [];
  }
}

/**
 * Récupère les matchs passés d'une ligue
 */
export async function getPastMatches(leagueId?: string): Promise<Match[]> {
  try {
    if (!leagueId) {
      console.warn('ID de ligue non fourni pour les matchs passés');
      return [];
    }

    const data = await client.fetch<SportsDBEventsResponse>(`eventspastleague.php?id=${leagueId}`);

    if (!data.events || data.events.length === 0) {
      return [];
    }

    return data.events.map(normalizeMatch);
  } catch (error) {
    console.error('Error fetching past matches:', error);
    return [];
  }
}

/**
 * Récupère tous les matchs NBA (passés + à venir)
 */
export async function getAllNBAMatches(season?: string): Promise<Match[]> {
  try {
    const leagueId = SPORTSDB_CONFIG.leagueId;
    const currentSeason = season || '2024-2025';

    // Récupérer les matchs de la saison
    const data = await client.fetch<SportsDBEventsResponse>(
      `eventsseason.php?id=${leagueId}&s=${currentSeason}`
    );

    if (!data.events || data.events.length === 0) {
      console.warn(`Aucun match trouvé pour la saison ${currentSeason}`);
      return [];
    }

    // Filtrer uniquement les matchs de basketball et normaliser
    const basketballMatches = data.events.filter((event) => event.strSport === 'Basketball');
    return basketballMatches.map(normalizeMatch);
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
 */
export async function searchLeague(leagueName: string): Promise<string | null> {
  try {
    const data = await client.fetch<{ leagues?: Array<{ idLeague: string; strLeague: string }> }>(
      `search_all_leagues.php?s=${encodeURIComponent(SPORTSDB_CONFIG.sport)}`
    );

    if (!data.leagues) {
      return null;
    }

    const league = data.leagues.find((l) =>
      l.strLeague.toLowerCase().includes(leagueName.toLowerCase())
    );

    return league?.idLeague || null;
  } catch (error) {
    console.error('Error searching league:', error);
    return null;
  }
}
