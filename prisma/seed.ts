import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('demo123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@rallyiq.com' },
    update: { password, name: 'Demo Admin', role: 'admin' },
    create: {
      email: 'admin@rallyiq.com',
      name: 'Demo Admin',
      password,
      role: 'admin',
    },
  })

  console.log('✅ Demo user seeded: admin@rallyiq.com / demo123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
