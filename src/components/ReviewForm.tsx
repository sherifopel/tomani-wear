'use client'

import { useState } from 'react'

// ── Star rating input ─────────────────────────────────────────────────────────

function StarInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex gap-1" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="text-2xl leading-none transition-transform duration-100 hover:scale-110 focus:outline-none"
          style={{ color: star <= (hover || value) ? 'var(--brand-yellow)' : '#D1D5DB' }}
        >
          ★
        </button>
      ))}
    </div>
  )
}

// ── Review form ───────────────────────────────────────────────────────────────

export default function ReviewForm({ slug }: { slug: string }) {
  const [rating,  setRating]  = useState(0)
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [done,    setDone]    = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (rating === 0) { setError('Please select a star rating.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ slug, name, email, rating, comment }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return }
      setDone(true)
    } catch {
      setError('Network error — please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="border border-gray-100 rounded-lg p-6 text-center">
        <p className="text-2xl mb-2">🙏</p>
        <p className="font-medium text-sm mb-1">Thank you for your review!</p>
        <p className="text-xs text-gray-500">
          Your review is pending approval and will appear once it&apos;s been checked.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star rating */}
      <div>
        <p className="text-xs  font-medium mb-2">Your rating <span className="text-red-400">*</span></p>
        <StarInput value={rating} onChange={setRating} />
      </div>

      {/* Name + email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs  text-gray-500 block mb-1" htmlFor="review-name">Name <span className="text-red-400">*</span></label>
          <input
            id="review-name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>
        <div>
          <label className="text-xs  text-gray-500 block mb-1" htmlFor="review-email">Email <span className="text-red-400">*</span></label>
          <input
            id="review-email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Not shown publicly"
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="text-xs  text-gray-500 block mb-1" htmlFor="review-comment">Review <span className="text-gray-400 font-normal">(optional)</span></label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Tell others what you think about this product..."
          rows={4}
          maxLength={1000}
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-black transition-colors resize-none"
        />
        {comment.length > 800 && (
          <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/1000</p>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="border border-black text-black px-8 py-2.5 text-xs  font-medium hover:bg-black hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  )
}
