'use client'

import { useState } from 'react'

export default function AcknowledgeButton({ orderId, variant = 'compact', acknowledged = false }: {
  orderId:      string
  variant?:     'compact' | 'full'
  acknowledged?: boolean
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>(acknowledged ? 'sent' : 'idle')

  async function send() {
    if (state === 'sent') return
    setState('sending')
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/acknowledge`, { method: 'POST' })
      if (res.ok) {
        setState('sent')
        // 'sent' is permanent — no reset timer
      } else {
        const data = await res.json().catch(() => ({}))
        if (data.alreadySent) {
          setState('sent') // treat as success — it was already sent
        } else {
          setState('error')
          setTimeout(() => setState('idle'), 3000)
        }
      }
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  if (variant === 'full') {
    if (state === 'sent') {
      return (
        <div className="w-full py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold text-center">
          Acknowledgement sent ✓
        </div>
      )
    }
    if (state === 'error') {
      return (
        <div className="w-full py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold text-center">
          Failed — try again
        </div>
      )
    }
    if (state === 'sending') {
      return (
        <div className="w-full py-3 rounded-xl bg-zinc-100 text-zinc-400 text-xs font-bold text-center">
          Sending…
        </div>
      )
    }
    return (
      <button
        onClick={send}
        className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-700 text-white text-xs font-bold tracking-wide transition-colors"
      >
        Send Acknowledgement Email
      </button>
    )
  }

  // compact variant (table / mobile card)
  const base = 'text-[11px] px-2.5 py-1 rounded-full border font-medium transition-colors'
  if (state === 'sent')    return <span className={`${base} border-emerald-200 text-emerald-600 bg-emerald-50`}>Sent ✓</span>
  if (state === 'error')   return <span className={`${base} border-red-200 text-red-500`}>Failed</span>
  if (state === 'sending') return <span className={`${base} border-zinc-200 text-zinc-400`}>Sending…</span>

  return (
    <button
      onClick={send}
      title="Send order acknowledgement email to customer"
      className={`${base} border-zinc-300 text-zinc-700 hover:border-black hover:text-black`}
    >
      Acknowledge
    </button>
  )
}
