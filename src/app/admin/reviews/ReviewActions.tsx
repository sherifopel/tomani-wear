'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ApproveButton({ reviewId }: { reviewId: string }) {
  const router = useRouter()
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function approve() {
    setState('loading')
    const res = await fetch(`/api/admin/reviews/${reviewId}`, { method: 'PATCH' })
    if (res.ok) {
      setState('done')
      router.refresh()
    } else {
      setState('error')
      setTimeout(() => setState('idle'), 2000)
    }
  }

  const base = 'text-[11px] px-2.5 py-1 rounded-full border font-medium transition-colors'
  if (state === 'done')    return <span className={`${base} border-emerald-200 text-emerald-600 bg-emerald-50`}>Approved ✓</span>
  if (state === 'error')   return <span className={`${base} border-red-200 text-red-500`}>Failed</span>
  if (state === 'loading') return <span className={`${base} border-zinc-200 text-zinc-400`}>Approving…</span>

  return (
    <button onClick={approve} className={`${base} border-emerald-300 text-emerald-700 hover:bg-emerald-50`}>
      Approve
    </button>
  )
}

export function DeleteButton({ reviewId }: { reviewId: string }) {
  const router = useRouter()
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')

  async function remove() {
    if (!confirm('Delete this review permanently?')) return
    setState('loading')
    const res = await fetch(`/api/admin/reviews/${reviewId}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    } else {
      setState('error')
      setTimeout(() => setState('idle'), 2000)
    }
  }

  const base = 'text-[11px] px-2.5 py-1 rounded-full border font-medium transition-colors'
  if (state === 'error')   return <span className={`${base} border-red-200 text-red-500`}>Failed</span>
  if (state === 'loading') return <span className={`${base} border-zinc-200 text-zinc-400`}>Deleting…</span>

  return (
    <button onClick={remove} className={`${base} border-red-200 text-red-500 hover:bg-red-50`}>
      Delete
    </button>
  )
}
