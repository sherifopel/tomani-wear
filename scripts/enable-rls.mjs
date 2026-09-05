import { PrismaClient } from '../src/generated/prisma/index.js'

const prisma = new PrismaClient()

console.log('\n🔒 Enabling Row-Level Security on unprotected tables...\n')

await prisma.$executeRawUnsafe(`ALTER TABLE "DiscountCode" ENABLE ROW LEVEL SECURITY`)
console.log('✓ RLS enabled on DiscountCode')

await prisma.$executeRawUnsafe(`ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY`)
console.log('✓ RLS enabled on Review')

await prisma.$disconnect()

console.log('\n✅ Done — both tables are now protected. Supabase Security Advisor errors will clear.\n')
