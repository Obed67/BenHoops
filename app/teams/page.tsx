import { Metadata } from 'next';
import { getNBATeams } from '@/lib/api/sportsdb';
import { TeamCard } from '@/components/cards/team-card';

export const metadata: Metadata = {
  title: 'Équipes - NBA',
  description: 'Découvrez toutes les équipes de la NBA - 30 franchises professionnelles.',
};

// ISR - Revalidation est configurée dans getNBATeams() (24h)
// Pas besoin de définir `export const revalidate` ici

export default async function TeamsPage() {
  // Fetch direct depuis le Server Component
  const teams = await getNBATeams();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1
          className="mb-4 text-5xl font-bold md:text-6xl"
          style={{ fontFamily: 'var(--font-bebas)' }}
        >
          Nos Équipes
        </h1>
        <p className="text-xl text-muted-foreground">
          {teams.length > 0
            ? `${teams.length} équipes NBA - Conférence Est & Ouest`
            : 'Chargement des équipes...'}
        </p>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucune équipe disponible pour le moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}
