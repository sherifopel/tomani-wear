import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local manually
const envPath = resolve(process.cwd(), '.env.local')
const envLines = readFileSync(envPath, 'utf8').split('\n')
for (const line of envLines) {
  const [key, ...rest] = line.split('=')
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
}

const { PrismaClient } = await import('../src/generated/prisma/index.js')
const prisma = new PrismaClient()
const codes = await prisma.discountCode.findMany({ orderBy: { createdAt: 'desc' } })

if (codes.length === 0) {
  console.log('No discount codes found.')
} else {
  console.log('\nDiscount Codes:\n')
  console.log('CODE           | TYPE            | DISCOUNT        | USES  | ACTIVE | EXPIRES')
  console.log('─'.repeat(80))
  for (const c of codes) {
    const discount = c.type === 'free_delivery' ? 'Free delivery' : `${c.discount}%`
    const uses     = `${c.usedCount}/${c.maxUses}`
    const active   = c.active ? 'Yes' : 'No'
    const expires  = c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('en-GB') : '—'
    console.log(`${c.code.padEnd(15)}| ${c.type.padEnd(16)}| ${discount.padEnd(16)}| ${uses.padEnd(6)}| ${active.padEnd(7)}| ${expires}`)
  }
}

await prisma.$disconnect()
