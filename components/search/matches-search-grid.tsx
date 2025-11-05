'use client';

import { useState } from 'react';
import { MatchCard } from '@/components/cards/match-card';
import { Pagination } from '@/components/ui/pagination-custom';
import { Match } from '@/lib/types';

interface MatchesSearchGridProps {
  matches: Match[];
  itemsPerPage?: number;
}

export function MatchesSearchGrid({ matches, itemsPerPage = 9 }: MatchesSearchGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(matches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMatches = matches.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (matches.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Aucun match trouvé</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Affichage {startIndex + 1}-{Math.min(endIndex, matches.length)} sur {matches.length} matchs
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentMatches.map((match) => (
          <MatchCard key={match.id} match={match} />
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
