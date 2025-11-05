import { Metadata } from 'next';
import { getNBATeams, getAllNBAMatches, getAllNBAPlayers } from '@/lib/api/sportsdb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchInput } from '@/components/search/search-input';
import { TeamsSearchGrid } from '@/components/search/teams-search-grid';
import { PlayersSearchGrid } from '@/components/search/players-search-grid';
import { MatchesSearchGrid } from '@/components/search/matches-search-grid';
import { Team, Match, Player } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Recherche - BenHoops',
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

  const [teams, matches, players] = await Promise.all([
    getNBATeams(),
    getAllNBAMatches(),
    getAllNBAPlayers(),
  ]);

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

  const filteredPlayers = query
    ? players.filter(
        (player: Player) =>
          player.name.toLowerCase().includes(query) ||
          player.position.toLowerCase().includes(query) ||
          player.nationality.toLowerCase().includes(query)
      )
    : [];

  const totalResults = filteredTeams.length + filteredMatches.length + filteredPlayers.length;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1
          className="mb-4 text-5xl font-bold md:text-6xl"
          style={{ fontFamily: 'var(--font-bebas)' }}
        >
          Recherche
        </h1>
        <p className="text-xl text-muted-foreground">
          Recherchez des équipes, joueurs et matchs NBA
        </p>
      </div>

      <div className="mx-auto mb-8 max-w-2xl">
        <SearchInput />
        {query && (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {totalResults} {totalResults === 1 ? 'résultat trouvé' : 'résultats trouvés'}
          </p>
        )}
      </div>

      {query ? (
        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-3 lg:w-[450px] lg:mx-auto">
            <TabsTrigger value="teams">Équipes ({filteredTeams.length})</TabsTrigger>
            <TabsTrigger value="players">Joueurs ({filteredPlayers.length})</TabsTrigger>
            <TabsTrigger value="matches">Matchs ({filteredMatches.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="teams">
            <TeamsSearchGrid teams={filteredTeams} itemsPerPage={12} />
          </TabsContent>

          <TabsContent value="players">
            <PlayersSearchGrid players={filteredPlayers} itemsPerPage={12} />
          </TabsContent>

          <TabsContent value="matches">
            <MatchesSearchGrid matches={filteredMatches} itemsPerPage={9} />
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
