import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { name, email, password, role, orgName } = await req.json()

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 12)

  let organizationId: string | undefined

  if (orgName?.trim()) {
    const slug = orgName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()
    const org = await prisma.organization.create({
      data: { name: orgName.trim(), slug },
    })
    organizationId = org.id
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: role || 'coach',
      organizationId,
    },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
