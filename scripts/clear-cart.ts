import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) })

async function main() {
  const deleted = await prisma.cartItem.deleteMany({ where: { user: { email: 'sherif.opel1@gmail.com' } } })
  console.log(`Cleared ${deleted.count} cart items`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
