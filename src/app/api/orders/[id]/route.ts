import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { sendStatusUpdate } from '@/lib/email'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const { status, trackingNumber, address, city, state, country, customerPhone } = body

  const validStatuses = ['processing', 'dispatched', 'delivered', 'cancelled', 'returned']
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  // Fetch current order so we know if status is actually changing
  const existing = await prisma.order.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  const order = await prisma.order.update({
    where: { id },
    data: {
      ...(status         !== undefined && { status }),
      ...(trackingNumber !== undefined && { trackingNumber }),
      ...(address        !== undefined && { address }),
      ...(city           !== undefined && { city }),
      ...(state          !== undefined && { state }),
      ...(country        !== undefined && { country }),
      ...(customerPhone  !== undefined && { customerPhone }),
    },
  })

  // Send status update email if status changed and customer has an email
  if (status && status !== existing.status && order.customerEmail && order.paystackRef) {
    sendStatusUpdate({
      to:            order.customerEmail,
      customerName:  order.customerName,
      paystackRef:   order.paystackRef,
      status:        order.status,
      trackingNumber: order.trackingNumber ?? null,
    }).catch(() => {}) // fire-and-forget — don't fail the save if email errors
  }

  return NextResponse.json({ success: true, order })
}
