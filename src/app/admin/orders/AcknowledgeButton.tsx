'use client'

import { useState } from 'react'

export default function AcknowledgeButton({ orderId, variant = 'compact' }: {
  orderId: string
  variant?: 'compact' | 'full'
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function send() {
    setState('sending')
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/acknowledge`, { method: 'POST' })
      setState(res.ok ? 'sent' : 'error')
    } catch {
      setState('error')
    }
    setTimeout(() => setState('idle'), 3000)
  }

  if (variant === 'full') {
    if (state === 'sent')    return <div className="w-full py-3 rounded-xl bg-emerald-500 text-white text-xs font-bold text-center">Email sent ✓</div>
    if (state === 'error')   return <div className="w-full py-3 rounded-xl bg-red-500 text-white text-xs font-bold text-center">Failed — try again</div>
    if (state === 'sending') return <div className="w-full py-3 rounded-xl bg-zinc-300 text-zinc-500 text-xs font-bold text-center">Sending…</div>
    return (
      <button
        onClick={send}
        className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-700 text-white text-xs font-bold tracking-wide transition-colors"
      >
        Send Acknowledgement Email
      </button>
    )
  }

  // compact variant (used in table / mobile card)
  const base = 'text-[11px] px-2.5 py-1 rounded-full border font-medium transition-colors'
  if (state === 'sent')    return <span className={`${base} border-emerald-200 text-emerald-600`}>Sent ✓</span>
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
