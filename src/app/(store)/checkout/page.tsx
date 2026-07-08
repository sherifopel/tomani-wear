import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Breadcrumbs from '@/components/Breadcrumbs'
import CheckoutClient from './CheckoutClient'

const CRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Cart', href: '/cart' },
  { label: 'Checkout' },
]

export type SavedDetails = {
  phone:   string | null
  address: string | null
  city:    string | null
  state:   string | null
  country: string | null
} | null

export default async function CheckoutPage() {
  const session = await auth()

  let savedDetails: SavedDetails = null

  if (session?.user?.id) {
    const [defaultAddress, user] = await Promise.all([
      prisma.address.findFirst({
        where:   { userId: session.user.id, isDefault: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.findUnique({
        where:  { id: session.user.id },
        select: { phone: true },
      }),
    ])

    savedDetails = {
      phone:   user?.phone            ?? null,
      address: defaultAddress?.line1   ?? null,
      city:    defaultAddress?.city    ?? null,
      state:   defaultAddress?.state   ?? null,
      country: defaultAddress?.country ?? null,
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pb-32 lg:pb-16 pt-4" data-testid="checkout-page">
      <Breadcrumbs crumbs={CRUMBS} testId="checkout-breadcrumb" />
      <CheckoutClient savedDetails={savedDetails} />
    </div>
  )
}
