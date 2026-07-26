'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { statusLabel } from '@/lib/orderStatus'

const STATUSES = ['processing', 'dispatched', 'delivered', 'cancelled', 'returned'] as const

export default function AdminOrderActions({
  orderId,
  currentStatus,
  currentTracking,
}: {
  orderId:         string
  currentStatus:   string
  currentTracking: string
}) {
  const router = useRouter()
  const [status,   setStatus]   = useState(currentStatus)
  const [tracking, setTracking] = useState(currentTracking)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  async function save() {
    setSaving(true)
    setSaved(false)
    await fetch(`/api/orders/${orderId}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status, trackingNumber: tracking }),
    })
    setSaving(false)
    setSaved(true)
    router.refresh()
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <section className="border border-gray-100 rounded-md px-5 py-4">
      <h2 className="text-xs text-gray-500 mb-4">Update Order</h2>

      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1.5">Order Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-black transition-colors"
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{statusLabel(s)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1.5">Tracking Number <span className="text-gray-300">(optional)</span></label>
          <input
            type="text"
            value={tracking}
            onChange={e => setTracking(e.target.value)}
            placeholder="e.g. GIG-123456789"
            className="w-full px-3 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="w-full py-3 bg-black text-white text-xs rounded border border-black btn-wipe disabled:opacity-50"
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>
    </section>
  )
}
