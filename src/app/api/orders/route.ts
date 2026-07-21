import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

async function verifyPaystackPayment(reference: string, expectedAmountKobo: number) {
  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  })
  if (!res.ok) return { verified: false, reason: 'Paystack API error' }

  const { data } = await res.json()
  if (data.status !== 'success') return { verified: false, reason: `Payment status: ${data.status}` }
  if (data.amount !== expectedAmountKobo) return { verified: false, reason: 'Amount mismatch' }

  return { verified: true }
}

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
      discountCode,
      discountAmount,
    } = body

    if (!paystackReference || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify the payment actually succeeded with Paystack before saving anything
    const amountKobo = Math.round(totalAmount) * 100
    const { verified, reason } = await verifyPaystackPayment(paystackReference, amountKobo)
    if (!verified) {
      return NextResponse.json({ error: `Payment verification failed: ${reason}` }, { status: 402 })
    }

    // Guest checkout — no DB record, still gets a confirmation page
    if (!session?.user?.id) {
      const orderNumber = `TW-${Date.now().toString(36).toUpperCase()}`
      return NextResponse.json({ success: true, orderNumber })
    }

    const orderData = {
      userId:         session.user.id,
      totalNgn:       Math.round(totalAmount),
      paystackRef:    paystackReference,
      status:         'processing',
      paymentStatus:  'paid',
      customerName:   customerName   ?? null,
      customerEmail:  customerEmail  ?? null,
      customerPhone:  customerPhone  ?? null,
      address:        address        ?? null,
      city:           city           ?? null,
      state:          state          ?? null,
      country:        country        ?? null,
      discountCode:   discountCode   ?? null,
      discountAmount: discountAmount ? Math.round(discountAmount) : null,
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
    }

    // When a discount code is used, create the order and increment usedCount in one
    // atomic transaction so the count can never drift out of sync.
    let order
    if (discountCode) {
      const result = await prisma.$transaction([
        prisma.order.create({ data: orderData }),
        prisma.discountCode.update({
          where: { code: discountCode },
          data:  { usedCount: { increment: 1 } },
        }),
      ])
      order = result[0]
    } else {
      order = await prisma.order.create({ data: orderData })
    }

    const orderNumber = `TW-${order.id.slice(-6).toUpperCase()}`
    return NextResponse.json({ success: true, orderNumber, orderId: order.id })

  } catch (err) {
    console.error('Order creation failed:', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
