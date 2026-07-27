import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { limiters, checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    if (limiters) {
      const blocked = await checkRateLimit(req, limiters.discount)
      if (blocked) return blocked
    }

    const { code } = await req.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, message: 'Please enter a discount code' }, { status: 400 })
    }

    const discount = await prisma.discountCode.findUnique({
      where: { code: code.trim().toUpperCase() },
    })

    if (!discount) {
      return NextResponse.json({ valid: false, message: 'Invalid discount code' })
    }
    if (!discount.active) {
      return NextResponse.json({ valid: false, message: 'This discount code is no longer active' })
    }
    if (discount.usedCount >= discount.maxUses) {
      return NextResponse.json({ valid: false, message: 'This discount code has been fully claimed' })
    }
    if (discount.expiresAt && discount.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, message: 'This discount code has expired' })
    }

    return NextResponse.json({
      valid:      true,
      percentage: discount.discount,
      codeId:     discount.id,
      code:       discount.code,
      remaining:  discount.maxUses - discount.usedCount,
    })
  } catch {
    return NextResponse.json({ valid: false, message: 'Something went wrong' }, { status: 500 })
  }
}
