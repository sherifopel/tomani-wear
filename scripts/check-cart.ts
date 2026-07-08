import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) })

async function main() {
  const items = await prisma.cartItem.groupBy({ by: ['userId'], _sum: { quantity: true }, _count: true })
  const users = await prisma.user.findMany({
    where: { id: { in: items.map(i => i.userId) } },
    select: { id: true, email: true },
  })
  for (const item of items) {
    const u = users.find(u => u.id === item.userId)
    console.log(u?.email, '→', item._sum.quantity, 'qty,', item._count, 'rows')
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
