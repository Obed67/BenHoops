import { getNBATeams, getAllNBAMatches } from '@/lib/api/sportsdb';
import { calculateLeagueStats, calculateTeamStats } from '@/lib/utils/stats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Trophy, Target, BarChart3 } from 'lucide-react';
import { LeagueOverview } from '@/components/stats/league-overview';
import { TeamComparison } from '@/components/stats/team-comparison';
import { TopPerformers } from '@/components/stats/top-performers';
import { StatsExportButtons } from '@/components/export/stats-export-buttons';
import { AnimatedSection, AnimatedGrid } from '@/components/animated-components';

// ISR - Revalidation toutes les heures
export const revalidate = 3600;

export const metadata = {
  title: 'Statistiques NBA - BenHoops',
  description:
    "Statistiques avancées NBA : comparaisons d'équipes, records, performances et analyses",
};

export default async function StatsPage() {
  const [teams, matches] = await Promise.all([getNBATeams(), getAllNBAMatches()]);

  const leagueStats = calculateLeagueStats(teams, matches);
  const teamStats = teams.map((team) => calculateTeamStats(team, matches));

  // Trier par taux de victoire
  const sortedTeams = teamStats.sort((a, b) => b.winRate - a.winRate);
  const topTeams = sortedTeams.slice(0, 5);
  const bottomTeams = sortedTeams.slice(-5).reverse();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <AnimatedSection animation="scale" delay={0.1}>
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 dark:from-orange-500 dark:via-red-500 dark:to-orange-500 bg-clip-text text-transparent">
                  Statistiques NBA
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Analyses avancées et comparaisons d'équipes
                </p>
              </div>
            </div>
            <div className="sm:self-start">
              <StatsExportButtons stats={teamStats} />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Quick Stats Cards */}
      <AnimatedGrid
        variant="zoom"
        stagger={0.1}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Total Matchs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{leagueStats.totalGames}</div>
            <p className="text-xs text-muted-foreground mt-1">Saison 2024-2025</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Score Moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{leagueStats.averageScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">Points par équipe</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Plus Haut Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-500">
              {leagueStats.highestScore.score}
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {leagueStats.highestScore.team}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Plus Grande Victoire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-500">
              +{leagueStats.biggestWin.margin}
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {leagueStats.biggestWin.winner}
            </p>
          </CardContent>
        </Card>
      </AnimatedGrid>

      {/* Main Content with Tabs */}
      <AnimatedSection animation="fadeUp" delay={0.4}>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="comparison">Comparaison</TabsTrigger>
            <TabsTrigger value="performers">Top Performances</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble de la ligue */}
          <TabsContent value="overview" className="space-y-6">
            <LeagueOverview
              leagueStats={leagueStats}
              topTeams={topTeams}
              bottomTeams={bottomTeams}
            />
          </TabsContent>

          {/* Comparaison d'équipes */}
          <TabsContent value="comparison" className="space-y-6">
            <TeamComparison teams={teams} matches={matches} teamStats={teamStats} />
          </TabsContent>

          {/* Top Performers */}
          <TabsContent value="performers" className="space-y-6">
            <TopPerformers teamStats={teamStats} matches={matches} />
          </TabsContent>
        </Tabs>
      </AnimatedSection>
    </div>
  );
}
