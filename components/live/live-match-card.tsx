'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Match } from '@/lib/types';
import Image from 'next/image';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  match: Match;
  autoRefresh?: boolean;
}

export function LiveMatchCard({ match: initialMatch, autoRefresh = false }: Props) {
  const [match, setMatch] = useState(initialMatch);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPaused, setIsPaused] = useState(!autoRefresh);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fonction pour rafraîchir les données du match depuis TheSportsDB API
  const refreshMatch = async () => {
    setIsRefreshing(true);
    try {
      // Appel direct à l'API TheSportsDB (pas de backend intermédiaire)
      const apiKey = process.env.NEXT_PUBLIC_SPORTSDB_API_KEY || '3';
      const response = await fetch(
        `https://www.thesportsdb.com/api/v1/json/${apiKey}/lookupevent.php?id=${match.id}`
      );

      if (response.ok) {
        const data = await response.json();

        // Vérifier si on a des données
        if (data.events && data.events.length > 0) {
          const eventData = data.events[0];

          // Mettre à jour le match avec les nouvelles données
          setMatch({
            ...match,
            homeScore: eventData.intHomeScore ? parseInt(eventData.intHomeScore) : null,
            awayScore: eventData.intAwayScore ? parseInt(eventData.intAwayScore) : null,
            status:
              eventData.strStatus === 'Match Finished'
                ? 'finished'
                : eventData.strStatus === 'In Progress'
                ? 'live'
                : 'scheduled',
          });
          setLastUpdate(new Date());
        }
      }
    } catch (error) {
      console.error('Erreur refresh match:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh toutes les 30 secondes
  useEffect(() => {
    if (!isPaused && match.status === 'live') {
      const interval = setInterval(() => {
        refreshMatch();
      }, 30000); // 30 secondes

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, match.status]);

  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all',
        isLive && 'border-2 border-red-500 shadow-lg shadow-red-500/20'
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isLive && (
              <Badge variant="destructive" className="animate-pulse">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-white animate-ping" />
                  <span>EN DIRECT</span>
                </div>
              </Badge>
            )}
            {isFinished && <Badge variant="secondary">TERMINÉ</Badge>}
            {match.status === 'scheduled' && <Badge variant="outline">À VENIR</Badge>}
          </div>

          {isLive && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPaused(!isPaused)}
                title={isPaused ? 'Reprendre auto-refresh' : 'Pause auto-refresh'}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={refreshMatch}
                disabled={isRefreshing}
                title="Rafraîchir maintenant"
              >
                <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
              </Button>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          {match.venue && `${match.venue} • `}
          {new Date(match.date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          {match.time && ` • ${match.time}`}
        </div>
      </CardHeader>

      <CardContent>
        {/* Teams and Scores */}
        <div className="space-y-4">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative w-12 h-12">
                <Image
                  src={match.homeTeamLogo}
                  alt={match.homeTeamName}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <div className="font-semibold">{match.homeTeamName}</div>
                <div className="text-xs text-muted-foreground">Domicile</div>
              </div>
            </div>
            <div
              className={cn(
                'text-4xl font-black',
                isLive && 'text-orange-600 dark:text-orange-500',
                isFinished &&
                  match.homeScore !== null &&
                  match.awayScore !== null &&
                  match.homeScore > match.awayScore &&
                  'text-green-600 dark:text-green-500'
              )}
            >
              {match.homeScore ?? '-'}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative w-12 h-12">
                <Image
                  src={match.awayTeamLogo}
                  alt={match.awayTeamName}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <div className="font-semibold">{match.awayTeamName}</div>
                <div className="text-xs text-muted-foreground">Extérieur</div>
              </div>
            </div>
            <div
              className={cn(
                'text-4xl font-black',
                isLive && 'text-orange-600 dark:text-orange-500',
                isFinished &&
                  match.homeScore !== null &&
                  match.awayScore !== null &&
                  match.awayScore > match.homeScore &&
                  'text-green-600 dark:text-green-500'
              )}
            >
              {match.awayScore ?? '-'}
            </div>
          </div>
        </div>

        {/* Live Indicator */}
        {isLive && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Dernière mise à jour : {lastUpdate.toLocaleTimeString('fr-FR')}
              </span>
              {!isPaused && (
                <span className="text-orange-600 dark:text-orange-500 flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-orange-600 animate-pulse" />
                  Mise à jour auto
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
