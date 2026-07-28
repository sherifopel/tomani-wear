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

  const base = variant === 'full'
    ? 'text-xs px-4 py-2 rounded-full border font-medium transition-colors'
    : 'text-[11px] px-2.5 py-1 rounded-full border font-medium transition-colors'

  if (state === 'sent')    return <span className={`${base} border-green-200 text-green-600`}>Sent ✓</span>
  if (state === 'error')   return <span className={`${base} border-red-200 text-red-500`}>Failed</span>
  if (state === 'sending') return <span className={`${base} border-gray-200 text-gray-400`}>Sending…</span>

  return (
    <button
      onClick={send}
      title="Send order acknowledgement email to customer"
      className={`${base} border-gray-300 text-gray-700 hover:border-black hover:text-black`}
    >
      {variant === 'full' ? 'Send Acknowledgement Email' : 'Acknowledge'}
    </button>
  )
}
