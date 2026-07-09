import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { statusLabel, statusColour } from '@/lib/orderStatus'
import AdminOrderActions from './AdminOrderActions'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase())

function orderNumber(id: string) { return `TW-${id.slice(-6).toUpperCase()}` }
function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
    redirect('/')
  }

  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } })
  if (!order) notFound()

  const orderNum = orderNumber(order.id)

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-black transition-colors mb-8"
      >
        <ArrowLeft size={12} strokeWidth={1.5} />
        All Orders
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{orderNum}</h1>
          <p className="text-xs text-gray-400 mt-1">Placed {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`text-[10px] px-3 py-1 rounded-full font-medium ${
            order.paymentStatus === 'paid' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'
          }`}>
            {order.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
          </span>
          <span className={`text-[10px] px-3 py-1 rounded-full font-medium ${statusColour(order.status)}`}>
            {statusLabel(order.status)}
          </span>
        </div>
      </div>

      {/* Customer */}
      <section className="mb-6 border border-gray-100 rounded-md px-5 py-4">
        <h2 className="text-xs text-gray-400 mb-3">Customer</h2>
        <div className="text-sm space-y-1">
          {order.customerName  && <p className="font-medium">{order.customerName}</p>}
          {order.customerEmail && <p className="text-gray-500">{order.customerEmail}</p>}
          {order.customerPhone && <p className="text-gray-500">{order.customerPhone}</p>}
        </div>
        {order.address && (
          <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500 space-y-0.5">
            <p>{order.address}</p>
            {order.city && <p>{order.city}{order.state ? `, ${order.state}` : ''}</p>}
            {order.country && <p>{order.country}</p>}
          </div>
        )}
      </section>

      {/* Items */}
      <section className="mb-6 border border-gray-100 rounded-md overflow-hidden">
        <h2 className="text-xs text-gray-400 px-5 pt-4 mb-3">Items</h2>
        <ul className="divide-y divide-gray-50">
          {order.items.map(item => (
            <li key={item.id} className="flex items-center gap-4 px-5 py-3">
              <div className="relative w-12 h-12 shrink-0 bg-gray-50 rounded overflow-hidden">
                {item.imageUrl
                  ? <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="48px" />
                  : <div className="w-full h-full bg-gray-100" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-light truncate">{item.name}</p>
                {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-gray-400">×{item.quantity}</p>
                <p className="text-sm font-medium">₦{(item.priceNgn * item.quantity).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-semibold px-5 py-4 border-t border-gray-100 text-sm">
          <span>Total</span>
          <span>₦{order.totalNgn.toLocaleString()}</span>
        </div>
      </section>

      {/* Payment ref */}
      {order.paystackRef && (
        <p className="text-xs text-gray-300 mb-6">Paystack ref: {order.paystackRef}</p>
      )}

      {/* Admin actions — update status + tracking number */}
      <AdminOrderActions
        orderId={order.id}
        currentStatus={order.status}
        currentTracking={order.trackingNumber ?? ''}
      />
    </div>
  )
}
