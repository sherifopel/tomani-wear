import { prisma }    from '@/lib/prisma'
import ReviewForm    from '@/components/ReviewForm'

// ── Types ─────────────────────────────────────────────────────────────────────

type Review = {
  id:        string
  name:      string
  rating:    number
  comment:   string | null
  createdAt: Date
}

// ── Star display (read-only) ──────────────────────────────────────────────────

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const px = size === 'lg' ? 'text-2xl' : 'text-base'
  return (
    <span aria-label={`${rating} out of 5 stars`} className={`${px} leading-none`}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= rating ? 'var(--brand-yellow)' : '#D1D5DB' }}>★</span>
      ))}
    </span>
  )
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Average summary ───────────────────────────────────────────────────────────

function ReviewSummary({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return null

  const avg     = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  const rounded = Math.round(avg * 10) / 10

  const dist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }))

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 mb-10">
      {/* Big number */}
      <div className="flex flex-col items-center justify-center shrink-0">
        <p className="text-5xl font-light">{rounded.toFixed(1)}</p>
        <Stars rating={Math.round(avg)} size="lg" />
        <p className="text-xs text-gray-400 mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Bar breakdown */}
      <div className="flex-1 space-y-1.5 justify-center flex flex-col">
        {dist.map(({ star, count }) => {
          const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0
          return (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-4 shrink-0">{star}</span>
              <span style={{ color: 'var(--brand-yellow)' }} className="text-sm leading-none shrink-0">★</span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: 'var(--brand-yellow)' }}
                />
              </div>
              <span className="text-xs text-gray-400 w-6 text-right shrink-0">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Individual review card ────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="py-6 border-b border-gray-100 last:border-none">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <p className="text-sm font-medium">{review.name}</p>
          <Stars rating={review.rating} />
        </div>
        <p className="text-xs text-gray-400 shrink-0">{formatDate(review.createdAt)}</p>
      </div>
      {review.comment && (
        <p className="text-sm text-gray-600 leading-relaxed mt-2">{review.comment}</p>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default async function ProductReviews({ slug }: { slug: string }) {
  const reviews = await prisma.review.findMany({
    where:   { productSlug: slug, status: 'approved' },
    orderBy: { createdAt: 'desc' },
    select:  { id: true, name: true, rating: true, comment: true, createdAt: true },
  })

  return (
    <section className="max-w-7xl mx-auto px-6 pb-20" data-testid="pdp-reviews">
      <div className="border-t border-gray-100 pt-12">

        <div className="max-w-2xl">
          <h2 className="text-xl font-light tracking-wide mb-8">Customer Reviews</h2>

          {/* Summary */}
          {reviews.length > 0 && <ReviewSummary reviews={reviews} />}

          {/* Review list */}
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-400 mb-10">No reviews yet — be the first.</p>
          ) : (
            <div className="mb-12">
              {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
            </div>
          )}

          {/* Write a review */}
          <div>
            <h3 className="text-sm font-medium  tracking-wide mb-6">Write a Review</h3>
            <ReviewForm slug={slug} />
          </div>
        </div>
      </div>
    </section>
  )
}
