import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get('teamId')

  try {
    const schedules = await prisma.schedule.findMany({
      where: teamId ? { teamId } : undefined,
      orderBy: { date: 'asc' },
    })
    return NextResponse.json(schedules)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 })
  }
}
