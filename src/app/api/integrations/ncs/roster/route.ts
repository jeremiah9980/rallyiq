import { NextResponse } from 'next/server'
import { fetchRoster } from '@/lib/ncs/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get('teamId') ?? ''

  if (!/^\d+$/.test(teamId)) {
    return NextResponse.json({ error: 'A valid NCS team id is required.' }, { status: 400 })
  }

  try {
    const roster = await fetchRoster(teamId)
    if (roster.players.length === 0) {
      return NextResponse.json(
        { ...roster, error: 'No roster players were found for that team on NCS.' },
        { status: 200 }
      )
    }
    return NextResponse.json(roster)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load roster from NCS.'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
