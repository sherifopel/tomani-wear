import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://tomani-wear.vercel.app',
  'https://tomanni-wear.sanity.studio',
]

function cors(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[1]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

function isAuthorized(req: NextRequest) {
  const secret = process.env.NEXT_PUBLIC_ADMIN_SECRET
  if (!secret) return false
  return req.headers.get('authorization') === `Bearer ${secret}`
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: cors(req.headers.get('origin')) })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const origin = req.headers.get('origin')
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors(origin) })
  }
  const { id } = await params
  const body = await req.json()
  const updated = await prisma.discountCode.update({
    where: { id },
    data: {
      ...(typeof body.active === 'boolean' ? { active: body.active } : {}),
      ...(body.maxUses !== undefined ? { maxUses: Number(body.maxUses) } : {}),
    },
  })
  return NextResponse.json(updated, { headers: cors(origin) })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const origin = req.headers.get('origin')
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors(origin) })
  }
  const { id } = await params
  await prisma.discountCode.delete({ where: { id } })
  return new NextResponse(null, { status: 204, headers: cors(origin) })
}
