'use client'

import { useState } from 'react'

export default function AcknowledgeButton({ orderId }: { orderId: string }) {
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

  if (state === 'sent')    return <span className="text-xs text-green-600">Sent ✓</span>
  if (state === 'error')   return <span className="text-xs text-red-500">Failed</span>
  if (state === 'sending') return <span className="text-xs text-gray-400">Sending…</span>

  return (
    <button
      onClick={send}
      className="text-xs text-gray-400 hover:text-black transition-colors"
      title="Send order acknowledgement email to customer"
    >
      Acknowledge
    </button>
  )
}
