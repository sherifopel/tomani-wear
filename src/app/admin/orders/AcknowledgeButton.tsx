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

  if (state === 'sent')    return <span className="text-[11px] px-2.5 py-1 rounded border border-green-200 text-green-600 font-medium">Sent ✓</span>
  if (state === 'error')   return <span className="text-[11px] px-2.5 py-1 rounded border border-red-200 text-red-500 font-medium">Failed</span>
  if (state === 'sending') return <span className="text-[11px] px-2.5 py-1 rounded border border-gray-200 text-gray-400">Sending…</span>

  return (
    <button
      onClick={send}
      title="Send order acknowledgement email to customer"
      className="text-[11px] px-2.5 py-1 rounded border border-gray-200 text-gray-600 hover:border-black hover:text-black transition-colors font-medium"
    >
      Acknowledge
    </button>
  )
}
