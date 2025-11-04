import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNBATeams, getTeamById, getPlayersByTeam, getTeamMatches } from '@/lib/api/sportsdb';
import Image from 'next/image';
import { PlayerCard } from '@/components/cards/player-card';
import { MatchCard } from '@/components/cards/match-card';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Users, Trophy, Calendar } from 'lucide-react';

interface TeamPageProps {
  params: {
    id: string;
  };
}

// generateMetadata pour SEO dynamique
export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const team = await getTeamById(params.id);

  if (!team) {
    return {
      title: 'Équipe introuvable',
    };
  }

  return {
    title: `${team.name} - NBA`,
    description: `Découvrez l'équipe NBA ${team.name} de ${team.city}. Effectif, statistiques et prochains matchs.`,
  };
}

// ISR - Revalidation toutes les heures
export const revalidate = 3600;

// SSG - Pré-générer seulement quelques équipes pour éviter l'erreur 429
// Les autres équipes seront générées à la demande (ISR)
export async function generateStaticParams() {
  try {
    const teams = await getNBATeams();

    // Ne pré-générer que les 5 premières équipes pour éviter l'erreur 429
    const limitedTeams = teams.slice(0, 5);

    return limitedTeams.map((team) => ({
      id: team.id,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

// Générer dynamiquement les pages qui ne sont pas pré-générées
export const dynamicParams = true;

export default async function TeamPage({ params }: TeamPageProps) {
  // Fetch parallèle pour optimiser les performances
  const [team, teamPlayers, teamMatches] = await Promise.all([
    getTeamById(params.id),
    getPlayersByTeam(params.id),
    getTeamMatches(params.id),
  ]);

  if (!team) {
    notFound();
  }

  // Limiter les matchs affichés
  const recentMatches = teamMatches.slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section avec fanart en arrière-plan */}
      <div className="mb-12 rounded-lg overflow-hidden relative min-h-[400px] flex items-center justify-center">
        {/* Image de fond (fanart ou banner) */}
        {team.fanart && (
          <div className="absolute inset-0">
            <Image
              src={team.fanart}
              alt={`${team.name} background`}
              fill
              className="object-cover"
              priority
            />
            {/* Overlay gradient pour lisibilité */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${team.primaryColor}dd 0%, ${team.secondaryColor}dd 100%)`,
              }}
            />
          </div>
        )}
        {!team.fanart && (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${team.primaryColor} 0%, ${team.secondaryColor} 100%)`,
            }}
          />
        )}

        {/* Contenu du hero */}
        <div className="relative z-10 text-center text-white p-12">
          <div className="mb-4 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-full p-6">
              <Image
                src={team.logo}
                alt={`${team.name} logo`}
                width={160}
                height={160}
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
          <h1 className="mb-2 text-5xl font-bold md:text-6xl drop-shadow-lg">{team.name}</h1>
          <p className="mb-4 text-xl opacity-90">
            {team.city}, {team.country}
          </p>
          {team.championships > 0 && (
            <div className="flex items-center justify-center space-x-2 text-lg">
              <Trophy className="h-6 w-6" />
              <span>
                {team.championships} {team.championships === 1 ? 'titre' : 'titres'}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stade</p>
              <p className="font-semibold">{team.arena}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Capacité</p>
              <p className="font-semibold">{team.capacity.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fondé en</p>
              <p className="font-semibold">{team.founded}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Entraîneur</p>
              <p className="font-semibold">{team.coach}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Stade et Maillot */}
      {(team.stadiumThumb || team.equipment) && (
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-bold">Installations</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {team.stadiumThumb && (
              <Card className="overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={team.stadiumThumb}
                    alt={`${team.arena}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{team.arena}</h3>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{team.city}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground mt-1">
                    <Users className="h-4 w-4" />
                    <span>{team.capacity.toLocaleString()} places</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {team.equipment && (
              <Card className="overflow-hidden">
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  <Image
                    src={team.equipment}
                    alt={`${team.name} maillot`}
                    fill
                    className="object-contain p-8"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">Maillot officiel</h3>
                  <p className="text-muted-foreground">
                    Équipement {team.founded && `depuis ${team.founded}`}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Section Description */}
      {team.description && (
        <section className="mb-12">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">À propos de {team.name}</h2>
              <p className="text-muted-foreground leading-relaxed">{team.description}</p>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold">Effectif</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teamPlayers.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </section>

      {teamMatches.length > 0 && (
        <section>
          <h2 className="mb-6 text-3xl font-bold">Matchs récents et à venir</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teamMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
