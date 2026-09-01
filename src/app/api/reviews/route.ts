import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ── GET /api/reviews?slug=xxx ─────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })

  const reviews = await prisma.review.findMany({
    where:   { productSlug: slug, status: 'approved' },
    orderBy: { createdAt: 'desc' },
    select:  { id: true, name: true, rating: true, comment: true, createdAt: true },
  })

  const avg = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : 0

  return NextResponse.json({ reviews, average: avg, total: reviews.length })
}

// ── POST /api/reviews ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const { slug, name, email, rating, comment } = body

  if (!slug || typeof slug !== 'string')
    return NextResponse.json({ error: 'Product slug is required' }, { status: 400 })
  if (!name || typeof name !== 'string' || name.trim().length < 2)
    return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 })
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  if (!rating || !Number.isInteger(rating) || rating < 1 || rating > 5)
    return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
  if (comment && typeof comment === 'string' && comment.length > 1000)
    return NextResponse.json({ error: 'Review must be under 1000 characters' }, { status: 400 })

  await prisma.review.create({
    data: {
      productSlug: slug.trim(),
      name:        name.trim().slice(0, 100),
      email:       email.trim().toLowerCase(),
      rating,
      comment:     comment?.trim() || null,
      status:      'pending',
    },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
