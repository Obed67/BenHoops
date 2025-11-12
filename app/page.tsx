import Link from 'next/link';
import { getAllNBAMatches, getNBATeams } from '@/lib/api/sportsdb';
import { MatchCard } from '@/components/cards/match-card';
import { TeamCard } from '@/components/cards/team-card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AnimatedHero } from '@/components/animated-hero';
import { AnimatedSection, AnimatedGrid } from '@/components/animated-components';

// ISR - Revalidation toutes les 5 minutes pour la homepage
export const revalidate = 300;

export default async function Home() {
  // Fetch parallèle avec ISR - pas besoin de tous les joueurs sur la page d'accueil
  const [matches, teams] = await Promise.all([
    getAllNBAMatches(),
    getNBATeams(),
  ]);

  const recentMatches = matches.filter((m) => m.status === 'finished').slice(0, 3);
  const upcomingMatches = matches.filter((m) => m.status === 'scheduled').slice(0, 3);
  const featuredTeams = teams.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero Section avec animations GSAP */}
      <AnimatedHero />

      {/* Section Résultats récents */}
      <AnimatedSection animation="scale" delay={0.2}>
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

            {/* Grid avec animation flip */}
            <AnimatedGrid
              variant="flip"
              stagger={0.1}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {recentMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </AnimatedGrid>
          </div>
        </section>
      </AnimatedSection>

      {/* Section Prochains matchs */}
      <AnimatedSection animation="scale" delay={0.1}>
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
            <AnimatedGrid
              variant="wave"
              stagger={0.12}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {upcomingMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </AnimatedGrid>
          </div>
        </section>
      </AnimatedSection>

      {/* Section Équipes en vedette */}
      <AnimatedSection animation="fadeUp" delay={0.1}>
        <section className="border-t border-orange-200/20 dark:border-orange-900/20 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 dark:from-orange-500 dark:via-red-500 dark:to-orange-500 bg-clip-text text-transparent">
                  Équipes en vedette
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Découvrez les meilleures équipes
                </p>
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
            <AnimatedGrid
              variant="zoom"
              stagger={0.08}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              {featuredTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </AnimatedGrid>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
