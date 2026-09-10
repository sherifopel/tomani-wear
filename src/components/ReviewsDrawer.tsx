'use client'

import { useState, useEffect, useCallback } from 'react'
import ReviewForm from '@/components/ReviewForm'

// ── Types ─────────────────────────────────────────────────────────────────────

type Review = {
  id:        string
  name:      string
  rating:    number
  comment:   string | null
  createdAt: string
}

type DrawerData = {
  reviews: Review[]
  average: number
  total:   number
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'text-2xl' : 'text-sm'
  return (
    <span className={`${cls} leading-none`} aria-hidden>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= rating ? 'var(--brand-yellow)' : '#D1D5DB' }}>★</span>
      ))}
    </span>
  )
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// ── ReviewsDrawer ─────────────────────────────────────────────────────────────

export default function ReviewsDrawer({
  open,
  onClose,
  slug,
}: {
  open:    boolean
  onClose: () => void
  slug:    string
}) {
  const [data,    setData]    = useState<DrawerData | null>(null)
  const [loading, setLoading] = useState(false)
  const [view,    setView]    = useState<'reviews' | 'write'>('reviews')

  const fetchReviews = useCallback(() => {
    setLoading(true)
    fetch(`/api/reviews?slug=${slug}`)
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!open) return
    setView('reviews')
    fetchReviews()
  }, [open, fetchReviews])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[300] bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — bottom-sheet on mobile, right-side panel on desktop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Reviews"
        className="
          fixed bottom-0 left-0 right-0 z-[301]
          bg-white rounded-t-2xl max-h-[88vh] flex flex-col
          animate-[slide-up_280ms_cubic-bezier(0.32,0.72,0,1)]
          md:top-0 md:right-0 md:left-auto md:bottom-0
          md:w-[460px] md:max-h-none md:rounded-none
          md:animate-[slide-in-right_280ms_cubic-bezier(0.32,0.72,0,1)]
        "
      >
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex gap-5">
            <button
              onClick={() => setView('reviews')}
              className={`text-sm pb-1 border-b-2 transition-colors ${
                view === 'reviews'
                  ? 'border-black font-medium'
                  : 'border-transparent text-gray-400 hover:text-black'
              }`}
            >
              Reviews{data ? ` (${data.total})` : ''}
            </button>
            <button
              onClick={() => setView('write')}
              className={`text-sm pb-1 border-b-2 transition-colors ${
                view === 'write'
                  ? 'border-black font-medium'
                  : 'border-transparent text-gray-400 hover:text-black'
              }`}
            >
              Write a review
            </button>
          </div>
          <button
            onClick={onClose}
            aria-label="Close reviews"
            className="p-1 text-gray-500 hover:text-black transition-colors"
          >
            <IconClose />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">

          {loading ? (
            <div className="py-16 text-center text-sm text-gray-400">Loading…</div>
          ) : view === 'write' ? (
            <ReviewForm slug={slug} />
          ) : (
            <>
              {/* Average summary */}
              {data && data.total > 0 && (
                <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-100">
                  <div className="text-center shrink-0">
                    <p className="text-5xl font-light leading-none mb-1">
                      {data.average.toFixed(1)}
                    </p>
                    <Stars rating={Math.round(data.average)} size="lg" />
                    <p className="text-xs text-gray-400 mt-1.5">
                      {data.total} review{data.total !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => setView('write')}
                    className="text-xs font-medium border border-black px-5 py-2.5 hover:bg-black hover:text-white transition-colors duration-200"
                  >
                    Write a review
                  </button>
                </div>
              )}

              {/* Review list */}
              {!data || data.reviews.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-gray-500 mb-5">No reviews yet — be the first.</p>
                  <button
                    onClick={() => setView('write')}
                    className="text-xs font-medium border border-black px-6 py-2.5 hover:bg-black hover:text-white transition-colors duration-200"
                  >
                    Write a review
                  </button>
                </div>
              ) : (
                data.reviews.map(r => (
                  <div key={r.id} className="py-5 border-b border-gray-100 last:border-none">
                    <div className="flex items-start justify-between gap-4 mb-1.5">
                      <div>
                        <p className="text-sm font-medium">{r.name}</p>
                        <Stars rating={r.rating} />
                      </div>
                      <p className="text-xs text-gray-400 shrink-0">{formatDate(r.createdAt)}</p>
                    </div>
                    {r.comment && (
                      <p className="text-sm text-gray-600 leading-relaxed mt-2">{r.comment}</p>
                    )}
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
