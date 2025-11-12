import { SPORTSDB_CONFIG, NBA_API_CONFIG, TEAM_ID_MAPPING } from '@/lib/config/api';
import {
  SportsDBTeamsResponse,
  SportsDBPlayersResponse,
  SportsDBEventsResponse,
  SportsDBEvent,
  Team,
  Player,
  Match,
} from '@/lib/types';
import { normalizeTeam, normalizePlayer, normalizeMatch } from './transformers';

// ============================================
// CACHE EN MÉMOIRE POUR ÉVITER LES APPELS RÉPÉTÉS
// ============================================

// Cache global pour stocker les résultats pendant le build
const apiCache = new Map<string, any>();

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
 * Délai pour éviter de dépasser les limites de l'API (429 Too Many Requests)
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch wrapper optimisé pour Next.js 14 Server Components
 * Utilise les options de cache natives de Next.js + cache mémoire pour build
 * Inclut un délai pour éviter les erreurs 429
 * Retourne un objet vide en cas d'erreur pour éviter de casser la page
 */
async function fetchFromAPI<T>(
  endpoint: string,
  options?: {
    revalidate?: number | false; // ISR: secondes avant revalidation
    cache?: 'force-cache' | 'no-store'; // SSG ou SSR
    tags?: string[]; // Pour revalidateTag
    useMemoryCache?: boolean; // Utiliser le cache mémoire (pour build)
  }
): Promise<T> {
  const url = buildApiUrl(endpoint);

  // Vérifier le cache mémoire si activé (évite les appels répétés pendant le build)
  if (options?.useMemoryCache !== false) {
    const cached = apiCache.get(endpoint);
    if (cached) {
      console.log(`📦 [CACHE HIT] ${endpoint}`);
      return cached;
    }
  }

  const maxRetries = 2; // Nombre de tentatives en cas d'erreur 429

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Délai important pour éviter 429 (Too Many Requests) sur l'API gratuite
      // L'API gratuite limite à ~10 requêtes par minute = 1 requête toutes les 6 secondes
      await delay(500); // 500ms minimum entre chaque requête

      const response = await fetch(url, {
        next: {
          revalidate: options?.revalidate ?? 3600, // Par défaut: 1 heure
          tags: options?.tags,
        },
        cache: options?.cache,
      });

      if (!response.ok) {
        // Si 429 et pas la dernière tentative, attendre plus longtemps et réessayer
        if (response.status === 429 && attempt < maxRetries) {
          const waitTime = 2000 * attempt; // Augmenter l'attente à chaque tentative
          console.warn(
            `⚠️  429 Rate Limit - Tentative ${attempt}/${maxRetries} - Attente ${waitTime}ms`
          );
          await delay(waitTime);
          continue; // Réessayer
        }

        console.error(`API Error: ${response.status} ${response.statusText} - ${url}`);
        // Retourner un objet vide au lieu de throw pour éviter de casser la page
        return {} as T;
      }

      const data = await response.json();

      // Stocker dans le cache mémoire pour réutilisation
      if (options?.useMemoryCache !== false) {
        apiCache.set(endpoint, data);
        console.log(`💾 [CACHE SET] ${endpoint}`);
      }

      return data;
    } catch (error) {
      if (attempt === maxRetries) {
        console.error(`Error fetching ${endpoint}:`, error);
        // Retourner un objet vide au lieu de throw
        return {} as T;
      }
      // Si ce n'est pas la dernière tentative, attendre et réessayer
      await delay(2000);
    }
  }

  // Fallback (ne devrait jamais arriver ici)
  return {} as T;
}

// ============================================
// SERVICES API - ÉQUIPES
// ============================================

/**
 * Récupère toutes les équipes NBA
 * Utilise ISR avec revalidation toutes les 24h (86400 secondes)
 * Active le cache mémoire pour éviter les appels répétés au build
 */
export async function getNBATeams(): Promise<Team[]> {
  try {
    const leagueName = encodeURIComponent(SPORTSDB_CONFIG.leagueName);
    const endpoint = `search_all_teams.php?l=${leagueName}`;

    console.log(`[getNBATeams] Fetching from: ${buildApiUrl(endpoint)}`);

    const data = await fetchFromAPI<SportsDBTeamsResponse>(endpoint, {
      revalidate: 86400,
      tags: ['nba-teams'],
      useMemoryCache: true, // ACTIVER le cache mémoire pour éviter 429
    });

    if (!data || !data.teams || data.teams.length === 0) {
      console.warn('❌ [getNBATeams] Aucune équipe trouvée pour la NBA ou erreur API');
      console.warn('[getNBATeams] Response data:', JSON.stringify(data).substring(0, 300));
      return [];
    }

    const teams = data.teams.map(normalizeTeam);
    console.log(`✅ [getNBATeams] ${teams.length} équipes NBA récupérées avec succès`);
    return teams;
  } catch (error) {
    console.error('❌ [getNBATeams] Error fetching NBA teams:', error);
    return [];
  }
}

// Alias pour compatibilité
export const getBALTeams = getNBATeams;

/**
 * Récupérer un match par son ID
 */
export async function getMatchById(matchId: string): Promise<Match | null> {
  try {
    const endpoint = `lookupevent.php?id=${matchId}`;

    const data = await fetchFromAPI<{ events: SportsDBEvent[] }>(endpoint, {
      revalidate: 0, // Pas de cache pour les matchs live
      useMemoryCache: false,
    });

    if (!data || !data.events || data.events.length === 0) {
      console.warn(`❌ [getMatchById] Match ${matchId} non trouvé`);
      return null;
    }

    const match = normalizeMatch(data.events[0]);
    return match;
  } catch (error) {
    console.error(`❌ [getMatchById] Error fetching match ${matchId}:`, error);
    return null;
  }
}

/**
 * Récupère une équipe spécifique par son ID
 * IMPORTANT: L'API gratuite ne supporte pas lookupteam correctement
 * On utilise donc search_all_teams et on filtre par ID
 */
export async function getTeamById(teamId: string): Promise<Team | null> {
  try {
    // Récupérer toutes les équipes NBA et filtrer par ID
    const teams = await getNBATeams();
    const team = teams.find((t) => t.id === teamId);

    return team || null;
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
/**
 * Récupère tous les joueurs d'une équipe NBA
 * MODIFICATION: Utilise l'API NBA Official au lieu de TheSportsDB
 */
export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  try {
    // Convertir l'ID TheSportsDB en ID NBA
    const nbaTeamId = TEAM_ID_MAPPING[teamId] || teamId;

    console.log(`🔍 [getPlayersByTeam] Mapping: TheSportsDB ID ${teamId} -> NBA ID ${nbaTeamId}`);

    // Utiliser l'API NBA Official - endpoint commonteamroster
    const url = `${NBA_API_CONFIG.baseUrl}/commonteamroster?Season=${NBA_API_CONFIG.season}&TeamID=${nbaTeamId}`;

    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(
          `🔄 [getPlayersByTeam] Tentative ${attempt}/${maxRetries} pour l'équipe ${nbaTeamId}`
        );

        await delay(100 * attempt); // Délai progressif

        // Créer un AbortController pour le timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), NBA_API_CONFIG.timeout);

        const response = await fetch(url, {
          headers: {
            ...NBA_API_CONFIG.headers,
            // Headers additionnels pour éviter le blocage
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          } as HeadersInit,
          signal: controller.signal,
          next: { revalidate: 43200 }, // Cache 12 heures
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.error(
            `❌ [getPlayersByTeam] NBA API Error: ${response.status} ${response.statusText} for team ${nbaTeamId}`
          );

          // Retry sur erreurs 5xx ou 429
          if ((response.status >= 500 || response.status === 429) && attempt < maxRetries) {
            await delay(1000 * attempt);
            continue;
          }
          return [];
        }

        const data = await response.json();

        // L'API NBA retourne les données dans resultSets[0].rowSet
        if (!data.resultSets || !data.resultSets[0] || !data.resultSets[0].rowSet) {
          console.warn(`⚠️  [getPlayersByTeam] Aucun joueur trouvé pour l'équipe ${nbaTeamId}`);
          return [];
        }

        // Mapper les données de l'API NBA vers notre format Player
        const players: Player[] = data.resultSets[0].rowSet.map((row: any[]) => ({
          id: row[14]?.toString() || '', // PLAYER_ID à l'index 14
          name: row[3] || 'Unknown', // PLAYER à l'index 3
          teamId: teamId, // Garder l'ID TheSportsDB pour la compatibilité
          teamName: '', // Sera rempli par le composant si besoin
          position: row[7] || 'N/A', // POSITION à l'index 7
          height: row[8] || '', // HEIGHT à l'index 8
          weight: row[9] ? `${row[9]} lbs` : '', // WEIGHT à l'index 9
          nationality: 'USA', // Par défaut (non fourni par cet endpoint)
          dateOfBirth: row[10] || '', // BIRTH_DATE à l'index 10
          college: row[13] || '', // SCHOOL à l'index 13
          imageUrl: `https://cdn.nba.com/headshots/nba/latest/1040x760/${row[14]}.png`,
          cutout: `https://cdn.nba.com/headshots/nba/latest/1040x760/${row[14]}.png`,
          description: '',
        }));

        console.log(
          `✅ [getPlayersByTeam] Récupéré ${players.length} joueurs pour l'équipe ${teamId} (NBA ID: ${nbaTeamId})`
        );
        return players;
      } catch (fetchError: any) {
        if (fetchError.name === 'AbortError') {
          console.warn(
            `⏱️  [getPlayersByTeam] Timeout (tentative ${attempt}/${maxRetries}) pour l'équipe ${nbaTeamId}`
          );
        } else {
          console.error(`❌ [getPlayersByTeam] Erreur (tentative ${attempt}/${maxRetries}):`, {
            team: nbaTeamId,
            error: fetchError.message,
            name: fetchError.name,
          });
        }

        // Retry sauf si c'est la dernière tentative
        if (attempt < maxRetries) {
          await delay(2000 * attempt); // Backoff exponentiel
          continue;
        }
        return [];
      }
    }

    return [];
  } catch (error: any) {
    console.error(`❌ [getPlayersByTeam] Error général pour l'équipe ${teamId}:`, error);
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

/**
 * Récupère tous les joueurs de toutes les équipes NBA
 * Utilise le cache mémoire pour éviter trop d'appels API
 */
export async function getAllNBAPlayers(): Promise<Player[]> {
  try {
    // Récupérer toutes les équipes d'abord
    const teams = await getNBATeams();

    if (teams.length === 0) {
      console.warn('Aucune équipe trouvée pour récupérer les joueurs');
      return [];
    }

    // Récupérer les joueurs de toutes les équipes en parallèle
    const playersPromises = teams.map((team) => getPlayersByTeam(team.id));
    const playersArrays = await Promise.all(playersPromises);

    // Aplatir le tableau de tableaux en un seul tableau de joueurs
    const allPlayers = playersArrays.flat();

    console.log(`✅ ${allPlayers.length} joueurs NBA récupérés au total`);
    return allPlayers;
  } catch (error) {
    console.error('Error fetching all NBA players:', error);
    return [];
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
        useMemoryCache: true, // Cache mémoire activé
      }),
      getNBATeams(), // Utilise déjà le cache mémoire
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
