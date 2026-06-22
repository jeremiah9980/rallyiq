import { NextResponse } from 'next/server'
import { searchTeams } from '@/lib/ncs/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teamName = searchParams.get('teamName') ?? ''
  const city = searchParams.get('city') ?? ''
  const state = searchParams.get('state') ?? ''
  const seasonId = searchParams.get('seasonId') ?? ''

  if (!teamName.trim() && !city.trim() && !state.trim()) {
    return NextResponse.json(
      { error: 'Enter a team name, city, or state to search.' },
      { status: 400 }
    )
  }

  try {
    const result = await searchTeams({ teamName, city, state, seasonId })
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to search NCS.'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
