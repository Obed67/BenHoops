import { getAllNBAMatches, getNBATeams } from './sportsdb';
import { Team, Match } from '@/lib/types';

export interface Standing {
  teamId: string;
  played: number;
  won: number;
  lost: number;
  winPercentage: number;
  pointsFor: number;
  pointsAgainst: number;
  pointsDiff: number;
  streak: string;
}

/**
 * Calcule le classement NBA à partir des matchs terminés
 * Utilise SSR (no-store) pour avoir le classement en temps réel
 */
export async function calculateStandings(): Promise<Standing[]> {
  const [teams, matches] = await Promise.all([getNBATeams(), getAllNBAMatches()]);

  // Initialiser les statistiques pour chaque équipe
  const standings = new Map<string, Standing>();

  teams.forEach((team) => {
    standings.set(team.id, {
      teamId: team.id,
      played: 0,
      won: 0,
      lost: 0,
      winPercentage: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      pointsDiff: 0,
      streak: '',
    });
  });

  // Traiter uniquement les matchs terminés
  const finishedMatches = matches.filter((m) => m.status === 'finished');

  finishedMatches.forEach((match) => {
    const homeTeamStat = standings.get(match.homeTeamId);
    const awayTeamStat = standings.get(match.awayTeamId);

    if (!homeTeamStat || !awayTeamStat) return;

    // Mettre à jour les statistiques
    homeTeamStat.played += 1;
    awayTeamStat.played += 1;

    homeTeamStat.pointsFor += match.homeScore || 0;
    homeTeamStat.pointsAgainst += match.awayScore || 0;
    awayTeamStat.pointsFor += match.awayScore || 0;
    awayTeamStat.pointsAgainst += match.homeScore || 0;

    // Déterminer le vainqueur
    if ((match.homeScore || 0) > (match.awayScore || 0)) {
      homeTeamStat.won += 1;
      awayTeamStat.lost += 1;
    } else {
      awayTeamStat.won += 1;
      homeTeamStat.lost += 1;
    }
  });

  // Calculer les pourcentages et différences
  standings.forEach((stat) => {
    stat.winPercentage = stat.played > 0 ? stat.won / stat.played : 0;
    stat.pointsDiff = stat.pointsFor - stat.pointsAgainst;

    // Calculer la série (simplifié)
    if (stat.won > stat.lost) {
      stat.streak = `V${stat.won}`;
    } else if (stat.lost > stat.won) {
      stat.streak = `D${stat.lost}`;
    } else {
      stat.streak = '-';
    }
  });

  // Trier par pourcentage de victoires (décroissant)
  return Array.from(standings.values()).sort((a, b) => {
    if (b.winPercentage !== a.winPercentage) {
      return b.winPercentage - a.winPercentage;
    }
    // En cas d'égalité, trier par différence de points
    return b.pointsDiff - a.pointsDiff;
  });
}
