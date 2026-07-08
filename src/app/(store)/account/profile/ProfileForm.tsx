'use client'

import { useState } from 'react'

type Props = { user: { name: string; email: string; phone: string } }

export default function ProfileForm({ user }: Props) {
  const [name,    setName]    = useState(user.name)
  const [phone,   setPhone]   = useState(user.phone)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    const res = await fetch('/api/user/profile', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, phone }),
    })

    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-5">

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] text-black">Full Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
        />
      </div>

      {/* Email — read only */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] text-black">Email</label>
        <input
          type="email"
          value={user.email}
          readOnly
          className="border border-gray-100 px-4 py-3 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
        />
        <p className="text-[11px] text-gray-400">Email is linked to your login and cannot be changed here.</p>
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] text-black">Phone Number</label>
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder=""
          className="border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors"
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-2 px-8 py-3 bg-black text-white text-xs uppercase tracking-widest border border-black btn-wipe disabled:opacity-50"
      >
        {saving ? 'Saving…' : saved ? 'Saved' : 'Save Changes'}
      </button>

    </form>
  )
}
