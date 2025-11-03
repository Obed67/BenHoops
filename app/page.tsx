import Link from 'next/link';
import { fetchMatches, fetchTeams, fetchPlayers } from '@/lib/api/server';
import { REVALIDATE_TIME } from '@/lib/config/api';
import { MatchCard } from '@/components/cards/match-card';
import { TeamCard } from '@/components/cards/team-card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Users, Calendar } from 'lucide-react';

// ISR - Revalidation toutes les heures
export const revalidate = REVALIDATE_TIME.matches;

export default async function Home() {
  const [matches, teams, players] = await Promise.all([
    fetchMatches(),
    fetchTeams(),
    fetchPlayers(),
  ]);

  const recentMatches = matches.filter((m) => m.status === 'finished').slice(0, 3);
  const upcomingMatches = matches.filter((m) => m.status === 'scheduled').slice(0, 3);
  const featuredTeams = teams.slice(0, 4);
  const topPlayers = players
    .filter((p) => p.points !== undefined)
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 3);

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1
              className="mb-6 text-5xl font-bold tracking-tight md:text-7xl"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              NBA Stats & Live Scores
            </h1>
            <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
              Suivez la NBA en direct - Statistiques, classements et résultats en temps réel
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/schedule">
                <Button size="lg" className="text-lg">
                  Voir le calendrier
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/teams">
                <Button size="lg" variant="outline" className="text-lg">
                  Découvrir les équipes
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-1 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      <section className="border-b py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold">{teams.length}</h3>
              <p className="text-muted-foreground">Équipes professionnelles</p>
            </div>
            <div className="flex flex-col items-center space-y-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold">{matches.length}</h3>
              <p className="text-muted-foreground">Matchs cette saison</p>
            </div>
            <div className="flex flex-col items-center space-y-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold">{players.length}+</h3>
              <p className="text-muted-foreground">Joueurs professionnels</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Résultats récents</h2>
            <Link href="/schedule">
              <Button variant="ghost">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Prochains matchs</h2>
            <Link href="/schedule">
              <Button variant="ghost">
                Calendrier complet
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Équipes en vedette</h2>
            <Link href="/teams">
              <Button variant="ghost">
                Toutes les équipes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredTeams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-3xl font-bold">Meilleurs marqueurs</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {topPlayers.map((player, index) => {
              const team = teams.find((t) => t.id === player.teamId);
              return (
                <div
                  key={player.id}
                  className="flex items-center space-x-4 rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{player.name}</p>
                    <p className="text-sm text-muted-foreground">{team?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{player.points}</p>
                    <p className="text-xs text-muted-foreground">PTS/match</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
