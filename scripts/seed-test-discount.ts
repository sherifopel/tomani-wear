import { PrismaClient } from '../src/generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const TEST_CODE = {
  code:     'TEST10',
  discount: 10,       // 10% off
  maxUses:  9999,     // effectively unlimited for local testing
  active:   true,
}

async function main() {
  const existing = await prisma.discountCode.findUnique({ where: { code: TEST_CODE.code } })

  if (existing) {
    console.log(`Code ${TEST_CODE.code} already exists:`, existing)
  } else {
    const created = await prisma.discountCode.create({ data: TEST_CODE })
    console.log('Created test discount code:', created)
  }
}

main().finally(() => prisma.$disconnect())
