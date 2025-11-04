import { Metadata } from 'next';
import { getNBATeams, getAllNBAMatches } from '@/lib/api/sportsdb';
import { TeamCard } from '@/components/cards/team-card';
import { MatchCard } from '@/components/cards/match-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Team, Match } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Recherche - NBA Stats',
  description: 'Recherchez des équipes, joueurs et matchs NBA.',
};

// Force dynamic rendering pour la page de recherche
export const dynamic = 'force-dynamic';

// ISR - Revalidation toutes les heures
export const revalidate = 3600;

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.toLowerCase() || '';

  const [teams, matches] = await Promise.all([getNBATeams(), getAllNBAMatches()]);

  // Filtrage côté serveur avec types appropriés
  const filteredTeams = query
    ? teams.filter(
        (team: Team) =>
          team.name.toLowerCase().includes(query) ||
          team.city.toLowerCase().includes(query) ||
          team.country.toLowerCase().includes(query)
      )
    : [];

  const filteredMatches = query
    ? matches.filter(
        (match: Match) =>
          match.homeTeamName.toLowerCase().includes(query) ||
          match.awayTeamName.toLowerCase().includes(query) ||
          match.venue.toLowerCase().includes(query)
      )
    : [];

  const totalResults = filteredTeams.length + filteredMatches.length;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1
          className="mb-4 text-5xl font-bold md:text-6xl"
          style={{ fontFamily: 'var(--font-bebas)' }}
        >
          Recherche
        </h1>
        <p className="text-xl text-muted-foreground">Recherchez des équipes et matchs NBA</p>
      </div>

      <div className="mx-auto mb-8 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher une équipe ou un match..."
            className="pl-10"
            defaultValue={query}
          />
        </div>
        {query && (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {totalResults} {totalResults === 1 ? 'résultat trouvé' : 'résultats trouvés'}
          </p>
        )}
      </div>

      {query ? (
        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-2 lg:w-[300px] lg:mx-auto">
            <TabsTrigger value="teams">Équipes ({filteredTeams.length})</TabsTrigger>
            <TabsTrigger value="matches">Matchs ({filteredMatches.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="teams">
            {filteredTeams.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTeams.map((team: Team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Aucune équipe trouvée</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="matches">
            {filteredMatches.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredMatches.map((match: Match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Aucun match trouvé</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">
            Commencez à taper pour rechercher des équipes ou matchs
          </p>
        </div>
      )}
    </div>
  );
}
