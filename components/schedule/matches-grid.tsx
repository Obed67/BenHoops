'use client';

import { useState, useEffect } from 'react';
import { MatchCard } from '@/components/cards/match-card';
import { Pagination } from '@/components/ui/pagination-custom';
import { AnimatedGrid, AnimatedSection } from '@/components/animated-components';
import type { Match } from '@/lib/types';

interface MatchesGridProps {
  matches: Match[];
  itemsPerPage?: number;
}

export function MatchesGrid({ matches, itemsPerPage = 9 }: MatchesGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [gridKey, setGridKey] = useState(0);

  const totalPages = Math.ceil(matches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMatches = matches.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setGridKey((prev) => prev + 1); // Force re-animation
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  // Re-animate when matches change (tab switch)
  useEffect(() => {
    setGridKey((prev) => prev + 1);
    setCurrentPage(1);
  }, [matches.length]);

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
        <AnimatedGrid key={gridKey} variant="wave" stagger={0.06} className="contents">
          {currentMatches.map((match) => (
            <div key={match.id} className="w-full sm:w-[400px]">
              <MatchCard match={match} />
            </div>
          ))}
        </AnimatedGrid>
      </div>

      {totalPages > 1 && (
        <AnimatedSection animation="fadeUp" delay={0.3}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <div className="text-center mt-4 text-sm text-muted-foreground">
            Affichage {startIndex + 1}-{Math.min(endIndex, matches.length)} sur {matches.length}{' '}
            matchs
          </div>
        </AnimatedSection>
      )}
    </div>
  );
}
