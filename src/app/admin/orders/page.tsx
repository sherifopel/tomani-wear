import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { statusLabel, statusColour } from '@/lib/orderStatus'
import { isAdminAuthenticated } from '@/lib/admin-auth'

function orderNumber(id: string) { return `TW-${id.slice(-6).toUpperCase()}` }
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
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
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

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs text-gray-500">
              <th className="pb-3 font-normal">Order</th>
              <th className="pb-3 font-normal">Customer</th>
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
                <td className="py-3 font-medium">{orderNumber(order.id)}</td>
                <td className="py-3 text-gray-600">
                  <div>{order.customerName ?? '—'}</div>
                  <div className="text-xs text-gray-500">{order.customerEmail ?? ''}</div>
                </td>
                <td className="py-3 text-gray-500">{formatDate(order.createdAt)}</td>
                <td className="py-3 font-medium">₦{order.totalNgn.toLocaleString()}</td>
                <td className="py-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    order.paymentStatus === 'paid' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'
                  }`}>
                    {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColour(order.status)}`}>
                    {statusLabel(order.status)}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-xs text-gray-500 hover:text-black transition-colors underline underline-offset-2"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="text-center text-xs text-gray-500 py-16">No orders yet.</p>
        )}
      </div>
    </div>
  )
}
