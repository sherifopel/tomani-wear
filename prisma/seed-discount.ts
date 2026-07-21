// One-time script: pnpm tsx prisma/seed-discount.ts
// Run from the project root with DATABASE_URL set in your environment.
// Usage: DATABASE_URL=... pnpm tsx prisma/seed-discount.ts
// Or:    source .env.local && pnpm tsx prisma/seed-discount.ts (won't auto-load .env.local)
import { PrismaClient } from '/Users/sherif.opel/Documents/Projects/tomani-wear/src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma  = new PrismaClient({ adapter })

async function main() {
  const code = await prisma.discountCode.upsert({
    where:  { code: 'FIRST30' },
    update: {},
    create: {
      code:     'FIRST30',
      discount: 30,
      maxUses:  5,
      active:   true,
    },
  })
  console.log(`Created: ${code.code} — ${code.discount}% off, ${code.maxUses} uses max`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
