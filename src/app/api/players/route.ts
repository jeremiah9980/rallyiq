import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get('teamId')

  try {
    const players = await prisma.player.findMany({
      where: teamId ? { teamId } : undefined,
      include: { user: true, team: true },
    })
    return NextResponse.json(players)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 })
  }
}
