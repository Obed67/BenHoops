import type { Match } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MapPin, Clock } from 'lucide-react';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const matchDate = new Date(match.date);
  const isFinished = match.status === 'finished';
  const isLive = match.status === 'live';
  const homeWon = isFinished && (match.homeScore ?? 0) > (match.awayScore ?? 0);
  const awayWon = isFinished && (match.awayScore ?? 0) > (match.homeScore ?? 0);

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-xl hover:shadow-orange-500/10 border-orange-200/20 dark:border-orange-900/20 hover:border-orange-400/50 dark:hover:border-orange-600/50 duration-300">
      {/* Header avec gradient */}
      <div className="relative h-2 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500"></div>

      <CardContent className="p-6">
        {/* Status et Date */}
        <div className="mb-6 flex items-center justify-between">
          <Badge
            variant={isLive ? 'default' : isFinished ? 'secondary' : 'outline'}
            className={`${
              isLive
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white animate-pulse shadow-lg shadow-orange-500/50'
                : isFinished
                ? 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20'
                : 'border-orange-500/30 text-orange-600 dark:text-orange-500'
            }`}
          >
            {isLive ? (
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                EN DIRECT
              </span>
            ) : isFinished ? (
              'TERMINÉ'
            ) : (
              format(matchDate, 'dd MMM yyyy', { locale: fr }).toUpperCase()
            )}
          </Badge>

          {!isFinished && !isLive && (
            <div className="flex items-center gap-1.5 text-sm text-orange-600 dark:text-orange-500 font-semibold">
              <Clock className="h-4 w-4" />
              {match.time}
            </div>
          )}
        </div>

        {/* Équipes et Scores */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-8">
          {/* Équipe domicile */}
          <div
            className={`flex flex-col items-center space-y-4 transition-all duration-300 ${
              homeWon ? 'scale-105' : awayWon ? 'opacity-60' : ''
            }`}
          >
            <div className="relative">
              <div
                className={`absolute inset-0 rounded-full blur-xl transition-opacity ${
                  homeWon ? 'bg-orange-500/40 opacity-100' : 'opacity-0'
                }`}
              ></div>
              <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-3 ring-2 ring-orange-200 dark:ring-orange-900/30 group-hover:ring-orange-400 dark:group-hover:ring-orange-600 transition-all">
                <Image
                  src={match.homeTeamLogo}
                  alt={`${match.homeTeamName} logo`}
                  fill
                  sizes="96px"
                  className="object-contain p-1"
                />
              </div>
              {homeWon && (
                <div className="absolute -top-1 -right-1 h-7 w-7 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  ✓
                </div>
              )}
            </div>
            <p className="text-center text-sm font-bold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors line-clamp-2 max-w-[120px]">
              {match.homeTeamName}
            </p>
          </div>

          {/* Score ou VS - Centré verticalement */}
          <div className="flex flex-col items-center justify-center min-w-[100px] self-center">
            {isFinished || isLive ? (
              <div className="flex items-center justify-center gap-3">
                <span
                  className={`text-3xl font-black tabular-nums ${
                    homeWon ? 'text-orange-600 dark:text-orange-500' : 'text-foreground'
                  }`}
                >
                  {match.homeScore}
                </span>
                <span className="text-xl font-bold text-muted-foreground">-</span>
                <span
                  className={`text-3xl font-black tabular-nums ${
                    awayWon ? 'text-orange-600 dark:text-orange-500' : 'text-foreground'
                  }`}
                >
                  {match.awayScore}
                </span>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 blur-md opacity-20"></div>
                <span className="relative text-xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 dark:from-orange-500 dark:via-red-500 dark:to-orange-500 bg-clip-text text-transparent">
                  VS
                </span>
              </div>
            )}
          </div>

          {/* Équipe extérieure */}
          <div
            className={`flex flex-col items-center space-y-4 transition-all duration-300 ${
              awayWon ? 'scale-105' : homeWon ? 'opacity-60' : ''
            }`}
          >
            <div className="relative">
              <div
                className={`absolute inset-0 rounded-full blur-xl transition-opacity ${
                  awayWon ? 'bg-orange-500/40 opacity-100' : 'opacity-0'
                }`}
              ></div>
              <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-3 ring-2 ring-orange-200 dark:ring-orange-900/30 group-hover:ring-orange-400 dark:group-hover:ring-orange-600 transition-all">
                <Image
                  src={match.awayTeamLogo}
                  alt={`${match.awayTeamName} logo`}
                  fill
                  sizes="96px"
                  className="object-contain p-1"
                />
              </div>
              {awayWon && (
                <div className="absolute -top-1 -right-1 h-7 w-7 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  ✓
                </div>
              )}
            </div>
            <p className="text-center text-sm font-bold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors line-clamp-2 max-w-[120px]">
              {match.awayTeamName}
            </p>
          </div>
        </div>

        {/* Venue */}
        {match.venue && (
          <div className="mt-6 pt-4 border-t border-orange-200/30 dark:border-orange-900/30">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-orange-600 dark:text-orange-500" />
              <span>{match.venue}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
