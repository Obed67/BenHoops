// Types pour l'API TheSportsDB - NBA (National Basketball Association)

// ============================================
// TYPES DE RÉPONSE API THESPORTSDB
// ============================================

export interface SportsDBTeam {
  idTeam: string;
  strTeam: string;
  strTeamShort?: string;
  strAlternate?: string;
  intFormedYear?: string;
  strSport: string;
  strLeague: string;
  idLeague?: string;
  strDivision?: string;
  strStadium?: string;
  strStadiumThumb?: string;
  strStadiumDescription?: string;
  strStadiumLocation?: string;
  intStadiumCapacity?: string;
  strWebsite?: string;
  strFacebook?: string;
  strTwitter?: string;
  strInstagram?: string;
  strDescriptionEN?: string;
  strDescriptionFR?: string;
  strGender?: string;
  strCountry?: string;
  strBadge?: string; // Badge/logo de l'équipe
  strLogo?: string; // Logo alternatif
  strBanner?: string; // Bannière de l'équipe
  strTeamBadge?: string;
  strTeamJersey?: string;
  strTeamLogo?: string;
  strTeamFanart1?: string;
  strTeamFanart2?: string;
  strTeamFanart3?: string;
  strTeamFanart4?: string;
  strTeamBanner?: string;
  strYoutube?: string;
  strLocked: string;
  // Images pour background
  strFanart1?: string;
  strFanart2?: string;
  strFanart3?: string;
  strFanart4?: string;
  strEquipment?: string; // Maillot de l'équipe
}

export interface SportsDBPlayer {
  idPlayer: string;
  idTeam: string;
  idTeam2?: string;
  idTeamNational?: string;
  idSoccerXML?: string;
  idAPIfootball?: string;
  idPlayerManager?: string;
  strNationality?: string;
  strPlayer: string;
  strTeam?: string;
  strTeam2?: string;
  strSport: string;
  intSoccerXMLTeamID?: string;
  dateBorn?: string;
  dateSigned?: string;
  strSigning?: string;
  strWage?: string;
  strOutfitter?: string;
  strKit?: string;
  strAgent?: string;
  strBirthLocation?: string;
  strDescriptionEN?: string;
  strDescriptionFR?: string;
  strGender?: string;
  strSide?: string;
  strPosition?: string;
  strCollege?: string;
  strFacebook?: string;
  strWebsite?: string;
  strTwitter?: string;
  strInstagram?: string;
  strYoutube?: string;
  strHeight?: string;
  strWeight?: string;
  intLoved?: string;
  strThumb?: string;
  strCutout?: string;
  strRender?: string;
  strBanner?: string;
  strFanart1?: string;
  strFanart2?: string;
  strFanart3?: string;
  strFanart4?: string;
  strCreativeCommons?: string;
  strLocked: string;
}

export interface SportsDBEvent {
  idEvent: string;
  idSoccerXML?: string;
  idAPIfootball?: string;
  strEvent: string;
  strEventAlternate?: string;
  strFilename?: string;
  strSport: string;
  idLeague: string;
  strLeague: string;
  strSeason?: string;
  strDescriptionEN?: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore?: string;
  intRound?: string;
  intAwayScore?: string;
  intSpectators?: string;
  strOfficial?: string;
  strTimestamp?: string;
  dateEvent: string;
  dateEventLocal?: string;
  strTime?: string;
  strTimeLocal?: string;
  strTVStation?: string;
  idHomeTeam: string;
  idAwayTeam: string;
  strResult?: string;
  strVenue?: string;
  strCountry?: string;
  strCity?: string;
  strPoster?: string;
  strSquare?: string;
  strFanart?: string;
  strThumb?: string;
  strBanner?: string;
  strMap?: string;
  strTweet1?: string;
  strTweet2?: string;
  strTweet3?: string;
  strVideo?: string;
  strStatus?: string;
  strPostponed: string;
  strLocked: string;
  // Logos des équipes
  strHomeTeamBadge?: string;
  strAwayTeamBadge?: string;
  strThumbHomeTeam?: string;
  strThumbAwayTeam?: string;
}

export interface SportsDBTeamsResponse {
  teams: SportsDBTeam[] | null;
}

export interface SportsDBPlayersResponse {
  player: SportsDBPlayer[] | null;
}

export interface SportsDBEventsResponse {
  events: SportsDBEvent[] | null;
}

// ============================================
// TYPES NORMALISÉS POUR L'APPLICATION
// ============================================

export interface Team {
  id: string;
  name: string;
  shortName?: string;
  city: string;
  country: string;
  logo: string;
  badge?: string;
  banner?: string;
  fanart?: string; // Image de fond pour la card
  equipment?: string; // Maillot (pour page détails)
  stadiumThumb?: string; // Image du stade (pour page détails)
  primaryColor: string;
  secondaryColor: string;
  founded: number;
  arena: string;
  capacity: number;
  coach: string;
  championships: number; // Nombre de titres remportés
  description?: string;
  website?: string;
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  teamName?: string;
  number?: number;
  position: string;
  height?: string;
  weight?: string;
  nationality: string;
  dateOfBirth?: string;
  college?: string;
  imageUrl?: string;
  cutout?: string;
  description?: string;
  // Stats (peuvent être calculées séparément)
  points?: number;
  rebounds?: number;
  assists?: number;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  time: string;
  venue: string;
  city?: string;
  country?: string;
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
  attendance?: number;
  season?: string;
  round?: number;
  thumbnail?: string;
  video?: string;
}

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

// ============================================
// TYPES UTILITAIRES
// ============================================

export interface APIError {
  message: string;
  code?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

export interface FetchState<T> {
  data: T | null;
  status: FetchStatus;
  error: APIError | null;
  lastUpdated?: Date;
}
