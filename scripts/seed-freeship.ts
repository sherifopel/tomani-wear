import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  const prisma  = new PrismaClient({ adapter })

  const code = await prisma.discountCode.upsert({
    where:  { code: 'FREESHIP' },
    update: { type: 'free_delivery', discount: 0, maxUses: 9999, active: true },
    create: { code: 'FREESHIP', type: 'free_delivery', discount: 0, maxUses: 9999, active: true },
  })

  console.log(`✅ Created: ${code.code} — free delivery, ${code.maxUses} uses, active: ${code.active}`)
  await prisma.$disconnect()
}

main().catch(console.error)
