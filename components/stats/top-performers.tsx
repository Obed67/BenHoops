'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TeamStats } from '@/lib/utils/stats';
import type { Match } from '@/lib/types';
import { Trophy, TrendingUp, Flame, Shield } from 'lucide-react';
import { AnimatedGrid } from '@/components/animated-components';

interface Props {
  teamStats: TeamStats[];
  matches: Match[];
}

export function TopPerformers({ teamStats }: Props) {
  // Trier par différentes métriques
  const bestOffense = [...teamStats]
    .sort((a, b) => b.averagePointsScored - a.averagePointsScored)
    .slice(0, 5);
  const bestDefense = [...teamStats]
    .sort((a, b) => a.averagePointsConceded - b.averagePointsConceded)
    .slice(0, 5);
  const bestHomeRecord = [...teamStats]
    .sort((a, b) => {
      const aRate = a.homeRecord.wins / (a.homeRecord.wins + a.homeRecord.losses || 1);
      const bRate = b.homeRecord.wins / (b.homeRecord.wins + b.homeRecord.losses || 1);
      return bRate - aRate;
    })
    .slice(0, 5);
  const hotStreaks = [...teamStats]
    .filter((s) => s.currentStreak.type === 'W' && s.currentStreak.count >= 2)
    .sort((a, b) => b.currentStreak.count - a.currentStreak.count)
    .slice(0, 5);

  return (
    <AnimatedGrid variant="wave" stagger={0.12} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Best Offense */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            Meilleures Attaques
          </CardTitle>
          <CardDescription>Moyenne de points marqués par match</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bestOffense.map((team, idx) => (
              <div
                key={team.teamId}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      idx === 0
                        ? 'bg-yellow-500'
                        : idx === 1
                        ? 'bg-gray-400'
                        : idx === 2
                        ? 'bg-orange-700'
                        : 'bg-muted'
                    }`}
                  >
                    <span className="text-sm font-bold text-white">{idx + 1}</span>
                  </div>
                  <div>
                    <div className="font-semibold">{team.teamName}</div>
                    <div className="text-xs text-muted-foreground">{team.played} matchs</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">
                    {team.averagePointsScored.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">pts/match</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Defense */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Meilleures Défenses
          </CardTitle>
          <CardDescription>Moins de points encaissés par match</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bestDefense.map((team, idx) => (
              <div
                key={team.teamId}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      idx === 0
                        ? 'bg-yellow-500'
                        : idx === 1
                        ? 'bg-gray-400'
                        : idx === 2
                        ? 'bg-orange-700'
                        : 'bg-muted'
                    }`}
                  >
                    <span className="text-sm font-bold text-white">{idx + 1}</span>
                  </div>
                  <div>
                    <div className="font-semibold">{team.teamName}</div>
                    <div className="text-xs text-muted-foreground">{team.played} matchs</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {team.averagePointsConceded.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">pts encaissés</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Home Record */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-green-600" />
            Forteresses à Domicile
          </CardTitle>
          <CardDescription>Meilleures performances à domicile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bestHomeRecord.map((team, idx) => {
              const homeWinRate =
                (team.homeRecord.wins / (team.homeRecord.wins + team.homeRecord.losses || 1)) * 100;
              return (
                <div
                  key={team.teamId}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        idx === 0
                          ? 'bg-yellow-500'
                          : idx === 1
                          ? 'bg-gray-400'
                          : idx === 2
                          ? 'bg-orange-700'
                          : 'bg-muted'
                      }`}
                    >
                      <span className="text-sm font-bold text-white">{idx + 1}</span>
                    </div>
                    <div>
                      <div className="font-semibold">{team.teamName}</div>
                      <div className="text-xs text-muted-foreground">
                        {team.homeRecord.wins}V - {team.homeRecord.losses}D
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {homeWinRate.toFixed(0)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Hot Streaks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-red-600" />
            Séries en Cours
          </CardTitle>
          <CardDescription>Équipes sur une série de victoires</CardDescription>
        </CardHeader>
        <CardContent>
          {hotStreaks.length > 0 ? (
            <div className="space-y-3">
              {hotStreaks.map((team) => (
                <div
                  key={team.teamId}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Flame className="h-6 w-6 text-red-500" />
                    <div>
                      <div className="font-semibold">{team.teamName}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {team.lastFiveGames.map((result, idx) => (
                          <Badge
                            key={idx}
                            variant={result === 'W' ? 'default' : 'secondary'}
                            className={result === 'W' ? 'bg-green-600' : 'bg-red-600'}
                          >
                            {result}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">
                      {team.currentStreak.count}
                    </div>
                    <div className="text-xs text-muted-foreground">victoires</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucune série de victoires en cours (minimum 2 victoires consécutives)
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedGrid>
  );
}
