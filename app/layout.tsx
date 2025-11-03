import './globals.css';
import type { Metadata } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navigation/navbar';
import { Footer } from '@/components/navigation/footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

export const metadata: Metadata = {
  title: 'NBA Stats & Scores - Live Basketball',
  description:
    'Suivez la NBA en direct. Résultats, classements, statistiques et actualités des 30 équipes NBA. Scores en temps réel et calendrier complet.',
  keywords: [
    'NBA',
    'basketball',
    'sports',
    'live scores',
    'NBA stats',
    'NBA standings',
    'basketball scores',
  ],
  authors: [{ name: 'NBA Stats Hub' }],
  openGraph: {
    title: 'NBA Stats & Scores - Live Basketball',
    description: 'Suivez la NBA en direct avec scores, classements et statistiques',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${bebasNeue.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
