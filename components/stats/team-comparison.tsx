'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { Team, Match } from '@/lib/types';
import type { TeamStats } from '@/lib/utils/stats';
import { calculateHeadToHead } from '@/lib/utils/stats';
import { ArrowRight, Trophy, Target } from 'lucide-react';
import Image from 'next/image';
import { AnimatedSection, AnimatedGrid } from '@/components/animated-components';

interface Props {
  teams: Team[];
  matches: Match[];
  teamStats: TeamStats[];
}

export function TeamComparison({ teams, matches, teamStats }: Props) {
  const [team1Id, setTeam1Id] = useState(teams[0]?.id || '');
  const [team2Id, setTeam2Id] = useState(teams[1]?.id || '');

  const team1 = teams.find((t) => t.id === team1Id);
  const team2 = teams.find((t) => t.id === team2Id);
  const stats1 = teamStats.find((s) => s.teamId === team1Id);
  const stats2 = teamStats.find((s) => s.teamId === team2Id);

  const h2h = team1 && team2 ? calculateHeadToHead(team1Id, team2Id, matches) : null;

  // Données pour le radar chart
  const radarData =
    stats1 && stats2
      ? [
          {
            category: 'Taux victoire',
            [team1?.name || 'Team 1']: stats1.winRate,
            [team2?.name || 'Team 2']: stats2.winRate,
          },
          {
            category: 'Pts marqués',
            [team1?.name || 'Team 1']: (stats1.averagePointsScored / 120) * 100,
            [team2?.name || 'Team 2']: (stats2.averagePointsScored / 120) * 100,
          },
          {
            category: 'Défense',
            [team1?.name || 'Team 1']: 100 - (stats1.averagePointsConceded / 120) * 100,
            [team2?.name || 'Team 2']: 100 - (stats2.averagePointsConceded / 120) * 100,
          },
          {
            category: 'Domicile',
            [team1?.name || 'Team 1']:
              stats1.homeRecord.wins + stats1.homeRecord.losses > 0
                ? (stats1.homeRecord.wins / (stats1.homeRecord.wins + stats1.homeRecord.losses)) *
                  100
                : 0,
            [team2?.name || 'Team 2']:
              stats2.homeRecord.wins + stats2.homeRecord.losses > 0
                ? (stats2.homeRecord.wins / (stats2.homeRecord.wins + stats2.homeRecord.losses)) *
                  100
                : 0,
          },
          {
            category: 'Extérieur',
            [team1?.name || 'Team 1']:
              stats1.awayRecord.wins + stats1.awayRecord.losses > 0
                ? (stats1.awayRecord.wins / (stats1.awayRecord.wins + stats1.awayRecord.losses)) *
                  100
                : 0,
            [team2?.name || 'Team 2']:
              stats2.awayRecord.wins + stats2.awayRecord.losses > 0
                ? (stats2.awayRecord.wins / (stats2.awayRecord.wins + stats2.awayRecord.losses)) *
                  100
                : 0,
          },
        ]
      : [];

  // Données head to head
  const h2hChartData = h2h
    ? [
        {
          name: 'Victoires',
          [team1?.name || 'Team 1']: h2h.team1Wins,
          [team2?.name || 'Team 2']: h2h.team2Wins,
        },
        {
          name: 'Score moyen',
          [team1?.name || 'Team 1']: h2h.averageScoreTeam1,
          [team2?.name || 'Team 2']: h2h.averageScoreTeam2,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Team Selectors */}
      <AnimatedSection animation="fadeUp" delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle>Sélectionner les équipes à comparer</CardTitle>
            <CardDescription>
              Choisissez deux équipes pour voir leurs statistiques côte à côte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <Select value={team1Id} onValueChange={setTeam1Id}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id} disabled={team.id === team2Id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex justify-center">
                <div className="p-2 bg-orange-500/10 rounded-full">
                  <ArrowRight className="h-6 w-6 text-orange-600" />
                </div>
              </div>

              <Select value={team2Id} onValueChange={setTeam2Id}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id} disabled={team.id === team1Id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Team Headers */}
      {team1 && team2 && (
        <AnimatedGrid variant="flip" stagger={0.2} className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-24 h-24">
                  <Image src={team1.logo} alt={team1.name} fill className="object-contain" />
                </div>
                <h3 className="text-xl font-bold text-center">{team1.name}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-3">
                <div className="relative w-24 h-24">
                  <Image src={team2.logo} alt={team2.name} fill className="object-contain" />
                </div>
                <h3 className="text-xl font-bold text-center">{team2.name}</h3>
              </div>
            </CardContent>
          </Card>
        </AnimatedGrid>
      )}

      {/* Radar Chart */}
      {stats1 && stats2 && (
        <AnimatedSection animation="fadeUp" delay={0.3}>
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Comparaison Radar
            </CardTitle>
            <CardDescription>Vue globale des performances</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  name={team1?.name}
                  dataKey={team1?.name || 'Team 1'}
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.6}
                />
                <Radar
                  name={team2?.name}
                  dataKey={team2?.name || 'Team 2'}
                  stroke="#dc2626"
                  fill="#dc2626"
                  fillOpacity={0.6}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        </AnimatedSection>
      )}

      {/* Stats Comparison */}
      {stats1 && stats2 && (
        <AnimatedSection animation="fadeLeft" delay={0.4}>
          <Card>
          <CardHeader>
            <CardTitle>Statistiques Détaillées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="font-semibold">{team1?.name}</div>
                <div className="text-muted-foreground">Statistique</div>
                <div className="font-semibold">{team2?.name}</div>
              </div>

              {[
                { label: 'Matchs joués', val1: stats1.played, val2: stats2.played },
                { label: 'Victoires', val1: stats1.wins, val2: stats2.wins },
                { label: 'Défaites', val1: stats1.losses, val2: stats2.losses },
                {
                  label: 'Taux de victoire',
                  val1: `${stats1.winRate.toFixed(1)}%`,
                  val2: `${stats2.winRate.toFixed(1)}%`,
                },
                {
                  label: 'Pts marqués (moy)',
                  val1: stats1.averagePointsScored.toFixed(1),
                  val2: stats2.averagePointsScored.toFixed(1),
                },
                {
                  label: 'Pts encaissés (moy)',
                  val1: stats1.averagePointsConceded.toFixed(1),
                  val2: stats2.averagePointsConceded.toFixed(1),
                },
                {
                  label: 'Différence',
                  val1:
                    stats1.pointsDifference > 0
                      ? `+${stats1.pointsDifference}`
                      : stats1.pointsDifference,
                  val2:
                    stats2.pointsDifference > 0
                      ? `+${stats2.pointsDifference}`
                      : stats2.pointsDifference,
                },
              ].map((stat, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-4 py-2 border-b text-center">
                  <div className="font-mono">{stat.val1}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <div className="font-mono">{stat.val2}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </AnimatedSection>
      )}

      {/* Head to Head */}
      {h2h && h2h.totalMatches > 0 && (
        <AnimatedSection animation="fadeRight" delay={0.5}>
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-orange-600" />
              Face à Face
            </CardTitle>
            <CardDescription>{h2h.totalMatches} confrontations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={h2hChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey={team1?.name || 'Team 1'} fill="#f97316" />
                <Bar dataKey={team2?.name || 'Team 2'} fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>

            {h2h.lastMeetings.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Derniers matchs</h4>
                <div className="space-y-2">
                  {h2h.lastMeetings.map((meeting, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <span className="text-sm">
                        {new Date(meeting.date).toLocaleDateString('fr-FR')}
                      </span>
                      <div className="flex items-center gap-2 font-mono">
                        <span
                          className={meeting.winner === 'Team 1' ? 'font-bold text-orange-600' : ''}
                        >
                          {meeting.team1Score}
                        </span>
                        <span className="text-muted-foreground">-</span>
                        <span
                          className={meeting.winner === 'Team 2' ? 'font-bold text-red-600' : ''}
                        >
                          {meeting.team2Score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        </AnimatedSection>
      )}
    </div>
  );
}
