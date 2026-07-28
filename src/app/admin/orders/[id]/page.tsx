import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { statusLabel, statusColour } from '@/lib/orderStatus'
import AdminOrderActions from './AdminOrderActions'
import AcknowledgeButton from '../AcknowledgeButton'
import { isAdminAuthenticated } from '@/lib/admin-auth'

function displayRef(paystackRef: string | null, id: string) {
  return paystackRef ?? `TW-${id.slice(-6).toUpperCase()}`
}
function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function headerStyle(status: string): { bg: string; text: string; sub: string } {
  switch (status) {
    case 'processing': return { bg: 'bg-gradient-to-br from-amber-100 via-orange-50 to-amber-50',  text: 'text-amber-950',  sub: 'text-amber-700/60' }
    case 'dispatched': return { bg: 'bg-gradient-to-br from-blue-100 via-sky-50 to-blue-50',        text: 'text-blue-950',   sub: 'text-blue-700/60'  }
    case 'delivered':  return { bg: 'bg-gradient-to-br from-emerald-100 via-green-50 to-emerald-50',text: 'text-emerald-950',sub: 'text-emerald-700/60'}
    case 'cancelled':  return { bg: 'bg-gradient-to-br from-red-100 via-rose-50 to-red-50',         text: 'text-red-950',    sub: 'text-red-700/60'   }
    case 'returned':   return { bg: 'bg-gradient-to-br from-purple-100 via-violet-50 to-purple-50', text: 'text-purple-950', sub: 'text-purple-700/60' }
    default:           return { bg: 'bg-gradient-to-br from-zinc-100 to-zinc-50',                   text: 'text-zinc-900',   sub: 'text-zinc-500'     }
  }
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!(await isAdminAuthenticated())) redirect('/admin/login')

  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } })
  if (!order) notFound()

  const orderNum  = displayRef(order.paystackRef, order.id)
  const subtotal  = order.items.reduce((s, i) => s + i.priceNgn * i.quantity, 0)
  const discount  = order.discountAmount ?? 0
  const delivery  = order.totalNgn - subtotal + discount
  const isGuest   = order.userId === null
  const header    = headerStyle(order.status)

  return (
    <div className="min-h-screen bg-zinc-100">

      {/* Top bar */}
      <div className="bg-white border-b border-zinc-100 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tracking-[0.2em] text-black">TOMANNI</span>
          <span className="text-zinc-200">|</span>
          <span className="text-xs text-zinc-400">Admin</span>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button type="submit" className="text-xs text-zinc-400 hover:text-black transition-colors">Sign out</button>
        </form>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-black transition-colors mb-6">
          <ArrowLeft size={11} strokeWidth={2} />
          All Orders
        </Link>

        {/* Hero header card */}
        <div className={`${header.bg} rounded-2xl overflow-hidden mb-6 shadow-sm`}>
          <div className="px-6 sm:px-8 py-7 sm:py-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <p className={`text-[10px] uppercase tracking-widest mb-2 font-bold ${header.sub}`}>Order</p>
              <h1 className={`text-2xl sm:text-4xl font-mono font-black tracking-tight ${header.text}`}>{orderNum}</h1>
              <p className={`text-xs mt-3 ${header.sub}`}>Placed {formatDate(order.createdAt)}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs px-4 py-1.5 rounded-full font-bold ${
                order.paymentStatus === 'paid'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}>
                {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
              </span>
              <span className={`text-xs px-4 py-1.5 rounded-full font-bold bg-white/70 ${header.text}`}>
                {statusLabel(order.status)}
              </span>
            </div>
          </div>
        </div>

        {/* Main two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

          {/* ─── LEFT: Customer + Items ─── */}
          <div className="flex flex-col gap-5">

            {/* Customer card */}
            <div className={`bg-white rounded-2xl shadow-sm overflow-hidden border-l-[3px] ${
              isGuest ? 'border-l-blue-400' : 'border-l-amber-400'
            }`}>
              <div className="px-6 py-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Customer</h2>
                  {isGuest
                    ? <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-bold">Guest</span>
                    : <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 font-bold">👑 Member</span>
                  }
                </div>
                <p className="text-lg font-bold text-zinc-900">{order.customerName ?? '—'}</p>
                <div className="mt-1 space-y-0.5">
                  {order.customerEmail && <p className="text-sm text-zinc-500">{order.customerEmail}</p>}
                  {order.customerPhone && <p className="text-sm text-zinc-500">{order.customerPhone}</p>}
                </div>
                {order.address && (
                  <div className="mt-4 pt-4 border-t border-zinc-100 text-sm text-zinc-500 space-y-0.5">
                    <p>{order.address}</p>
                    {order.city && <p>{order.city}{order.state ? `, ${order.state}` : ''}</p>}
                    {order.country && <p className="font-medium text-zinc-700">{order.country}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Items card */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 pt-5 pb-2">
                <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Items ordered</h2>
              </div>

              <ul className="divide-y divide-zinc-50">
                {order.items.map(item => (
                  <li key={item.id} className="flex items-center gap-4 px-6 py-4">
                    <div className="relative w-16 h-16 shrink-0 bg-zinc-50 rounded-xl overflow-hidden">
                      {item.imageUrl
                        ? <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="64px" />
                        : <div className="w-full h-full bg-zinc-100" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 truncate">{item.name}</p>
                      {item.size && (
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 font-medium">
                          Size {item.size}
                        </span>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] text-zinc-400 mb-0.5">×{item.quantity}</p>
                      <p className="text-sm font-black text-zinc-900">₦{(item.priceNgn * item.quantity).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Price breakdown */}
              <div className="mx-4 mb-4 mt-2 border-t border-zinc-100 pt-3 space-y-1 text-sm">
                {discount > 0 && (
                  <>
                    <div className="flex justify-between px-2 py-1.5 text-zinc-500">
                      <span>Subtotal</span>
                      <span>₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between px-2 py-1.5 text-emerald-600">
                      <span>Discount</span>
                      <span>−₦{discount.toLocaleString()}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between px-2 py-1.5 text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    Delivery
                    {isGuest
                      ? <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-500 font-bold">Guest</span>
                      : <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold">Free</span>
                    }
                  </span>
                  <span>{isGuest ? `₦${delivery.toLocaleString()}` : 'Free'}</span>
                </div>
                <div className="flex justify-between items-center bg-zinc-900 rounded-xl px-4 py-3.5 mt-2">
                  <span className="text-sm font-bold text-white">Total</span>
                  <span className="text-base font-black text-white">₦{order.totalNgn.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: References + Comms + Actions ─── */}
          <div className="flex flex-col gap-5">

            {/* References */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 pt-5 pb-2">
                <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">References</h2>
              </div>
              <div className="divide-y divide-zinc-50 pb-3">
                {order.paystackRef && (
                  <div className="px-5 py-3">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Paystack ref</p>
                    <p className="text-xs font-mono font-bold text-zinc-800">{order.paystackRef}</p>
                  </div>
                )}
                <div className="px-5 py-3">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">Internal ID</p>
                  <p className="text-[10px] font-mono text-zinc-400 break-all leading-relaxed">{order.id}</p>
                </div>
              </div>
            </div>

            {/* Communication */}
            {order.customerEmail && (
              <div className="bg-white rounded-2xl shadow-sm px-5 py-5">
                <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Communication</h2>
                <AcknowledgeButton orderId={order.id} variant="full" />
              </div>
            )}

            {/* Update order */}
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

        </div>
      </div>
    </div>
  )
}
