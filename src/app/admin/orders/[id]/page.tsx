import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { statusLabel, statusColour } from '@/lib/orderStatus'
import AdminOrderActions from './AdminOrderActions'
import { isAdminAuthenticated } from '@/lib/admin-auth'

function displayRef(paystackRef: string | null, id: string) {
  return paystackRef ?? `TW-${id.slice(-6).toUpperCase()}`
}
function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!(await isAdminAuthenticated())) redirect('/admin/login')

  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } })
  if (!order) notFound()

  const orderNum = displayRef(order.paystackRef, order.id)

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-black transition-colors mb-8"
      >
        <ArrowLeft size={12} strokeWidth={1.5} />
        All Orders
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{orderNum}</h1>
          <p className="text-xs text-gray-500 mt-1">Placed {formatDate(order.createdAt)}</p>
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

      {/* References */}
      <section className="mb-6 border border-gray-100 rounded-md divide-y divide-gray-100">
        {order.paystackRef && (
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-xs text-gray-400">Paystack ref</span>
            <span className="text-xs font-mono font-medium text-gray-700">{order.paystackRef}</span>
          </div>
        )}
        <div className="flex items-center justify-between px-5 py-3">
          <span className="text-xs text-gray-400">Internal ID</span>
          <span className="text-xs font-mono text-gray-400">{order.id}</span>
        </div>
      </section>

      {/* Customer */}
      <section className="mb-6 border border-gray-100 rounded-md px-5 py-4">
        <h2 className="text-xs text-gray-500 mb-3">Customer</h2>
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
        <h2 className="text-xs text-gray-500 px-5 pt-4 mb-3">Items</h2>
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
                {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-gray-500">×{item.quantity}</p>
                <p className="text-sm font-medium">₦{(item.priceNgn * item.quantity).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
        {/* Price breakdown */}
        {(() => {
          const subtotal  = order.items.reduce((s, i) => s + i.priceNgn * i.quantity, 0)
          const discount  = order.discountAmount ?? 0
          const delivery  = order.totalNgn - subtotal + discount
          const isGuest   = order.userId === null
          return (
            <div className="border-t border-gray-100 divide-y divide-gray-50 text-sm">
              {discount > 0 && (
                <>
                  <div className="flex justify-between px-5 py-2.5 text-gray-500">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between px-5 py-2.5 text-green-600">
                    <span>Discount</span>
                    <span>−₦{discount.toLocaleString()}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between px-5 py-2.5 text-gray-500">
                <span className="flex items-center gap-1.5">
                  Delivery
                  {isGuest
                    ? <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">Guest</span>
                    : <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-50 text-green-600">Member — Free</span>
                  }
                </span>
                <span className={isGuest ? '' : 'text-green-600'}>
                  {isGuest ? `₦${delivery.toLocaleString()}` : 'Free'}
                </span>
              </div>
              <div className="flex justify-between px-5 py-3 font-semibold">
                <span>Total</span>
                <span>₦{order.totalNgn.toLocaleString()}</span>
              </div>
            </div>
          )
        })()}
      </section>


      {/* Admin actions — update status + tracking number */}
      <AdminOrderActions
        orderId={order.id}
        currentStatus={order.status}
        currentTracking={order.trackingNumber ?? ''}
        currentPhone={order.customerPhone ?? ''}
        currentAddress={order.address ?? ''}
        currentCity={order.city ?? ''}
        currentState={order.state ?? ''}
        currentCountry={order.country ?? 'Nigeria'}
      />
    </div>
  )
}
