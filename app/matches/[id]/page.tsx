import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAllNBAMatches } from '@/lib/api/sportsdb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Trophy,
  TrendingUp,
  Users,
  Tv,
  Video,
  User,
} from 'lucide-react';

interface MatchPageProps {
  params: {
    id: string;
  };
}

// Limiter le nombre de pages statiques générées pour éviter l'erreur 429
// Génère uniquement les 5 derniers matchs pendant le build
// Les autres matchs seront générés à la demande (ISR)
export async function generateStaticParams() {
  try {
    const matches = await getAllNBAMatches();

    // Ne pré-générer que les 5 derniers matchs pour éviter l'erreur 429
    const recentMatches = matches
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return recentMatches.map((match) => ({
      id: match.id,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

// ISR - Revalidation toutes les heures
export const revalidate = 3600;

// Générer dynamiquement les pages qui ne sont pas pré-générées
export const dynamicParams = true;

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const matches = await getAllNBAMatches();
  const match = matches.find((m) => m.id === params.id);

  if (!match) {
    return {
      title: 'Match non trouvé',
    };
  }

  return {
    title: `${match.homeTeamName} vs ${match.awayTeamName} - NBA`,
    description: `Statistiques et détails du match ${match.homeTeamName} contre ${match.awayTeamName}`,
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const matches = await getAllNBAMatches();
  const match = matches.find((m) => m.id === params.id);

  if (!match) {
    notFound();
  }

  const matchDate = new Date(match.date);
  const isFinished = match.status === 'finished';
  const isLive = match.status === 'live';
  const homeWon = isFinished && (match.homeScore ?? 0) > (match.awayScore ?? 0);
  const awayWon = isFinished && (match.awayScore ?? 0) > (match.homeScore ?? 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-orange-50/20 dark:via-orange-950/10 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Bouton retour */}
        <Link href="/schedule">
          <Button
            variant="ghost"
            className="mb-6 text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 hover:bg-orange-500/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au calendrier
          </Button>
        </Link>

        {/* Header du match */}
        <Card className="mb-8 overflow-hidden border-orange-200/20 dark:border-orange-900/20">
          <div className="relative h-3 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500"></div>

          <CardContent className="p-6 sm:p-8 md:p-12">
            {/* Status et Date */}
            <div className="mb-8 flex items-center justify-center gap-4 flex-wrap">
              <Badge
                variant={isLive ? 'default' : isFinished ? 'secondary' : 'outline'}
                className={`text-sm ${
                  isLive
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white animate-pulse shadow-lg shadow-orange-500/50'
                    : isFinished
                    ? 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20'
                    : 'border-orange-500/30 text-orange-600 dark:text-orange-500'
                }`}
              >
                {isLive ? (
                  <span className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    EN DIRECT
                  </span>
                ) : isFinished ? (
                  'MATCH TERMINÉ'
                ) : (
                  'À VENIR'
                )}
              </Badge>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-500" />
                {format(matchDate, 'EEEE dd MMMM yyyy', { locale: fr })}
              </div>

              {match.time && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-orange-600 dark:text-orange-500" />
                  {match.time}
                </div>
              )}
            </div>

            {/* Score principal */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-8 md:gap-16 max-w-4xl mx-auto">
              {/* Équipe domicile */}
              <Link href={`/teams/${match.homeTeamId}`}>
                <div
                  className={`flex flex-col items-center space-y-4 transition-all duration-300 group ${
                    homeWon ? 'scale-105' : awayWon ? 'opacity-60' : ''
                  }`}
                >
                  <div className="relative">
                    <div
                      className={`absolute inset-0 rounded-full blur-2xl transition-opacity ${
                        homeWon ? 'bg-orange-500/40 opacity-100' : 'opacity-0'
                      }`}
                    ></div>
                    <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-4 md:p-5 ring-4 ring-orange-200 dark:ring-orange-900/30 group-hover:ring-orange-400 dark:group-hover:ring-orange-600 transition-all">
                      <Image
                        src={match.homeTeamLogo}
                        alt={`${match.homeTeamName} logo`}
                        fill
                        sizes="(max-width: 768px) 128px, 160px"
                        className="object-contain p-1"
                      />
                    </div>
                    {homeWon && (
                      <div className="absolute -top-2 -right-2 h-10 w-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-xl">
                        <Trophy className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl md:text-2xl font-black text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors">
                      {match.homeTeamName}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Domicile</p>
                  </div>
                </div>
              </Link>

              {/* Score */}
              <div className="flex flex-col items-center justify-center min-w-[120px]">
                {isFinished || isLive ? (
                  <div className="flex items-center justify-center gap-4 md:gap-6">
                    <span
                      className={`text-5xl md:text-7xl font-black tabular-nums ${
                        homeWon ? 'text-orange-600 dark:text-orange-500' : 'text-foreground'
                      }`}
                    >
                      {match.homeScore}
                    </span>
                    <span className="text-3xl md:text-5xl font-bold text-muted-foreground">-</span>
                    <span
                      className={`text-5xl md:text-7xl font-black tabular-nums ${
                        awayWon ? 'text-orange-600 dark:text-orange-500' : 'text-foreground'
                      }`}
                    >
                      {match.awayScore}
                    </span>
                  </div>
                ) : (
                  <div className="relative py-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 blur-xl opacity-20"></div>
                    <span className="relative text-4xl md:text-6xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 dark:from-orange-500 dark:via-red-500 dark:to-orange-500 bg-clip-text text-transparent">
                      VS
                    </span>
                  </div>
                )}
              </div>

              {/* Équipe extérieure */}
              <Link href={`/teams/${match.awayTeamId}`}>
                <div
                  className={`flex flex-col items-center space-y-4 transition-all duration-300 group ${
                    awayWon ? 'scale-105' : homeWon ? 'opacity-60' : ''
                  }`}
                >
                  <div className="relative">
                    <div
                      className={`absolute inset-0 rounded-full blur-2xl transition-opacity ${
                        awayWon ? 'bg-orange-500/40 opacity-100' : 'opacity-0'
                      }`}
                    ></div>
                    <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-4 md:p-5 ring-4 ring-orange-200 dark:ring-orange-900/30 group-hover:ring-orange-400 dark:group-hover:ring-orange-600 transition-all">
                      <Image
                        src={match.awayTeamLogo}
                        alt={`${match.awayTeamName} logo`}
                        fill
                        sizes="(max-width: 768px) 128px, 160px"
                        className="object-contain p-1"
                      />
                    </div>
                    {awayWon && (
                      <div className="absolute -top-2 -right-2 h-10 w-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-xl">
                        <Trophy className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl md:text-2xl font-black text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors">
                      {match.awayTeamName}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Extérieur</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Venue */}
            {match.venue && (
              <div className="mt-8 pt-6 border-t border-orange-200/30 dark:border-orange-900/30 flex items-center justify-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                <span className="text-lg font-semibold">{match.venue}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistiques du match */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="border-orange-200/20 dark:border-orange-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-500">
                <TrendingUp className="h-5 w-5" />
                Informations du match
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-orange-200/20 dark:border-orange-900/20">
                <span className="text-muted-foreground">Statut</span>
                <span className="font-bold">
                  {isLive ? 'En direct' : isFinished ? 'Terminé' : 'À venir'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-orange-200/20 dark:border-orange-900/20">
                <span className="text-muted-foreground">Date</span>
                <span className="font-bold">{format(matchDate, 'dd/MM/yyyy', { locale: fr })}</span>
              </div>
              {match.time && (
                <div className="flex justify-between items-center py-2 border-b border-orange-200/20 dark:border-orange-900/20">
                  <span className="text-muted-foreground">Heure</span>
                  <span className="font-bold">{match.time}</span>
                </div>
              )}
              {match.season && (
                <div className="flex justify-between items-center py-2 border-b border-orange-200/20 dark:border-orange-900/20">
                  <span className="text-muted-foreground">Saison</span>
                  <span className="font-bold">{match.season}</span>
                </div>
              )}
              {match.round && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Round</span>
                  <span className="font-bold">{match.round}</span>
                </div>
              )}
              {match.venue && !match.city && !match.country && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Lieu</span>
                  <span className="font-bold">{match.venue}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-orange-200/20 dark:border-orange-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-500">
                <MapPin className="h-5 w-5" />
                Lieu & Ambiance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {match.venue && (
                <div className="flex justify-between items-center py-2 border-b border-orange-200/20 dark:border-orange-900/20">
                  <span className="text-muted-foreground">Salle</span>
                  <span className="font-bold">{match.venue}</span>
                </div>
              )}
              {match.city && (
                <div className="flex justify-between items-center py-2 border-b border-orange-200/20 dark:border-orange-900/20">
                  <span className="text-muted-foreground">Ville</span>
                  <span className="font-bold">{match.city}</span>
                </div>
              )}
              {match.country && (
                <div className="flex justify-between items-center py-2 border-b border-orange-200/20 dark:border-orange-900/20">
                  <span className="text-muted-foreground">Pays</span>
                  <span className="font-bold">{match.country}</span>
                </div>
              )}
              {match.attendance && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Spectateurs
                  </span>
                  <span className="font-bold text-orange-600 dark:text-orange-500">
                    {match.attendance.toLocaleString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-orange-200/20 dark:border-orange-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-500">
                <Tv className="h-5 w-5" />
                Diffusion & Arbitrage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {match.tvStation && (
                <div className="flex justify-between items-center py-2 border-b border-orange-200/20 dark:border-orange-900/20">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Tv className="h-4 w-4" />
                    Chaîne TV
                  </span>
                  <span className="font-bold">{match.tvStation}</span>
                </div>
              )}
              {match.official && (
                <div className="flex justify-between items-center py-2 border-b border-orange-200/20 dark:border-orange-900/20">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Arbitre
                  </span>
                  <span className="font-bold">{match.official}</span>
                </div>
              )}
              {match.video && (
                <div className="py-2">
                  <a
                    href={match.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 font-semibold transition-colors"
                  >
                    <Video className="h-4 w-4" />
                    Voir la vidéo
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Image du match si disponible */}
        {(match.thumbnail || match.fanart || match.poster) && (
          <Card className="mb-8 overflow-hidden border-orange-200/20 dark:border-orange-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-500">
                <TrendingUp className="h-5 w-5" />
                Aperçu du match
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full h-64 md:h-96">
                <Image
                  src={match.thumbnail || match.fanart || match.poster || ''}
                  alt={`${match.homeTeamName} vs ${match.awayTeamName}`}
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Résultat final (si terminé) */}
        {isFinished && (
          <Card className="border-orange-200/20 dark:border-orange-900/20 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-500">
                <Trophy className="h-5 w-5" />
                Résultat final
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-orange-200/20 dark:border-orange-900/20">
                <span className="text-muted-foreground">{match.homeTeamName}</span>
                <span
                  className={`text-2xl font-black ${
                    homeWon ? 'text-orange-600 dark:text-orange-500' : ''
                  }`}
                >
                  {match.homeScore}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-orange-200/20 dark:border-orange-900/20">
                <span className="text-muted-foreground">{match.awayTeamName}</span>
                <span
                  className={`text-2xl font-black ${
                    awayWon ? 'text-orange-600 dark:text-orange-500' : ''
                  }`}
                >
                  {match.awayScore}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Vainqueur</span>
                <span className="font-black text-orange-600 dark:text-orange-500">
                  {homeWon ? match.homeTeamName : match.awayTeamName}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href={`/teams/${match.homeTeamId}`}>
            <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg shadow-orange-500/50">
              Voir {match.homeTeamName}
            </Button>
          </Link>
          <Link href={`/teams/${match.awayTeamId}`}>
            <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg shadow-orange-500/50">
              Voir {match.awayTeamName}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
