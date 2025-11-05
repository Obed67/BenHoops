'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState, useCallback, useRef } from 'react';

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);

      // Annuler le timer précédent
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Créer un nouveau timer
      debounceTimerRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
          params.set('q', value);
        } else {
          params.delete('q');
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }, 300);
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Rechercher une équipe, un joueur ou un match..."
        className="pl-10"
        value={query}
        onChange={handleChange}
        autoComplete="off"
      />
    </div>
  );
}
