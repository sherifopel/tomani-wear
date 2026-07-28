import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminAuthenticated } from '@/lib/admin-auth'

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

  return NextResponse.json({ success: true, order })
}
