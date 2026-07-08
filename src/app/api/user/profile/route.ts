import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { name, phone } = await req.json()

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name:  typeof name  === 'string' ? name.trim()  : undefined,
      phone: typeof phone === 'string' ? phone.trim() : undefined,
    },
    select: { name: true, email: true, phone: true },
  })

  return NextResponse.json(user)
}
