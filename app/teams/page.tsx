import { Metadata } from 'next';
import { getNBATeams } from '@/lib/api/sportsdb';
import { TeamsGrid } from '@/components/teams/teams-grid';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Équipes - NBA',
  description: 'Découvrez toutes les équipes de la NBA - 30 franchises professionnelles.',
};

// ISR - Revalidation plus courte pour éviter les données vides trop longtemps
export const revalidate = 3600; // 1 heure au lieu de 24h

export default async function TeamsPage() {
  // Fetch direct depuis le Server Component
  const teams = await getNBATeams();

  console.log(`[TeamsPage] Nombre d'équipes récupérées: ${teams.length}`);

  console.log(`[TeamsPage] Nombre d'équipes récupérées: ${teams.length}`);

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
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription>
            Impossible de charger les équipes pour le moment. L&apos;API peut être temporairement
            indisponible ou a atteint sa limite de requêtes.
            <br />
            <br />
            La page se mettra automatiquement à jour dans quelques minutes.
            <br />
            <strong>Astuce :</strong> Essayez de rafraîchir la page ou revenez plus tard.
          </AlertDescription>
        </Alert>
      ) : (
        <TeamsGrid teams={teams} itemsPerPage={12} />
      )}
    </div>
  );
}
