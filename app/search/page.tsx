import { Metadata } from 'next';
import { fetchTeams, fetchPlayers, fetchMatches } from '@/lib/api/server';
import { REVALIDATE_TIME } from '@/lib/config/api';
import { TeamCard } from '@/components/cards/team-card';
import { PlayerCard } from '@/components/cards/player-card';
import { MatchCard } from '@/components/cards/match-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchInput } from '@/components/search-input';

export const metadata: Metadata = {
  title: 'Recherche - NBA Stats',
  description: 'Recherchez des équipes, joueurs et matchs NBA.',
};

// ISR - Revalidation toutes les heures
export const revalidate = REVALIDATE_TIME.matches;

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.toLowerCase() || '';

  const [teams, players, matches] = await Promise.all([
    fetchTeams(),
    fetchPlayers(),
    fetchMatches(),
  ]);

  // Filtrage côté serveur
  const filteredTeams = query
    ? teams.filter(
        (team) =>
          team.name.toLowerCase().includes(query) ||
          team.city.toLowerCase().includes(query) ||
          team.country.toLowerCase().includes(query)
      )
    : [];

  const filteredPlayers = query
    ? players.filter(
        (player) =>
          player.name.toLowerCase().includes(query) ||
          player.nationality.toLowerCase().includes(query) ||
          player.position.toLowerCase().includes(query)
      )
    : [];

  const filteredMatches = query
    ? matches.filter(
        (match) =>
          match.homeTeamName.toLowerCase().includes(query) ||
          match.awayTeamName.toLowerCase().includes(query) ||
          match.venue.toLowerCase().includes(query)
      )
    : [];

  const totalResults = filteredTeams.length + filteredPlayers.length + filteredMatches.length;

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
          <TabsList className="mb-8 grid w-full grid-cols-3 lg:w-[400px] lg:mx-auto">
            <TabsTrigger value="teams">Équipes ({filteredTeams.length})</TabsTrigger>
            <TabsTrigger value="players">Joueurs ({filteredPlayers.length})</TabsTrigger>
            <TabsTrigger value="matches">Matchs ({filteredMatches.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="teams">
            {filteredTeams.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTeams.map((team) => (
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
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPlayers.map((player) => (
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
                {filteredMatches.map((match) => (
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
            Commencez à taper pour rechercher des équipes, joueurs ou matchs
          </p>
        </div>
      )}
    </div>
  );
}
