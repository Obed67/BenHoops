// Helpers pour fetching côté serveur avec Next.js App Router

import { REVALIDATE_TIME } from '@/lib/config/api';
import type { Team, Player, Match } from '@/lib/types';
import { getAllNBAMatches, getNBATeams } from '@/lib/api/sportsdb';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// ============================================
// FETCH HELPERS AVEC ISR
// ============================================

/**
 * Fetch toutes les équipes avec ISR
 */
export async function fetchTeams(): Promise<Team[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/teams`, {
      next: { revalidate: REVALIDATE_TIME.teams },
    });

    if (!res.ok) {
      console.error('Failed to fetch teams:', res.status);
      return [];
    }

    const data = await res.json();
    return data.teams || [];
  } catch (error) {
    console.error('Error fetching teams:', error);
    return [];
  }
}

/**
 * Fetch une équipe spécifique avec ISR
 */
export async function fetchTeamById(id: string): Promise<Team | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/teams/${id}`, {
      next: { revalidate: REVALIDATE_TIME.teams },
    });

    if (!res.ok) {
      console.error(`Failed to fetch team ${id}:`, res.status);
      return null;
    }

    const data = await res.json();
    return data.team || null;
  } catch (error) {
    console.error(`Error fetching team ${id}:`, error);
    return null;
  }
}

/**
 * Fetch les joueurs d'une équipe avec ISR
 */
export async function fetchPlayersByTeam(teamId: string): Promise<Player[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/teams/${teamId}/players`, {
      next: { revalidate: REVALIDATE_TIME.players },
    });

    if (!res.ok) {
      console.error(`Failed to fetch players for team ${teamId}:`, res.status);
      return [];
    }

    const data = await res.json();
    return data.players || [];
  } catch (error) {
    console.error(`Error fetching players for team ${teamId}:`, error);
    return [];
  }
}

/**
 * Fetch tous les matchs avec ISR
 */
export async function fetchMatches(): Promise<Match[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/matches`, {
      next: { revalidate: REVALIDATE_TIME.matches },
    });

    if (!res.ok) {
      console.error('Failed to fetch matches:', res.status);
      return [];
    }

    const data = await res.json();
    return data.matches || [];
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
}

/**
 * Fetch tous les joueurs avec ISR
 */
export async function fetchPlayers(): Promise<Player[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/players`, {
      next: { revalidate: REVALIDATE_TIME.players },
    });

    if (!res.ok) {
      console.error('Failed to fetch players:', res.status);
      return [];
    }

    const data = await res.json();
    return data.players || [];
  } catch (error) {
    console.error('Error fetching players:', error);
    return [];
  }
}

/**
 * Fetch le classement avec ISR
 */
export async function fetchStandings(): Promise<Standing[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/standings`, {
      next: { revalidate: REVALIDATE_TIME.standings },
    });

    if (!res.ok) {
      console.error('Failed to fetch standings:', res.status);
      return [];
    }

    const data = await res.json();
    return data.standings || [];
  } catch (error) {
    console.error('Error fetching standings:', error);
    return [];
  }
}

/**
 * Fetch les matchs d'une équipe avec ISR
 */
export async function fetchMatchesByTeam(teamId: string, season?: string): Promise<Match[]> {
  try {
    const url = season
      ? `${BASE_URL}/api/teams/${teamId}/matches?season=${season}`
      : `${BASE_URL}/api/teams/${teamId}/matches`;

    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_TIME.matches },
    });

    if (!res.ok) {
      console.error(`Failed to fetch matches for team ${teamId}:`, res.status);
      return [];
    }

    const data = await res.json();
    return data.matches || [];
  } catch (error) {
    console.error(`Error fetching matches for team ${teamId}:`, error);
    return [];
  }
}

// ============================================
// HELPERS AVEC DONNÉES STATIQUES (FALLBACK)
// ============================================

/**
 * Agrège tous les matchs de toutes les équipes
 * (utilisé quand l'API ne fournit pas d'endpoint global de matchs)
 */
export async function fetchAllMatches(): Promise<Match[]> {
  try {
    // Utiliser directement l'API NBA pour récupérer tous les matchs
    const matches = await getAllNBAMatches();
    return matches;
  } catch (error) {
    console.error('Error fetching all matches:', error);
    return [];
  }
}

/**
 * Agrège tous les joueurs de toutes les équipes
 */
export async function fetchAllPlayers(): Promise<Player[]> {
  try {
    const teams = await fetchTeams();

    if (teams.length === 0) {
      return [];
    }

    // Fetch les joueurs pour chaque équipe en parallèle
    const playersPromises = teams.map((team) => fetchPlayersByTeam(team.id));
    const allPlayers = await Promise.all(playersPromises);

    return allPlayers.flat();
  } catch (error) {
    console.error('Error fetching all players:', error);
    return [];
  }
}

// ============================================
// CALCUL DU CLASSEMENT
// ============================================

export interface Standing {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  lost: number;
  winPercentage: number;
  pointsFor: number;
  pointsAgainst: number;
  pointsDiff: number;
  streak: string;
  homeRecord?: string;
  awayRecord?: string;
}

/**
 * Calcule le classement basé sur les matchs réels
 */
export async function calculateStandings(): Promise<Standing[]> {
  try {
    // Appeler directement l'API au lieu de passer par les endpoints pour éviter les dépendances circulaires
    const [teams, matches] = await Promise.all([getNBATeams(), getAllNBAMatches()]);

    if (teams.length === 0) {
      console.warn('Aucune équipe trouvée pour calculer le classement');
      return [];
    }

    console.log(`Calcul du classement avec ${teams.length} équipes et ${matches.length} matchs`);

    // Filtrer uniquement les matchs terminés
    const finishedMatches = matches.filter((m) => m.status === 'finished');
    console.log(`${finishedMatches.length} matchs terminés trouvés`);

    // Initialiser les stats pour chaque équipe
    const standings = new Map<string, Standing>();
    teams.forEach((team) => {
      standings.set(team.id, {
        teamId: team.id,
        teamName: team.name,
        played: 0,
        won: 0,
        lost: 0,
        winPercentage: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        pointsDiff: 0,
        streak: '',
        homeRecord: '0-0',
        awayRecord: '0-0',
      });
    });

    // Calculer les stats pour chaque match
    finishedMatches.forEach((match) => {
      const homeTeam = standings.get(match.homeTeamId);
      const awayTeam = standings.get(match.awayTeamId);

      if (!homeTeam || !awayTeam || match.homeScore === null || match.awayScore === null) {
        return;
      }

      // Mettre à jour les matchs joués
      homeTeam.played++;
      awayTeam.played++;

      // Mettre à jour les points
      homeTeam.pointsFor += match.homeScore;
      homeTeam.pointsAgainst += match.awayScore;
      awayTeam.pointsFor += match.awayScore;
      awayTeam.pointsAgainst += match.homeScore;

      // Déterminer le vainqueur
      if (match.homeScore > match.awayScore) {
        homeTeam.won++;
        awayTeam.lost++;
      } else {
        awayTeam.won++;
        homeTeam.lost++;
      }
    });

    // Calculer les stats dérivées
    standings.forEach((standing) => {
      standing.pointsDiff = standing.pointsFor - standing.pointsAgainst;
      standing.winPercentage = standing.played > 0 ? standing.won / standing.played : 0;

      // Calculer la série (simplifié - prend les 3 derniers matchs)
      const teamMatches = finishedMatches
        .filter((m) => m.homeTeamId === standing.teamId || m.awayTeamId === standing.teamId)
        .slice(-3);

      let wins = 0;
      let losses = 0;
      teamMatches.forEach((match) => {
        if (match.homeScore === null || match.awayScore === null) return;

        const isHome = match.homeTeamId === standing.teamId;
        const teamScore = isHome ? match.homeScore : match.awayScore;
        const oppScore = isHome ? match.awayScore : match.homeScore;

        if (teamScore > oppScore) wins++;
        else losses++;
      });

      standing.streak = wins > 0 ? `W${wins}` : losses > 0 ? `L${losses}` : '-';
    });

    // Trier par pourcentage de victoires, puis par différence de points
    return Array.from(standings.values()).sort((a, b) => {
      if (b.winPercentage !== a.winPercentage) {
        return b.winPercentage - a.winPercentage;
      }
      return b.pointsDiff - a.pointsDiff;
    });
  } catch (error) {
    console.error('Error calculating standings:', error);
    return [];
  }
}
