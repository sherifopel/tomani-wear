import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { statusLabel, statusColour } from '@/lib/orderStatus'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import AcknowledgeButton from './AcknowledgeButton'

function displayRef(paystackRef: string | null, id: string) {
  return paystackRef ?? `TW-${id.slice(-6).toUpperCase()}`
}
function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminOrdersPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login')

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-xl font-semibold tracking-tight">Orders</h1>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">{orders.length} total</span>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="text-xs text-gray-400 hover:text-black transition-colors">
              Sign out
            </button>
          </form>
        </div>
      </div>

      {orders.length === 0 && (
        <p className="text-center text-xs text-gray-500 py-16">No orders yet.</p>
      )}

      {/* Mobile: card list */}
      <div className="sm:hidden space-y-3">
        {orders.map(order => (
          <div key={order.id} className="border border-gray-100 rounded-md px-4 py-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <p className="text-xs font-mono font-semibold text-gray-800 truncate">{displayRef(order.paystackRef, order.id)}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-sm font-medium truncate">{order.customerName ?? '—'}</p>
                  {order.userId
                    ? <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">Member</span>
                    : <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">Guest</span>
                  }
                </div>
                {order.customerEmail && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">{order.customerEmail}</p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold">₦{order.totalNgn.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                order.paymentStatus === 'paid' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'
              }`}>
                {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColour(order.status)}`}>
                {statusLabel(order.status)}
              </span>
            </div>

            <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
              {order.customerEmail && <AcknowledgeButton orderId={order.id} />}
              <Link
                href={`/admin/orders/${order.id}`}
                className="text-xs text-gray-500 hover:text-black transition-colors underline underline-offset-2"
              >
                Manage
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '130px' }} />
            <col style={{ width: '150px' }} />
            <col style={{ width: '200px' }} />
            <col style={{ width: '100px' }} />
            <col style={{ width: '110px' }} />
            <col style={{ width: '80px' }} />
            <col style={{ width: '100px' }} />
            <col style={{ width: '120px' }} />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
              <th className="pb-3 font-normal">Order</th>
              <th className="pb-3 font-normal">Name</th>
              <th className="pb-3 font-normal">Email</th>
              <th className="pb-3 font-normal">Date</th>
              <th className="pb-3 font-normal">Total</th>
              <th className="pb-3 font-normal">Payment</th>
              <th className="pb-3 font-normal">Status</th>
              <th className="pb-3 font-normal"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 font-medium whitespace-nowrap text-xs font-mono">{displayRef(order.paystackRef, order.id)}</td>
                <td className="py-3 pr-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="truncate text-gray-700">{order.customerName ?? '—'}</span>
                    {order.userId
                      ? <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">Member</span>
                      : <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">Guest</span>
                    }
                  </div>
                </td>
                <td className="py-3 text-gray-500 truncate pr-2 text-xs">{order.customerEmail ?? '—'}</td>
                <td className="py-3 text-gray-500 whitespace-nowrap text-xs">{formatDate(order.createdAt)}</td>
                <td className="py-3 font-medium whitespace-nowrap">₦{order.totalNgn.toLocaleString()}</td>
                <td className="py-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                    order.paymentStatus === 'paid' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'
                  }`}>
                    {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColour(order.status)}`}>
                    {statusLabel(order.status)}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    {order.customerEmail && <AcknowledgeButton orderId={order.id} />}
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs text-gray-500 hover:text-black transition-colors underline underline-offset-2"
                    >
                      Manage
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
