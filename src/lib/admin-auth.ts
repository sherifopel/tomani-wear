import { createHash } from 'crypto'
import { cookies } from 'next/headers'

export function hashAdminPassword(password: string): string {
  return createHash('sha256').update(password + 'tomanni-admin-v1').digest('hex')
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return false
  const pw = process.env.ADMIN_PASSWORD
  if (!pw) return false
  return token === hashAdminPassword(pw)
}
