import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import SignInForm from './SignInForm'

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const [session, params] = await Promise.all([auth(), searchParams])
  const callbackUrl = params.callbackUrl ?? '/account'

  // Already logged in — skip the page entirely
  if (session?.user) redirect(callbackUrl)

  return <SignInForm callbackUrl={callbackUrl} />
}
