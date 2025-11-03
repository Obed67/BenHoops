import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-orange-200/20 dark:border-orange-900/20 bg-gradient-to-b from-background to-orange-50/30 dark:to-orange-950/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-full blur-sm opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative text-3xl">🏀</div>
              </div>
              <span className="text-lg font-black bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 dark:from-orange-500 dark:via-red-500 dark:to-orange-500 bg-clip-text text-transparent">
                NBA Stats
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Suivez la NBA en direct avec statistiques, classements et résultats de toutes les
              équipes.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-orange-600 dark:text-orange-500">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/teams"
                  className="text-muted-foreground hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                >
                  Équipes
                </Link>
              </li>
              <li>
                <Link
                  href="/schedule"
                  className="text-muted-foreground hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                >
                  Calendrier
                </Link>
              </li>
              <li>
                <Link
                  href="/standings"
                  className="text-muted-foreground hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                >
                  Classement
                </Link>
              </li>
            </ul>
          </div>

          {/* À propos */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-orange-600 dark:text-orange-500">
              À propos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                >
                  Notre histoire
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                >
                  Règlement
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                >
                  Partenaires
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-orange-600 dark:text-orange-500">
              Suivez-nous
            </h3>
            <div className="flex space-x-3">
              <a
                href="#"
                className="p-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-500 hover:bg-orange-500/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-500 hover:bg-orange-500/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-500 hover:bg-orange-500/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-500 hover:bg-orange-500/20 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright avec bordure orange */}
        <div className="mt-8 border-t border-orange-200/30 dark:border-orange-900/30 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear}{' '}
            <span className="font-semibold text-orange-600 dark:text-orange-500">
              NBA Stats Hub
            </span>
            . Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
