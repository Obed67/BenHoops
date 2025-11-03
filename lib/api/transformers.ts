import { SportsDBTeam, SportsDBPlayer, SportsDBEvent, Team, Player, Match } from '@/lib/types';

// Fonction utilitaire pour extraire une couleur dominante basée sur le pays
// (en production, on pourrait utiliser une lib pour extraire la couleur du logo)
function getTeamColors(country?: string): { primary: string; secondary: string } {
  const colorMap: Record<string, { primary: string; secondary: string }> = {
    Egypt: { primary: '#c8102e', secondary: '#fdb927' },
    Angola: { primary: '#000000', secondary: '#c8102e' },
    Tunisia: { primary: '#003057', secondary: '#ffd700' },
    Senegal: { primary: '#ce1141', secondary: '#000000' },
    Rwanda: { primary: '#0077c8', secondary: '#f2b316' },
    Guinea: { primary: '#2b6cb0', secondary: '#ffd700' },
    Morocco: { primary: '#006341', secondary: '#ffffff' },
    'South Africa': { primary: '#fdb927', secondary: '#552583' },
    Nigeria: { primary: '#1a5f3a', secondary: '#ffd700' },
    Kenya: { primary: '#003da5', secondary: '#e03a3e' },
    Ghana: { primary: '#006bb6', secondary: '#ffc72c' },
    Uganda: { primary: '#00788c', secondary: '#ffc72c' },
  };

  return colorMap[country || ''] || { primary: '#1e40af', secondary: '#fbbf24' };
}

// Normaliser une équipe TheSportsDB vers notre format
export function normalizeTeam(sportsDBTeam: SportsDBTeam): Team {
  const colors = getTeamColors(sportsDBTeam.strCountry);
  const capacity = parseInt(sportsDBTeam.intStadiumCapacity || '0', 10);
  const founded = parseInt(sportsDBTeam.intFormedYear || '2000', 10);

  return {
    id: sportsDBTeam.idTeam,
    name: sportsDBTeam.strTeam,
    shortName: sportsDBTeam.strTeamShort || sportsDBTeam.strTeam.substring(0, 3).toUpperCase(),
    city: sportsDBTeam.strStadiumLocation || sportsDBTeam.strCountry || 'Unknown',
    country: sportsDBTeam.strCountry || 'Unknown',
    logo:
      sportsDBTeam.strBadge ||
      sportsDBTeam.strLogo ||
      sportsDBTeam.strTeamBadge ||
      sportsDBTeam.strTeamLogo ||
      '',
    badge: sportsDBTeam.strBadge || sportsDBTeam.strTeamBadge,
    banner: sportsDBTeam.strBanner || sportsDBTeam.strTeamBanner,
    fanart: sportsDBTeam.strFanart1 || sportsDBTeam.strBanner, // Image de fond (priorité fanart1)
    equipment: sportsDBTeam.strEquipment, // Maillot
    stadiumThumb: sportsDBTeam.strStadiumThumb, // Image du stade
    primaryColor: colors.primary,
    secondaryColor: colors.secondary,
    founded,
    arena: sportsDBTeam.strStadium || 'Unknown Arena',
    capacity: capacity || 10000,
    coach: 'TBD', // TheSportsDB ne fournit pas toujours le coach
    championships: 0, // À calculer séparément ou via une autre source
    description: sportsDBTeam.strDescriptionEN || sportsDBTeam.strDescriptionFR,
    website: sportsDBTeam.strWebsite,
    social: {
      facebook: sportsDBTeam.strFacebook,
      twitter: sportsDBTeam.strTwitter,
      instagram: sportsDBTeam.strInstagram,
      youtube: sportsDBTeam.strYoutube,
    },
  };
}

// Normaliser un joueur TheSportsDB vers notre format
export function normalizePlayer(sportsDBPlayer: SportsDBPlayer): Player {
  // Position mapping (TheSportsDB peut utiliser des termes différents)
  const positionMap: Record<string, string> = {
    Guard: 'G',
    'Point Guard': 'PG',
    'Shooting Guard': 'SG',
    Forward: 'F',
    'Small Forward': 'SF',
    'Power Forward': 'PF',
    Center: 'C',
  };

  const position =
    positionMap[sportsDBPlayer.strPosition || ''] || sportsDBPlayer.strPosition || 'Unknown';

  return {
    id: sportsDBPlayer.idPlayer,
    name: sportsDBPlayer.strPlayer,
    teamId: sportsDBPlayer.idTeam,
    teamName: sportsDBPlayer.strTeam,
    position,
    height: sportsDBPlayer.strHeight,
    weight: sportsDBPlayer.strWeight,
    nationality: sportsDBPlayer.strNationality || 'Unknown',
    dateOfBirth: sportsDBPlayer.dateBorn,
    college: sportsDBPlayer.strCollege,
    imageUrl: sportsDBPlayer.strThumb || sportsDBPlayer.strCutout,
    cutout: sportsDBPlayer.strCutout,
    description: sportsDBPlayer.strDescriptionEN || sportsDBPlayer.strDescriptionFR,
  };
}

// Normaliser un événement/match TheSportsDB vers notre format
export function normalizeMatch(
  sportsDBEvent: SportsDBEvent,
  teamsMap?: Map<string, { logo: string }>
): Match {
  const homeScore = sportsDBEvent.intHomeScore ? parseInt(sportsDBEvent.intHomeScore, 10) : null;
  const awayScore = sportsDBEvent.intAwayScore ? parseInt(sportsDBEvent.intAwayScore, 10) : null;

  // Déterminer le statut du match
  let status: 'scheduled' | 'live' | 'finished' | 'postponed' = 'scheduled';
  if (sportsDBEvent.strPostponed === 'yes') {
    status = 'postponed';
  } else if (sportsDBEvent.strStatus === 'FT' || (homeScore !== null && awayScore !== null)) {
    status = 'finished';
  } else if (sportsDBEvent.strStatus && sportsDBEvent.strStatus !== 'NS') {
    status = 'live';
  }

  // Parser la date et l'heure
  const dateEvent = sportsDBEvent.dateEvent || new Date().toISOString().split('T')[0];
  const time = sportsDBEvent.strTime || sportsDBEvent.strTimeLocal || '20:00';

  // Récupérer les logos depuis la map des équipes ou utiliser placeholder
  const homeTeamLogo =
    teamsMap?.get(sportsDBEvent.idHomeTeam)?.logo ||
    sportsDBEvent.strHomeTeamBadge ||
    '/images/team-placeholder.png';
  const awayTeamLogo =
    teamsMap?.get(sportsDBEvent.idAwayTeam)?.logo ||
    sportsDBEvent.strAwayTeamBadge ||
    '/images/team-placeholder.png';

  return {
    id: sportsDBEvent.idEvent,
    homeTeamId: sportsDBEvent.idHomeTeam,
    awayTeamId: sportsDBEvent.idAwayTeam,
    homeTeamName: sportsDBEvent.strHomeTeam,
    awayTeamName: sportsDBEvent.strAwayTeam,
    homeTeamLogo,
    awayTeamLogo,
    homeScore,
    awayScore,
    date: dateEvent,
    time: time.substring(0, 5), // Format HH:MM
    venue: sportsDBEvent.strVenue || 'TBD',
    city: sportsDBEvent.strCity,
    country: sportsDBEvent.strCountry,
    status,
    attendance: sportsDBEvent.intSpectators ? parseInt(sportsDBEvent.intSpectators, 10) : undefined,
    season: sportsDBEvent.strSeason,
    round: sportsDBEvent.intRound ? parseInt(sportsDBEvent.intRound, 10) : undefined,
    thumbnail: sportsDBEvent.strThumb || sportsDBEvent.strSquare,
    video: sportsDBEvent.strVideo,
  };
}
