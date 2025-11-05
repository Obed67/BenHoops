import { Metadata } from 'next';
import { getNBATeams, getAllNBAMatches, getAllNBAPlayers } from '@/lib/api/sportsdb';
import { TeamCard } from '@/components/cards/team-card';
import { MatchCard } from '@/components/cards/match-card';
import { PlayerCard } from '@/components/cards/player-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchInput } from '@/components/search/search-input';
import { Team, Match, Player } from '@/lib/types';

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

          <TabsContent value="players">
            {filteredPlayers.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredPlayers.map((player: Player) => (
                  <PlayerCard key={player.id} player={player} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Aucun joueur trouvé</p>
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
