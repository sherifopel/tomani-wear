import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { sendOrderAcknowledgement } from '@/lib/email'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { id } = await params
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } })

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  if (!order.customerEmail) return NextResponse.json({ error: 'No email address on this order' }, { status: 400 })
  if (!order.paystackRef)   return NextResponse.json({ error: 'No payment reference on this order' }, { status: 400 })

  // Block duplicate sends — return a clear signal so the button can reflect this
  if (order.acknowledgedAt) {
    return NextResponse.json({ error: 'Already sent', alreadySent: true }, { status: 409 })
  }

  try {
    await sendOrderAcknowledgement({
      to:             order.customerEmail,
      customerName:   order.customerName,
      paystackRef:    order.paystackRef,
      totalNgn:       order.totalNgn,
      discountAmount: order.discountAmount,
      isGuest:        order.userId === null,
      items:          order.items,
    })

    await prisma.order.update({
      where: { id },
      data:  { acknowledgedAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to send email'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
