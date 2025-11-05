'use client';

import { useState } from 'react';
import { TeamCard } from '@/components/cards/team-card';
import { Pagination } from '@/components/ui/pagination-custom';
import type { Team } from '@/lib/types';

interface TeamsGridProps {
  teams: Team[];
  itemsPerPage?: number;
}

export function TeamsGrid({ teams, itemsPerPage = 12 }: TeamsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(teams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTeams = teams.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll vers le haut quand on change de page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentTeams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>

      {totalPages > 1 && (
        <>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <div className="text-center mt-4 text-sm text-muted-foreground">
            Affichage {startIndex + 1}-{Math.min(endIndex, teams.length)} sur {teams.length} équipes
          </div>
        </>
      )}
    </div>
  );
}
