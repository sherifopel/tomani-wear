import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { sendOrderAcknowledgement } from '@/lib/email'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { id } = await params
  const order = await prisma.order.findUnique({ where: { id } })

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  if (!order.customerEmail) return NextResponse.json({ error: 'No email address on this order' }, { status: 400 })

  const orderNumber = `TW-${order.id.slice(-6).toUpperCase()}`

  try {
    await sendOrderAcknowledgement({
      to:           order.customerEmail,
      customerName: order.customerName,
      orderNumber,
      totalNgn:     order.totalNgn,
      paystackRef:  order.paystackRef,
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to send email'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
