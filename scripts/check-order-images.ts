import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) })

async function main() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { items: { select: { name: true, imageUrl: true } } },
  })
  for (const o of orders) {
    console.log(`\n${o.id.slice(-6)} [${o.status}]`)
    for (const item of o.items) {
      console.log(`  ${item.name} → imageUrl: ${item.imageUrl ?? 'NULL'}`)
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
