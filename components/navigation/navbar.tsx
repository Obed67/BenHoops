'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/teams', label: 'Équipes' },
  { href: '/schedule', label: 'Calendrier' },
  { href: '/standings', label: 'Classement' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-orange-200/20 dark:border-orange-900/20 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo avec effet NBA */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-full blur-sm opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative text-3xl transform group-hover:scale-110 transition-transform">
                🏀
              </div>
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 dark:from-orange-500 dark:via-red-500 dark:to-orange-500 bg-clip-text text-transparent">
              NBA Stats
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center space-x-1 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-semibold transition-colors rounded-lg',
                    isActive
                      ? 'text-orange-600 dark:text-orange-500'
                      : 'text-muted-foreground hover:text-orange-600 dark:hover:text-orange-500'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 rounded-full"></div>
                  )}
                </Link>
              );
            })}

            <Link
              href="/search"
              aria-label="Rechercher"
              className="ml-2 p-2 rounded-lg hover:bg-orange-500/10 dark:hover:bg-orange-500/10 transition-colors group"
            >
              <Search className="h-5 w-5 text-muted-foreground group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors" />
            </Link>

            <ThemeToggle />
          </div>

          {/* Mobile menu */}
          <div className="flex items-center space-x-2 md:hidden">
            <Link
              href="/search"
              aria-label="Rechercher"
              className="p-2 rounded-lg hover:bg-orange-500/10 transition-colors"
            >
              <Search className="h-5 w-5 text-muted-foreground" />
            </Link>
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-orange-500/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6 text-muted-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation dropdown */}
        {isOpen && (
          <div className="border-t border-orange-200/20 dark:border-orange-900/20 py-4 md:hidden">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'px-4 py-3 text-sm font-semibold rounded-lg transition-colors',
                      isActive
                        ? 'text-orange-600 dark:text-orange-500 bg-orange-500/10'
                        : 'text-muted-foreground hover:text-orange-600 dark:hover:text-orange-500 hover:bg-orange-500/5'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
