import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// These origins are allowed to call this API (Next.js app + Sanity Studio)
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://tomani-wear.vercel.app',
  'https://tomanni-wear.sanity.studio',
]

function cors(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[1]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

function isAuthorized(req: NextRequest) {
  const secret = process.env.NEXT_PUBLIC_ADMIN_SECRET
  if (!secret) return false
  return req.headers.get('authorization') === `Bearer ${secret}`
}

// Browser sends a preflight OPTIONS request before a cross-origin fetch.
// We reply with the CORS headers so the actual request is allowed through.
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: cors(req.headers.get('origin')) })
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin')
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors(origin) })
  }
  const codes = await prisma.discountCode.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(codes, { headers: cors(origin) })
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors(origin) })
  }
  try {
    const { code, type, discount, maxUses, expiresAt } = await req.json()
    const codeType = type === 'free_delivery' ? 'free_delivery' : 'percentage'
    if (!code) {
      return NextResponse.json(
        { error: 'code is required' },
        { status: 400, headers: cors(origin) }
      )
    }
    if (codeType === 'percentage' && !discount) {
      return NextResponse.json(
        { error: 'discount percentage is required for percentage codes' },
        { status: 400, headers: cors(origin) }
      )
    }
    const created = await prisma.discountCode.create({
      data: {
        code:      code.trim().toUpperCase(),
        type:      codeType,
        discount:  codeType === 'free_delivery' ? 0 : Number(discount),
        maxUses:   Number(maxUses ?? 5),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })
    return NextResponse.json(created, { status: 201, headers: cors(origin) })
  } catch (e: unknown) {
    // P2002 = unique constraint violation (code already exists)
    if (e && typeof e === 'object' && 'code' in e && (e as { code: string }).code === 'P2002') {
      return NextResponse.json(
        { error: 'That code already exists' },
        { status: 409, headers: cors(origin) }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create code' },
      { status: 500, headers: cors(origin) }
    )
  }
}
