import Link from 'next/link';
import Image from 'next/image';
import type { Team } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Link href={`/teams/${team.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] duration-300">
        <CardHeader className="h-32 relative p-0">
          {/* Image de fond (fanart ou gradient) */}
          {team.fanart ? (
            <div className="absolute inset-0">
              <Image
                src={team.fanart}
                alt={`${team.name} background`}
                fill
                className="object-cover opacity-80"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Overlay gradient pour lisibilité */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${team.primaryColor}dd 0%, ${team.secondaryColor}dd 100%)`,
                }}
              />
            </div>
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${team.primaryColor} 0%, ${team.secondaryColor} 100%)`,
              }}
            />
          )}

          {/* Logo de l'équipe */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="opacity-90 transition-transform group-hover:scale-110 duration-300 bg-white/10 backdrop-blur-sm rounded-full p-4">
              <Image
                src={team.logo}
                alt={`${team.name} logo`}
                width={80}
                height={80}
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-1">{team.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {team.city}, {team.country}
          </p>
          {team.championships > 0 && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Trophy className="h-3 w-3" />
              <span>
                {team.championships} {team.championships === 1 ? 'titre' : 'titres'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
