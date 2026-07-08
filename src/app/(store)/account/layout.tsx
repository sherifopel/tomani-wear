import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AccountSidebarNav from '@/components/AccountSidebarNav'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in?callbackUrl=/account/orders')

  const [latestOrder, orderCount] = await Promise.all([
    prisma.order.findFirst({
      where:   { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select:  { status: true },
    }),
    prisma.order.count({ where: { userId: session.user.id } }),
  ])

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">

      {/* ── Mobile: profile + horizontal tab nav ─────────────────────── */}
      <div className="md:hidden mb-8">
        <p className="text-base font-semibold tracking-tight">{session.user.name}</p>
        <div className="mt-6 -mx-6 px-6 overflow-x-auto">
          <AccountSidebarNav
            orderCount={orderCount}
            latestOrderStatus={latestOrder?.status ?? null}
            variant="mobile"
          />
        </div>
        <div className="mt-6 border-b border-gray-100" />
      </div>

      {/* ── Desktop: two-column layout ───────────────────────────────── */}
      <div className="flex gap-16">

        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-48 shrink-0 pt-1">
          <div className="mb-8">
            <p className="text-sm font-semibold tracking-tight">{session.user.name}</p>
          </div>

          <AccountSidebarNav
            orderCount={orderCount}
            latestOrderStatus={latestOrder?.status ?? null}
            variant="desktop"
          />
        </aside>

        {/* Page content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>
    </div>
  )
}
