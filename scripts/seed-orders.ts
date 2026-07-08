/**
 * Seeds test orders for a given user email.
 * Run: pnpm tsx scripts/seed-orders.ts
 *
 * Creates one order per status so you can see all colour-coded badges at once.
 */

import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'

function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter })
}

const prisma = createClient()

const USER_EMAIL = 'sherif.opel1@gmail.com'

const TEST_ORDERS: Array<{
  status:       string
  totalNgn:     number
  customerName: string
  address:      string
  city:         string
  state:        string
  country:      string
  items: Array<{ productId: string; name: string; priceNgn: number; size?: string; quantity: number; imageUrl?: string }>
}> = [
  {
    status:       'processing',
    totalNgn:     65000,
    customerName: 'Sherif Opel',
    address:      '12 Lagos-Ibadan Expressway',
    city:         'Lagos',
    state:        'Lagos State',
    country:      'Nigeria',
    items: [
      { productId: 'test-001', name: 'World Cup Portugal Wind Breaker', priceNgn: 65000, size: 'L', quantity: 1, imageUrl: 'https://cdn.sanity.io/images/tu8h6v2e/production/ad78a860c643d402e180eccf2365b3e703b17684-1039x1280.jpg' },
    ],
  },
  {
    status:       'dispatched',
    totalNgn:     125000,
    customerName: 'Sherif Opel',
    address:      '12 Lagos-Ibadan Expressway',
    city:         'Lagos',
    state:        'Lagos State',
    country:      'Nigeria',
    items: [
      { productId: 'test-002', name: 'Faces Double Sleeve T-shirt',   priceNgn: 65000, size: 'M',  quantity: 1, imageUrl: 'https://cdn.sanity.io/images/tu8h6v2e/production/8a2eba1efd8dc26360f8f24a98d1f2c34db9779e-1024x1024.jpg' },
      { productId: 'test-003', name: 'World Cup Brazil Wind Breaker',  priceNgn: 60000, size: 'L',  quantity: 1, imageUrl: 'https://cdn.sanity.io/images/tu8h6v2e/production/44e8943de261c1b98b428751d9341c293ce32de3-1039x1280.jpg' },
    ],
  },
  {
    status:       'delivered',
    totalNgn:     60000,
    customerName: 'Sherif Opel',
    address:      '12 Lagos-Ibadan Expressway',
    city:         'Lagos',
    state:        'Lagos State',
    country:      'Nigeria',
    items: [
      { productId: 'test-004', name: 'Tomanni Crop Set', priceNgn: 60000, size: 'S', quantity: 1, imageUrl: 'https://cdn.sanity.io/images/tu8h6v2e/production/235e7b8498bac1704764acea49bc09875ca5633d-736x1164.jpg' },
    ],
  },
  {
    status:       'cancelled',
    totalNgn:     60000,
    customerName: 'Sherif Opel',
    address:      '12 Lagos-Ibadan Expressway',
    city:         'Lagos',
    state:        'Lagos State',
    country:      'Nigeria',
    items: [
      { productId: 'test-005', name: 'World Cup Argentina Wind Breaker', priceNgn: 60000, size: 'XL', quantity: 1, imageUrl: 'https://cdn.sanity.io/images/tu8h6v2e/production/67892bdf5a8a7a46e6138d0b76535a861023e5a4-1039x1280.jpg' },
    ],
  },
]

async function main() {
  const user = await prisma.user.findUnique({ where: { email: USER_EMAIL } })

  if (!user) {
    console.error(`No user found with email: ${USER_EMAIL}`)
    console.error('Sign in to the site first, then re-run this script.')
    process.exit(1)
  }

  console.log(`Seeding orders for ${user.name} (${user.email})...\n`)

  for (const order of TEST_ORDERS) {
    const created = await prisma.order.create({
      data: {
        userId:        user.id,
        totalNgn:      order.totalNgn,
        paystackRef:   `TW-SEED-${Date.now()}`,
        status:        order.status,
        customerName:  order.customerName,
        customerEmail: user.email,
        address:       order.address,
        city:          order.city,
        state:         order.state,
        country:       order.country,
        items: {
          create: order.items.map(i => ({
            productId: i.productId,
            name:      i.name,
            priceNgn:  i.priceNgn,
            size:      i.size ?? null,
            quantity:  i.quantity,
            imageUrl:  i.imageUrl ?? null,
          })),
        },
      },
    })

    const num = `TW-${created.id.slice(-6).toUpperCase()}`
    console.log(`  ✓ ${num}  [${order.status.padEnd(11)}]  ₦${order.totalNgn.toLocaleString()}`)
  }

  console.log(`\nDone. Visit /account/orders to see them.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
