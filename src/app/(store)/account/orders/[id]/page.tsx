import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import Breadcrumbs from '@/components/Breadcrumbs'
import { ArrowLeft } from 'lucide-react'
import { statusLabel, statusColour } from '@/lib/orderStatus'

function orderNumber(id: string) {
  return `TW-${id.slice(-6).toUpperCase()}`
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const session = await auth()
  if (!session?.user?.id) redirect(`/sign-in?callbackUrl=/account/orders/${id}`)

  const order = await prisma.order.findUnique({
    where:   { id },
    include: { items: true },
  })

  // 404 if not found or belongs to a different user
  if (!order || order.userId !== session.user.id) notFound()

  const orderNum = orderNumber(order.id)

  const crumbs = [
    { label: 'Home',    href: '/' },
    { label: 'Account', href: '/account' },
    { label: 'Orders',  href: '/account/orders' },
    { label: orderNum },
  ]

  return (
    <div data-testid="order-detail-page">
      <Breadcrumbs crumbs={crumbs} testId="order-detail-breadcrumb" />

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="text-xl font-semibold tracking-tight"
            data-testid="order-detail-heading"
          >
            {orderNum}
          </h1>
          <p className="text-xs text-gray-400 mt-1" data-testid="order-detail-date">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-black transition-colors duration-200"
            data-testid="order-detail-back"
          >
            <ArrowLeft size={12} strokeWidth={1.5} />
            Back to orders
          </Link>
          <span
            className={`text-[10px]  px-3 py-1 rounded-full font-medium ${statusColour(order.status)}`}
            data-testid="order-detail-status"
          >
            {statusLabel(order.status)}
          </span>
        </div>
      </div>

      {/* ── Items ── */}
      <section className="mb-8">
        <h2 className="text-xs  text-gray-400 mb-4">Items</h2>
        <ul className="flex flex-col divide-y divide-gray-100 border border-gray-100 rounded-md" data-testid="order-detail-items">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-4 px-5 py-4"
              data-testid="order-detail-item"
            >
              {/* Product thumbnail */}
              <div className="relative w-16 h-16 shrink-0 bg-gray-50 rounded overflow-hidden border border-gray-100">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                    No image
                  </div>
                )}
              </div>

              {/* Name + size */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-light truncate" data-testid="order-detail-item-name">{item.name}</p>
                {item.size && (
                  <p className="text-xs text-gray-400 mt-0.5" data-testid="order-detail-item-size">Size: {item.size}</p>
                )}
              </div>

              {/* Qty + price */}
              <div className="text-right shrink-0">
                <p className="text-xs text-gray-400">Qty {item.quantity}</p>
                <p className="text-sm font-medium" data-testid="order-detail-item-price">
                  ₦{(item.priceNgn * item.quantity).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Totals ── */}
      <section className="mb-8 border border-gray-100 rounded-md px-5 py-4">
        <h2 className="text-xs  text-gray-400 mb-4">Payment</h2>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>₦{order.totalNgn.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Delivery</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-semibold border-t border-gray-100 pt-2 mt-1" data-testid="order-detail-total">
            <span>Total</span>
            <span>₦{order.totalNgn.toLocaleString()}</span>
          </div>
        </div>
        {order.paystackRef && (
          <p className="text-[11px] text-gray-300 mt-3" data-testid="order-detail-ref">
            Ref: {order.paystackRef}
          </p>
        )}
      </section>

      {/* ── Tracking ── */}
      {order.trackingNumber && (
        <section className="mb-8 border border-gray-100 rounded-md px-5 py-4">
          <h2 className="text-xs  text-gray-400 mb-2">Tracking</h2>
          <p className="text-sm font-medium" data-testid="order-detail-tracking">{order.trackingNumber}</p>
          <p className="text-xs text-gray-400 mt-1">Contact your courier with this reference to track your delivery.</p>
        </section>
      )}

      {/* ── Delivery address ── */}
      {order.address && (
        <section className="mb-8 border border-gray-100 rounded-md px-5 py-4">
          <h2 className="text-xs  text-gray-400 mb-4">Delivery Address</h2>
          <address className="not-italic text-sm text-gray-600 leading-relaxed" data-testid="order-detail-address">
            {order.customerName && <p className="font-medium text-black">{order.customerName}</p>}
            <p>{order.address}</p>
            {order.city && <p>{order.city}{order.state ? `, ${order.state}` : ''}</p>}
            {order.country && <p>{order.country}</p>}
            {order.customerPhone && <p className="mt-1 text-gray-400">{order.customerPhone}</p>}
          </address>
        </section>
      )}

    </div>
  )
}
