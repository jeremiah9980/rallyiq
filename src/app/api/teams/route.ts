import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: { coaches: true, players: true },
    })
    return NextResponse.json(teams)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const team = await prisma.team.create({ data: body })
    return NextResponse.json(team, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 })
  }
}
