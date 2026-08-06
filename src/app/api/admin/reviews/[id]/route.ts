import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminAuthenticated } from '@/lib/admin-auth'

// ── PATCH /api/admin/reviews/[id] — approve a review ─────────────────────────

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params
  const review = await prisma.review.findUnique({ where: { id } })
  if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.review.update({ where: { id }, data: { status: 'approved' } })
  return NextResponse.json({ success: true })
}

// ── DELETE /api/admin/reviews/[id] — delete a review ─────────────────────────

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params
  await prisma.review.delete({ where: { id } }).catch(() => null)
  return NextResponse.json({ success: true })
}
