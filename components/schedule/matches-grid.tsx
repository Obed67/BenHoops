'use client';

import { useState } from 'react';
import { MatchCard } from '@/components/cards/match-card';
import { Pagination } from '@/components/ui/pagination-custom';
import type { Match } from '@/lib/types';

interface MatchesGridProps {
  matches: Match[];
  itemsPerPage?: number;
}

export function MatchesGrid({ matches, itemsPerPage = 9 }: MatchesGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(matches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMatches = matches.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  if (matches.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-muted-foreground">Aucun match dans cette catégorie</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-6">
        {currentMatches.map((match) => (
          <div key={match.id} className="w-full sm:w-[400px]">
            <MatchCard match={match} />
          </div>
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
            Affichage {startIndex + 1}-{Math.min(endIndex, matches.length)} sur {matches.length}{' '}
            matchs
          </div>
        </>
      )}
    </div>
  );
}
