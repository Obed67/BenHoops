import { Metadata } from 'next';
import { getAllNBAMatches } from '@/lib/api/sportsdb';
import { MatchesGrid } from '@/components/schedule/matches-grid';
import { ScheduleExportButtons } from '@/components/export/schedule-export-buttons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedSection, SplitTextReveal } from '@/components/animated-components';

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
      <div className="mb-12">
        <AnimatedSection animation="scale" delay={0.1}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 mb-4">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-center bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              <SplitTextReveal text="Calendrier des Matchs" delay={0.3} />
            </h1>
            <div className="sm:ml-4">
              <ScheduleExportButtons matches={matches} />
            </div>
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground text-center">
            Suivez tous les matchs de la saison
          </p>
        </AnimatedSection>
      </div>

      <AnimatedSection animation="fadeUp" delay={0.5}>
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
      </AnimatedSection>
    </div>
  );
}
