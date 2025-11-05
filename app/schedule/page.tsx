import { Metadata } from 'next';
import { getAllNBAMatches } from '@/lib/api/sportsdb';
import { MatchesGrid } from '@/components/schedule/matches-grid';
import { ScheduleExportButtons } from '@/components/export/schedule-export-buttons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Calendrier - NBA',
  description: 'Consultez tous les matchs passés et à venir de la NBA avec scores en direct.',
};

// ISR - Revalidation configurée dans getAllNBAMatches() (1h)

export default async function SchedulePage() {
  // Fetch direct depuis Server Component
  const matches = await getAllNBAMatches();

  const finishedMatches = matches.filter((m) => m.status === 'finished');
  const upcomingMatches = matches.filter((m) => m.status === 'scheduled');
  const liveMatches = matches.filter((m) => m.status === 'live');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
          <h1
            className="text-5xl font-bold md:text-6xl"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            Calendrier des Matchs
          </h1>
          <ScheduleExportButtons matches={matches} />
        </div>
        <p className="text-xl text-muted-foreground">Suivez tous les matchs de la saison</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-3 lg:w-[400px] lg:mx-auto">
          <TabsTrigger value="upcoming">À venir ({upcomingMatches.length})</TabsTrigger>
          <TabsTrigger value="live">En direct ({liveMatches.length})</TabsTrigger>
          <TabsTrigger value="finished">Terminés ({finishedMatches.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          <MatchesGrid matches={upcomingMatches} itemsPerPage={9} />
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          <MatchesGrid matches={liveMatches} itemsPerPage={9} />
        </TabsContent>

        <TabsContent value="finished" className="space-y-6">
          <MatchesGrid matches={finishedMatches} itemsPerPage={12} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
