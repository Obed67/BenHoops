import Link from 'next/link';
import { getAllNBAMatches, getNBATeams } from '@/lib/api/sportsdb';
import { MatchCard } from '@/components/cards/match-card';
import { TeamCard } from '@/components/cards/team-card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Users, Calendar } from 'lucide-react';

// ISR - Revalidation toutes les 5 minutes pour la homepage
export const revalidate = 300;

export default async function Home() {
  // Fetch parallèle avec ISR
  const [matches, teams] = await Promise.all([getAllNBAMatches(), getNBATeams()]);

  const recentMatches = matches.filter((m) => m.status === 'finished').slice(0, 3);
  const upcomingMatches = matches.filter((m) => m.status === 'scheduled').slice(0, 3);
  const featuredTeams = teams.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero Section - Dynamique et animé */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 dark:from-slate-950 dark:via-orange-950/20 dark:to-slate-950">
        {/* Animated background patterns */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            {/* Badge animé */}
            <div className="mb-8 flex justify-center animate-fade-in">
              <div className="inline-flex items-center space-x-2 rounded-full bg-orange-500/10 px-4 py-2 border border-orange-500/20 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                  SAISON 2024-2025 EN DIRECT
                </span>
              </div>
            </div>

            {/* Titre principal avec animations */}
            <div className="text-center mb-8 space-y-4">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white animate-fade-in-up">
                <span className="inline-block bg-gradient-to-r from-orange-500 via-red-600 to-orange-600 dark:from-orange-400 dark:via-red-500 dark:to-orange-500 bg-clip-text text-transparent animate-gradient">
                  NBA
                </span>
                <br />
                <span className="inline-block text-5xl md:text-7xl mt-2">Stats & Live Scores</span>
              </h1>

              <div className="flex items-center justify-center space-x-3 text-orange-600 dark:text-orange-400/80 animate-fade-in-up delay-200">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-500 dark:to-orange-400"></div>
                <span className="text-sm font-bold tracking-widest uppercase">
                  Basketball Analytics
                </span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-500 dark:to-orange-400"></div>
              </div>
            </div>

            {/* Description avec effet typewriter */}
            <p className="mb-10 text-xl md:text-2xl text-center text-slate-700 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in-up delay-300">
              Suivez la <span className="font-bold text-orange-600 dark:text-orange-400">NBA</span>{' '}
              en direct
              <span className="inline-block mx-2 text-2xl animate-bounce">🏀</span>
              Statistiques, classements et résultats en temps réel
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12 animate-fade-in-up delay-500">
              <Link href="/schedule">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-500/60 transition-all duration-300 hover:scale-105"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Voir le calendrier
                  <ArrowRight className="ml-2 h-5 w-5 animate-pulse" />
                </Button>
              </Link>
              <Link href="/teams">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2 border-orange-500/50 text-slate-900 dark:text-white hover:bg-orange-500/10 hover:border-orange-500 dark:hover:border-orange-400 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Découvrir les équipes
                </Button>
              </Link>
            </div>

            {/* Stats en direct */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto animate-fade-in-up delay-700">
              <div className="text-center p-4 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-orange-200 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-lg hover:shadow-orange-200/50 dark:hover:shadow-none transition-all duration-300 hover:scale-105">
                <div className="text-3xl md:text-4xl font-black text-orange-600 dark:text-orange-400 mb-1">
                  {teams.length}
                </div>
                <div className="text-xs md:text-sm text-slate-600 dark:text-gray-400 font-semibold">
                  ÉQUIPES
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-orange-200 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-lg hover:shadow-orange-200/50 dark:hover:shadow-none transition-all duration-300 hover:scale-105">
                <div className="text-3xl md:text-4xl font-black text-orange-600 dark:text-orange-400 mb-1">
                  {matches.length}
                </div>
                <div className="text-xs md:text-sm text-slate-600 dark:text-gray-400 font-semibold">
                  MATCHS
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-orange-200 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-lg hover:shadow-orange-200/50 dark:hover:shadow-none transition-all duration-300 hover:scale-105">
                <div className="text-3xl md:text-4xl font-black text-orange-600 dark:text-orange-400 mb-1">
                  500+
                </div>
                <div className="text-xs md:text-sm text-slate-600 dark:text-gray-400 font-semibold">
                  JOUEURS
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dégradé vers le bas */}
        <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      <section className="py-16 bg-gradient-to-b from-background to-orange-50/20 dark:to-orange-950/10">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 dark:from-orange-500 dark:via-red-500 dark:to-orange-500 bg-clip-text text-transparent">
                Résultats récents
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Les derniers matchs terminés</p>
            </div>
            <Link href="/schedule">
              <Button
                variant="ghost"
                className="text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 hover:bg-orange-500/10"
              >
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Carousel pour résultats récents */}
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex gap-6 animate-scroll-slow hover:pause pb-4">
                {recentMatches.concat(recentMatches).map((match, index) => (
                  <div key={`${match.id}-${index}`} className="flex-shrink-0 w-[400px]">
                    <MatchCard match={match} />
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      <section className="border-t border-orange-200/20 dark:border-orange-900/20 py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 dark:from-orange-500 dark:via-red-500 dark:to-orange-500 bg-clip-text text-transparent">
                Prochains matchs
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Ne manquez aucun match à venir</p>
            </div>
            <Link href="/schedule">
              <Button
                variant="ghost"
                className="text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 hover:bg-orange-500/10"
              >
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

      <section className="border-t border-orange-200/20 dark:border-orange-900/20 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 dark:from-orange-500 dark:via-red-500 dark:to-orange-500 bg-clip-text text-transparent">
                Équipes en vedette
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Découvrez les meilleures équipes</p>
            </div>
            <Link href="/teams">
              <Button
                variant="ghost"
                className="text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 hover:bg-orange-500/10"
              >
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
    </div>
  );
}
