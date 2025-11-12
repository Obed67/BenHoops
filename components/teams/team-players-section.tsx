'use client';

import { useEffect, useState } from 'react';
import { Player } from '@/lib/types';
import { PlayerCard } from '@/components/cards/player-card';
import { Skeleton } from '@/components/ui/skeleton';

interface TeamPlayersSectionProps {
  teamId: string;
  teamName: string;
}

export function TeamPlayersSection({ teamId, teamName }: TeamPlayersSectionProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlayers() {
      try {
        setLoading(true);
        setError(null);

        // Appeler une route API côté client
        const response = await fetch(`/api/teams/${teamId}/players`);

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des joueurs');
        }

        const data = await response.json();
        setPlayers(data.players || []);
      } catch (err) {
        console.error('Error loading players:', err);
        setError('Impossible de charger les joueurs');
      } finally {
        setLoading(false);
      }
    }

    loadPlayers();
  }, [teamId]);

  if (loading) {
    return (
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold">Effectif</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold">Effectif</h2>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (players.length === 0) {
    return (
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold">Effectif</h2>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          <p>Aucun joueur disponible pour cette équipe</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <h2 className="mb-6 text-2xl font-bold">Effectif ({players.length} joueurs)</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </section>
  );
}
