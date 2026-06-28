import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

// Write client — needs the secret token to create documents
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      paystackReference,
      totalAmount,
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      state,
      country,
      items,
    } = body

    if (!paystackReference || !customerEmail || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const orderNumber = `TW-${Date.now().toString(36).toUpperCase()}`

    const order = await writeClient.create({
      _type: 'order',
      orderNumber,
      status: 'paid',
      paystackReference,
      totalAmount,
      paidAt: new Date().toISOString(),
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      state,
      country,
      items,
    })

    return NextResponse.json({ success: true, orderNumber, orderId: order._id })
  } catch (err) {
    console.error('Order creation failed:', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
