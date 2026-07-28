import { NextRequest, NextResponse } from 'next/server'
import { hashAdminPassword } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword || !password) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  if (hashAdminPassword(password) !== hashAdminPassword(adminPassword)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const token = hashAdminPassword(adminPassword)
  const res = NextResponse.json({ success: true })
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   60 * 60 * 24 * 7, // 7 days
    path:     '/',
  })
  return res
}
