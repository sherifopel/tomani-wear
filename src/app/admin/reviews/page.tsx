import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { ApproveButton, DeleteButton } from './ReviewActions'

function Stars({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} stars`}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= rating ? '#FFD700' : '#D1D5DB' }}>★</span>
      ))}
    </span>
  )
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminReviewsPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login')

  const [pending, approved] = await Promise.all([
    prisma.review.findMany({ where: { status: 'pending'  }, orderBy: { createdAt: 'desc' } }),
    prisma.review.findMany({ where: { status: 'approved' }, orderBy: { createdAt: 'desc' }, take: 20 }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold tracking-[0.2em] text-black">TOMANNI</span>
          <span className="text-gray-200">|</span>
          <Link href="/admin/orders" className="text-xs text-gray-500 hover:text-black transition-colors">Orders</Link>
          <span className="text-xs text-black font-medium">Reviews</span>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button type="submit" className="text-xs text-gray-400 hover:text-black transition-colors">Sign out</button>
        </form>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Reviews</h1>
          <p className="text-xs text-gray-500 mt-1">
            {pending.length} pending · {approved.length} approved (showing last 20)
          </p>
        </div>

        {/* Pending */}
        <section className="mb-10">
          <h2 className="text-xs font-semibold tracking-[0.15em] text-gray-400 mb-4">PENDING APPROVAL</h2>

          {pending.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-lg px-6 py-8 text-center">
              <p className="text-sm text-gray-400">No reviews waiting for approval.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map(r => (
                <div key={r.id} className="bg-white border border-gray-100 rounded-lg px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-medium">{r.name}</span>
                        <Stars rating={r.rating} />
                        <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">
                        <span className="text-gray-400">Product:</span>{' '}
                        <Link href={`/products/${r.productSlug}`} target="_blank" className="underline hover:text-black">
                          {r.productSlug}
                        </Link>
                      </p>
                      {r.comment && (
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{r.comment}</p>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <ApproveButton reviewId={r.id} />
                      <DeleteButton  reviewId={r.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Approved (recent) */}
        <section>
          <h2 className="text-xs font-semibold tracking-[0.15em] text-gray-400 mb-4">LIVE REVIEWS</h2>

          {approved.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-lg px-6 py-8 text-center">
              <p className="text-sm text-gray-400">No approved reviews yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {approved.map(r => (
                <div key={r.id} className="bg-white border border-gray-100 rounded-lg px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-medium">{r.name}</span>
                        <Stars rating={r.rating} />
                        <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">
                        <Link href={`/products/${r.productSlug}`} target="_blank" className="underline hover:text-black">
                          {r.productSlug}
                        </Link>
                      </p>
                      {r.comment && (
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{r.comment}</p>
                      )}
                    </div>
                    <DeleteButton reviewId={r.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
