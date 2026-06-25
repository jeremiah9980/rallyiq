import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  let body: { name?: string; email?: string; password?: string; role?: string; orgName?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { name, email, password, role, orgName } = body
  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
  }

  // Normalize email so casing differences can't create duplicate accounts.
  // The login flow (lib/auth.ts) normalizes the same way before lookup.
  const normalizedEmail = email.trim().toLowerCase()

  try {
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)

    // Create the organization and user together so a failure can't leave an
    // orphaned organization behind.
    await prisma.$transaction(async (tx) => {
      let organizationId: string | undefined
      if (orgName?.trim()) {
        const slug = orgName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()
        const org = await tx.organization.create({ data: { name: orgName.trim(), slug } })
        organizationId = org.id
      }
      await tx.user.create({
        data: {
          name,
          email: normalizedEmail,
          password: hashed,
          role: role || 'coach',
          organizationId,
        },
      })
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    // Handle the unique-constraint race where two requests pass the existence
    // check before either inserts.
    if (err && typeof err === 'object' && (err as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}
