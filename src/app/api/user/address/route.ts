import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const { phone, address, city, state, country } = await req.json()

    // Save phone on the user record
    if (phone) {
      await prisma.user.update({
        where: { id: session.user.id },
        data:  { phone },
      })
    }

    // Upsert the default address — update it if one exists, create it if not
    if (address && city && state) {
      const existing = await prisma.address.findFirst({
        where: { userId: session.user.id, isDefault: true },
      })

      if (existing) {
        await prisma.address.update({
          where: { id: existing.id },
          data:  { line1: address, city, state, country: country ?? 'Nigeria' },
        })
      } else {
        await prisma.address.create({
          data: {
            userId:    session.user.id,
            line1:     address,
            city,
            state,
            country:   country ?? 'Nigeria',
            isDefault: true,
          },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Address save failed:', err)
    return NextResponse.json({ error: 'Failed to save address' }, { status: 500 })
  }
}
