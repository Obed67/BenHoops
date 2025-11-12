import { NextRequest, NextResponse } from 'next/server';
import { getPlayersByTeam } from '@/lib/api/sportsdb';

export const runtime = 'edge'; // Pour des réponses plus rapides
export const revalidate = 43200; // Cache 12 heures

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    console.log(`[API] Fetching players for team ${id}`);

    const players = await getPlayersByTeam(id);

    return NextResponse.json(
      { players, count: players.length },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=43200, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('[API] Error fetching players:', error);
    return NextResponse.json({ error: 'Failed to fetch players', players: [] }, { status: 500 });
  }
}
