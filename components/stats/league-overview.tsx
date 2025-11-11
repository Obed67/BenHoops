'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { LeagueStats, TeamStats } from '@/lib/utils/stats';
import { Trophy, TrendingDown } from 'lucide-react';
import { AnimatedGrid } from '@/components/animated-components';

interface Props {
  leagueStats: LeagueStats;
  topTeams: TeamStats[];
  bottomTeams: TeamStats[];
}

const COLORS = ['#f97316', '#dc2626', '#ea580c', '#f59e0b', '#fb923c'];

export function LeagueOverview({ leagueStats, topTeams, bottomTeams }: Props) {
  // Données pour le graphique top scorers
  const topScorersData = leagueStats.topScorers.map((team) => ({
    name: team.team.length > 15 ? team.team.substring(0, 13) + '...' : team.team,
    points: parseFloat(team.averagePoints.toFixed(1)),
  }));

  // Données pour le graphique top/bottom teams
  const topTeamsData = topTeams.map((team) => ({
    name: team.teamName.length > 15 ? team.teamName.substring(0, 13) + '...' : team.teamName,
    'Taux de victoire': parseFloat(team.winRate.toFixed(1)),
  }));

  const bottomTeamsData = bottomTeams.map((team) => ({
    name: team.teamName.length > 15 ? team.teamName.substring(0, 13) + '...' : team.teamName,
    'Taux de victoire': parseFloat(team.winRate.toFixed(1)),
  }));

  return (
    <AnimatedGrid variant="cascade" stagger={0.15} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Scorers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-orange-600" />
            Top 10 Meilleures Attaques
          </CardTitle>
          <CardDescription>Moyenne de points marqués par match</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topScorersData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="points" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Teams Win Rate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-green-600" />
            Top 5 Meilleures Équipes
          </CardTitle>
          <CardDescription>Taux de victoire (%)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topTeamsData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="Taux de victoire" fill="#16a34a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bottom Teams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            Bottom 5 Équipes
          </CardTitle>
          <CardDescription>Taux de victoire (%)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={bottomTeamsData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="Taux de victoire" fill="#dc2626" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Records Card */}
      <Card>
        <CardHeader>
          <CardTitle>Records de la Saison</CardTitle>
          <CardDescription>Faits marquants 2024-2025</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-l-4 border-orange-500 pl-4">
            <div className="text-sm text-muted-foreground">Plus haut score</div>
            <div className="text-2xl font-bold text-orange-600">
              {leagueStats.highestScore.score} pts
            </div>
            <div className="text-sm">{leagueStats.highestScore.team}</div>
            <div className="text-xs text-muted-foreground">
              {new Date(leagueStats.highestScore.date).toLocaleDateString('fr-FR')}
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <div className="text-sm text-muted-foreground">Plus grande victoire</div>
            <div className="text-2xl font-bold text-green-600">
              +{leagueStats.biggestWin.margin} pts
            </div>
            <div className="text-sm">
              {leagueStats.biggestWin.winner} vs {leagueStats.biggestWin.loser}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(leagueStats.biggestWin.date).toLocaleDateString('fr-FR')}
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <div className="text-sm text-muted-foreground">Score moyen par équipe</div>
            <div className="text-2xl font-bold text-blue-600">
              {leagueStats.averageScore.toFixed(1)} pts
            </div>
            <div className="text-sm">Sur {leagueStats.totalGames} matchs</div>
          </div>

          {leagueStats.lowestScore.score < 999 && (
            <div className="border-l-4 border-slate-500 pl-4">
              <div className="text-sm text-muted-foreground">Plus bas score</div>
              <div className="text-2xl font-bold text-slate-600">
                {leagueStats.lowestScore.score} pts
              </div>
              <div className="text-sm">{leagueStats.lowestScore.team}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(leagueStats.lowestScore.date).toLocaleDateString('fr-FR')}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedGrid>
  );
}
