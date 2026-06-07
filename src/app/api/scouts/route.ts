import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const reports = await prisma.scoutReport.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(reports)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch scout reports' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const report = await prisma.scoutReport.create({ data: body })
    return NextResponse.json(report, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create scout report' }, { status: 500 })
  }
}
