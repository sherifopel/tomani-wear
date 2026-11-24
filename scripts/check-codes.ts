import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  const prisma  = new PrismaClient({ adapter })
  const codes   = await prisma.discountCode.findMany({ orderBy: { createdAt: 'desc' } })

  if (codes.length === 0) {
    console.log('No discount codes found.')
  } else {
    console.log(`\n${codes.length} discount code(s):\n`)
    for (const c of codes) {
      const discount = c.type === 'free_delivery' ? 'Free delivery' : `${c.discount}% off`
      const uses     = `${c.usedCount} of ${c.maxUses} uses`
      const active   = c.active ? 'Active' : 'Paused'
      const expires  = c.expiresAt ? `expires ${new Date(c.expiresAt).toLocaleDateString('en-GB')}` : 'no expiry'
          console.log(`  ${c.code.padEnd(16)} ${discount.padEnd(16)} ${uses.padEn(20)} ${active.padEnd(8)} ${expires}`)
    }
  }

  await prisma.$disconnect()
}

main().catch(console.error)
