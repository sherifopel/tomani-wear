import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    const body = await req.json()
    const {
      paystackReference,
      totalAmount,
      items,
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      state,
      country,
    } = body

    if (!paystackReference || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Only save to DB if the customer is logged in — guest orders still get
    // a confirmation page but won't appear in order history
    if (!session?.user?.id) {
      const orderNumber = `TW-${Date.now().toString(36).toUpperCase()}`
      return NextResponse.json({ success: true, orderNumber })
    }

    const order = await prisma.order.create({
      data: {
        userId:        session.user.id,
        totalNgn:      Math.round(totalAmount),
        paystackRef:   paystackReference,
        status:        'processing',
        customerName:  customerName  ?? null,
        customerEmail: customerEmail ?? null,
        customerPhone: customerPhone ?? null,
        address:       address       ?? null,
        city:          city          ?? null,
        state:         state         ?? null,
        country:       country       ?? null,
        items: {
          create: items.map((i: {
            productId: string
            name: string
            price: number
            size?: string
            quantity: number
            image?: string
          }) => ({
            productId: i.productId,
            name:      i.name,
            priceNgn:  Math.round(i.price),
            size:      i.size ?? null,
            quantity:  i.quantity,
            imageUrl:  i.image ?? null,
          })),
        },
      },
    })

    const orderNumber = `TW-${order.id.slice(-6).toUpperCase()}`
    return NextResponse.json({ success: true, orderNumber, orderId: order.id })

  } catch (err) {
    console.error('Order creation failed:', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
