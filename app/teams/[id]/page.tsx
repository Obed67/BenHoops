import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  fetchTeams,
  fetchTeamById,
  fetchPlayersByTeam,
  fetchMatchesByTeam,
} from '@/lib/api/server';
import { REVALIDATE_TIME } from '@/lib/config/api';
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

// ISR - Revalidation toutes les 24 heures
export const revalidate = REVALIDATE_TIME.teams;

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const team = await fetchTeamById(params.id);

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

export async function generateStaticParams() {
  const teams = await fetchTeams();
  return teams.map((team) => ({
    id: team.id,
  }));
}

export default async function TeamPage({ params }: TeamPageProps) {
  const [team, teamPlayers, teamMatches] = await Promise.all([
    fetchTeamById(params.id),
    fetchPlayersByTeam(params.id),
    fetchMatchesByTeam(params.id),
  ]);

  if (!team) {
    notFound();
  }

  // Limiter les matchs affichés
  const recentMatches = teamMatches.slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-12">
      <div
        className="mb-12 rounded-lg p-12 text-center text-white"
        style={{
          background: `linear-gradient(135deg, ${team.primaryColor} 0%, ${team.secondaryColor} 100%)`,
        }}
      >
        <div className="mb-4 flex items-center justify-center">
          <Image
            src={team.logo}
            alt={`${team.name} logo`}
            width={160}
            height={160}
            className="rounded-full object-contain"
          />
        </div>
        <h1 className="mb-2 text-5xl font-bold md:text-6xl">{team.name}</h1>
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
