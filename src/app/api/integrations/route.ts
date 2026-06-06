import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const organizationId = searchParams.get('organizationId')

  try {
    const integrations = await prisma.integrationConfig.findMany({
      where: organizationId ? { organizationId } : undefined,
    })
    return NextResponse.json(integrations)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch integrations' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...data } = body
    const integration = await prisma.integrationConfig.update({ where: { id }, data })
    return NextResponse.json(integration)
  } catch {
    return NextResponse.json({ error: 'Failed to update integration' }, { status: 500 })
  }
}
