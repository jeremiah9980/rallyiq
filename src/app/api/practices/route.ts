import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get('teamId')

  try {
    const practices = await prisma.practice.findMany({
      where: teamId ? { teamId } : undefined,
      include: { team: true, coach: true },
      orderBy: { date: 'desc' },
    })
    return NextResponse.json(practices)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch practices' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const practice = await prisma.practice.create({ data: body })
    return NextResponse.json(practice, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create practice' }, { status: 500 })
  }
}
