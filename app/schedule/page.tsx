import { Metadata } from 'next';
import { fetchMatches } from '@/lib/api/server';
import { REVALIDATE_TIME } from '@/lib/config/api';
import { MatchCard } from '@/components/cards/match-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Calendrier - NBA',
  description: 'Consultez tous les matchs passés et à venir de la NBA avec scores en direct.',
};

// ISR - Revalidation toutes les heures
export const revalidate = REVALIDATE_TIME.matches;

export default async function SchedulePage() {
  const matches = await fetchMatches();

  const finishedMatches = matches.filter((m) => m.status === 'finished');
  const upcomingMatches = matches.filter((m) => m.status === 'scheduled');
  const liveMatches = matches.filter((m) => m.status === 'live');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1
          className="mb-4 text-5xl font-bold md:text-6xl"
          style={{ fontFamily: 'var(--font-bebas)' }}
        >
          Calendrier des Matchs
        </h1>
        <p className="text-xl text-muted-foreground">Suivez tous les matchs de la saison</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-3 lg:w-[400px] lg:mx-auto">
          <TabsTrigger value="upcoming">À venir ({upcomingMatches.length})</TabsTrigger>
          <TabsTrigger value="live">En direct ({liveMatches.length})</TabsTrigger>
          <TabsTrigger value="finished">Terminés ({finishedMatches.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {upcomingMatches.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Aucun match à venir pour le moment</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          {liveMatches.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {liveMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Aucun match en direct actuellement</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="finished" className="space-y-6">
          {finishedMatches.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {finishedMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Aucun match terminé</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
