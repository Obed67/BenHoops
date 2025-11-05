'use client';

import { useState } from 'react';
import { PlayerCard } from '@/components/cards/player-card';
import { Pagination } from '@/components/ui/pagination-custom';
import { Player } from '@/lib/types';

interface PlayersSearchGridProps {
  players: Player[];
  itemsPerPage?: number;
}

export function PlayersSearchGrid({ players, itemsPerPage = 12 }: PlayersSearchGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(players.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlayers = players.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (players.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Aucun joueur trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Affichage {startIndex + 1}-{Math.min(endIndex, players.length)} sur {players.length} joueurs
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentPlayers.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
