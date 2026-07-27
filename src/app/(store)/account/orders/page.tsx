import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { statusLabel, statusColour } from '@/lib/orderStatus'

function orderNumber(id: string) {
  return `TW-${id.slice(-6).toUpperCase()}`
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/sign-in?callbackUrl=/account/orders')

  const orders = await prisma.order.findMany({
    where:   { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  })

  return (
    <div data-testid="orders-page">

      <h1
        className="text-xl font-semibold tracking-tight mb-8 text-center"
        data-testid="orders-heading"
      >
        My Orders
      </h1>

      {/* ── Orders list ──────────────────────────────────────────────── */}
      {orders.length === 0 ? (
        <div className="text-center py-16" data-testid="orders-empty">
          <p className="text-xs text-gray-500 mb-6">
            Your orders will appear here once you&apos;ve made a purchase.
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-black text-white text-xs  border border-black btn-wipe"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col" data-testid="orders-list">
          {orders.map((order, index) => (
            <li key={order.id}>
              {index > 0 && <hr className="border-gray-100 my-2" />}
              <Link
                href={`/account/orders/${order.id}`}
                data-testid="orders-list-item"
                className="group flex items-center justify-between border border-gray-100 rounded-md px-4 py-5 hover:bg-orange-50 transition-colors duration-200"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium" data-testid="orders-order-number">
                      {orderNumber(order.id)}
                    </span>
                    <span
                      className={`text-[10px]  px-2 py-0.5 rounded-full font-medium ${statusColour(order.status)}`}
                      data-testid="orders-order-status"
                    >
                      {statusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500" data-testid="orders-order-date">
                    {formatDate(order.createdAt)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-sm font-medium" data-testid="orders-order-total">
                    ₦{order.totalNgn.toLocaleString()}
                  </span>
                  <ChevronRight size={14} strokeWidth={1.5} className="text-gray-300 group-hover:text-black transition-colors" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
