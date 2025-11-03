import type { Player } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { User } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] duration-300">
      <CardContent className="p-0">
        {/* Photo du joueur */}
        <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
          {player.imageUrl ? (
            <Image
              src={player.imageUrl}
              alt={player.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <User className="h-24 w-24 text-muted-foreground/30" />
          )}
        </div>

        {/* Infos du joueur */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1">{player.name}</h3>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
              {player.position}
            </span>
            {player.number && (
              <span className="text-sm text-muted-foreground">#{player.number}</span>
            )}
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            {player.height && (
              <p>
                Taille: <span className="font-medium text-foreground">{player.height}</span>
              </p>
            )}
            {player.weight && (
              <p>
                Poids: <span className="font-medium text-foreground">{player.weight}</span>
              </p>
            )}
            {player.nationality && (
              <p>
                Nationalité:{' '}
                <span className="font-medium text-foreground">{player.nationality}</span>
              </p>
            )}
            {player.college && (
              <p>
                Université: <span className="font-medium text-foreground">{player.college}</span>
              </p>
            )}
            {player.dateOfBirth && (
              <p className="text-xs mt-2">
                Né le {new Date(player.dateOfBirth).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>

          {/* Stats si disponibles */}
          {(player.points || player.rebounds || player.assists) && (
            <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-3">
              {player.points !== undefined && (
                <div className="text-center">
                  <p className="text-xl font-bold">{player.points}</p>
                  <p className="text-xs text-muted-foreground">PTS</p>
                </div>
              )}
              {player.rebounds !== undefined && (
                <div className="text-center">
                  <p className="text-xl font-bold">{player.rebounds}</p>
                  <p className="text-xs text-muted-foreground">REB</p>
                </div>
              )}
              {player.assists !== undefined && (
                <div className="text-center">
                  <p className="text-xl font-bold">{player.assists}</p>
                  <p className="text-xs text-muted-foreground">AST</p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
