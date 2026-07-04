import { auth } from '@/auth'
import OrderConfirmationContent from './OrderConfirmationContent'

type Props = {
  searchParams: Promise<{
    ref?:   string
    order?: string
    name?:  string
    email?: string
  }>
}

export default async function OrderConfirmationPage({ searchParams }: Props) {
  const [session, params] = await Promise.all([auth(), searchParams])

  // Logged-in name takes priority; fall back to the name the guest typed at checkout
  const userName   = session?.user?.name ?? params.name ?? null
  const userEmail  = session?.user?.email ?? params.email ?? null
  const isLoggedIn = !!session?.user

  return (
    <OrderConfirmationContent
      paystackRef={params.ref ?? null}
      order={params.order ?? null}
      userName={userName}
      userEmail={userEmail}
      isLoggedIn={isLoggedIn}
    />
  )
}
