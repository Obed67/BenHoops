'use client';

import { useState } from 'react';
import { TeamCard } from '@/components/cards/team-card';
import { Pagination } from '@/components/ui/pagination-custom';
import { Team } from '@/lib/types';

interface TeamsSearchGridProps {
  teams: Team[];
  itemsPerPage?: number;
}

export function TeamsSearchGrid({ teams, itemsPerPage = 12 }: TeamsSearchGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(teams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTeams = teams.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (teams.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Aucune équipe trouvée</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Affichage {startIndex + 1}-{Math.min(endIndex, teams.length)} sur {teams.length} équipes
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentTeams.map((team) => (
          <TeamCard key={team.id} team={team} />
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
