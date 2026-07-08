import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) })

async function main() {
  const deleted = await prisma.order.deleteMany({ where: { paystackRef: { startsWith: 'TW-SEED-' } } })
  console.log(`Deleted ${deleted.count} seed orders`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
