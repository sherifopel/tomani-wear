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

function CustomerBadge({ userId }: { userId: string | null }) {
  return userId
    ? <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 font-semibold tracking-wide">👑 Member</span>
    : <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold tracking-wide">Guest</span>
}

export default async function AdminOrdersPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login')

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  })

  const totalRevenue  = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.totalNgn, 0)
  const paidCount     = orders.filter(o => o.paymentStatus === 'paid').length
  const pendingCount  = orders.filter(o => o.paymentStatus !== 'paid').length

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold tracking-[0.2em] text-black">TOMANNI</span>
          <span className="text-gray-200">|</span>
          <span className="text-xs text-black font-medium">Orders</span>
          <Link href="/admin/reviews" className="text-xs text-gray-500 hover:text-black transition-colors">Reviews</Link>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button type="submit" className="text-xs text-gray-400 hover:text-black transition-colors">
            Sign out
          </button>
        </form>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-xs text-gray-500 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white border border-gray-100 rounded-lg px-4 py-4">
            <p className="text-xs text-gray-400 mb-1">Revenue</p>
            <p className="text-lg font-semibold text-black">₦{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg px-4 py-4">
            <p className="text-xs text-gray-400 mb-1">Paid</p>
            <p className="text-lg font-semibold text-green-600">{paidCount}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg px-4 py-4">
            <p className="text-xs text-gray-400 mb-1">Pending</p>
            <p className="text-lg font-semibold text-amber-600">{pendingCount}</p>
          </div>
        </div>

        {orders.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-lg py-20 text-center">
            <p className="text-sm text-gray-400">No orders yet.</p>
          </div>
        )}

        {/* Mobile + Tablet: card list (shown below lg = 1024px) */}
        <div className="lg:hidden space-y-3">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              {/* Card header: ref + total */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-mono font-bold text-black tracking-wide">{displayRef(order.paystackRef, order.id)}</span>
                  <CustomerBadge userId={order.userId} />
                </div>
                <span className="text-base font-bold text-black shrink-0 ml-3">₦{order.totalNgn.toLocaleString()}</span>
              </div>

              {/* Card body: customer info */}
              <div className="px-5 py-4">
                <p className="text-sm font-semibold text-gray-900">{order.customerName ?? '—'}</p>
                {order.customerEmail && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{order.customerEmail}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</p>
              </div>

              {/* Card footer: status pills + actions */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50/80 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                    order.paymentStatus === 'paid' ? 'text-green-700 bg-green-100' : 'text-amber-700 bg-amber-100'
                  }`}>
                    {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${statusColour(order.status)}`}>
                    {statusLabel(order.status)}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  {order.customerEmail && <AcknowledgeButton orderId={order.id} acknowledged={!!order.acknowledgedAt} />}
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-xs font-semibold text-black hover:opacity-60 transition-opacity"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop only: table (shown at lg = 1024px+) */}
        <div className="hidden lg:block bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '170px' }} />
              <col style={{ width: '160px' }} />
              <col style={{ width: '190px' }} />
              <col style={{ width: '100px' }} />
              <col style={{ width: '100px' }} />
              <col style={{ width: '70px' }} />
              <col style={{ width: '110px' }} />
              <col style={{ width: '160px' }} />
            </colgroup>
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-[11px] text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-3 py-3 font-medium">Name</th>
                <th className="px-3 py-3 font-medium">Email</th>
                <th className="px-3 py-3 font-medium">Date</th>
                <th className="px-3 py-3 font-medium">Total</th>
                <th className="px-3 py-3 font-medium">Payment</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-5 py-4 font-mono text-xs font-bold text-black whitespace-nowrap">{displayRef(order.paystackRef, order.id)}</td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="truncate text-sm text-gray-800 font-medium">{order.customerName ?? '—'}</span>
                      <CustomerBadge userId={order.userId} />
                    </div>
                  </td>
                  <td className="px-3 py-4 text-gray-500 truncate text-xs">{order.customerEmail ?? '—'}</td>
                  <td className="px-3 py-4 text-gray-500 whitespace-nowrap text-xs">{formatDate(order.createdAt)}</td>
                  <td className="px-3 py-4 font-semibold text-black whitespace-nowrap">₦{order.totalNgn.toLocaleString()}</td>
                  <td className="px-3 py-4">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-semibold whitespace-nowrap ${
                      order.paymentStatus === 'paid' ? 'text-green-700 bg-green-100' : 'text-amber-700 bg-amber-100'
                    }`}>
                      {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-semibold whitespace-nowrap ${statusColour(order.status)}`}>
                      {statusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center justify-end gap-3">
                      {order.customerEmail && <AcknowledgeButton orderId={order.id} acknowledged={!!order.acknowledgedAt} />}
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-xs font-semibold text-zinc-900 hover:opacity-60 transition-opacity whitespace-nowrap"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
