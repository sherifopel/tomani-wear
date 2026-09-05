'use client'
import React, { useEffect, useState, useCallback } from 'react'

// When embedded in the Next.js app (/studio), the API is same-origin.
// When running at tomanni-wear.sanity.studio, we need the full URL.
const API_BASE =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://tomani-wear.vercel.app'

const SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET ?? ''

const AUTH = { Authorization: `Bearer ${SECRET}`, 'Content-Type': 'application/json' }

// ─── Types ───────────────────────────────────────────────────────────────────

type DiscountCode = {
  id: string
  code: string
  type: string
  discount: number
  maxUses: number
  usedCount: number
  active: boolean
  createdAt: string
  expiresAt: string | null
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const wrap: React.CSSProperties = {
  padding: '32px 40px',
  fontFamily: 'system-ui, sans-serif',
  maxWidth: 900,
}

const pageHeading: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: '#1a1a1a',
  margin: '0 0 4px 0',
}

const subText: React.CSSProperties = {
  fontSize: 13,
  color: '#888',
  margin: '0 0 32px 0',
}

const card: React.CSSProperties = {
  background: '#f9f9f9',
  border: '1px solid #e5e5e5',
  borderRadius: 8,
  padding: '20px 24px',
  marginBottom: 24,
}

const sectionHeading: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#555',
  margin: '0 0 16px 0',
}

const row: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  alignItems: 'flex-end',
  flexWrap: 'wrap',
}

const fieldWrap: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 }

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: '#555',
}

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #ccc',
  borderRadius: 6,
  fontSize: 14,
  color: '#1a1a1a',
  background: '#fff',
  outline: 'none',
}

const btnPrimary: React.CSSProperties = {
  padding: '9px 20px',
  background: '#c9a227',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  letterSpacing: '0.04em',
}

const table: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
}

const th: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px 12px',
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#888',
  borderBottom: '2px solid #e5e5e5',
}

const td: React.CSSProperties = {
  padding: '12px 12px',
  borderBottom: '1px solid #f0f0f0',
  color: '#1a1a1a',
  verticalAlign: 'middle',
}

const codePill: React.CSSProperties = {
  fontFamily: 'monospace',
  fontWeight: 700,
  fontSize: 13,
  letterSpacing: '0.06em',
  background: '#f0ebe0',
  color: '#7a6010',
  padding: '2px 8px',
  borderRadius: 4,
}

const toggleOn: React.CSSProperties = {
  padding: '4px 12px',
  background: '#d4edda',
  color: '#1a5c30',
  border: '1px solid #a8d8b0',
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
}

const toggleOff: React.CSSProperties = {
  ...toggleOn,
  background: '#f8d7da',
  color: '#721c24',
  border: '1px solid #f5c6cb',
}

const delBtn: React.CSSProperties = {
  padding: '4px 10px',
  background: 'transparent',
  color: '#c0392b',
  border: '1px solid #e0b0ae',
  borderRadius: 6,
  fontSize: 12,
  cursor: 'pointer',
  marginLeft: 6,
}

const errorBox: React.CSSProperties = {
  background: '#fff3f3',
  border: '1px solid #f5c6cb',
  borderRadius: 6,
  padding: '10px 14px',
  color: '#721c24',
  fontSize: 13,
  marginBottom: 16,
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DiscountCodesTool() {
  const [codes, setCodes]       = useState<DiscountCode[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving]     = useState(false)

  // New code form state
  const [newCode, setNewCode]         = useState('')
  const [newType, setNewType]         = useState<'percentage' | 'free_delivery'>('percentage')
  const [newDiscount, setNewDiscount] = useState('30')
  const [newMaxUses, setNewMaxUses]   = useState('5')
  const [newExpiry, setNewExpiry]     = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/admin/discount`, { headers: AUTH })
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      setCodes(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load codes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function createCode(e: React.FormEvent) {
    e.preventDefault()
    if (!newCode.trim()) { setFormError('Code name is required'); return }
    if (newType === 'percentage' && (!newDiscount || Number(newDiscount) < 1 || Number(newDiscount) > 100)) {
      setFormError('Discount must be between 1 and 100')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      const res = await fetch(`${API_BASE}/api/admin/discount`, {
        method: 'POST',
        headers: AUTH,
        body: JSON.stringify({
          code:      newCode,
          type:      newType,
          discount:  newType === 'free_delivery' ? 0 : Number(newDiscount),
          maxUses:   Number(newMaxUses),
          expiresAt: newExpiry || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create')
      setNewCode('')
      setNewType('percentage')
      setNewDiscount('30')
      setNewMaxUses('5')
      setNewExpiry('')
      setCodes(prev => [data, ...prev])
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Failed to create code')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(code: DiscountCode) {
    const optimistic = codes.map(c => c.id === code.id ? { ...c, active: !c.active } : c)
    setCodes(optimistic)
    try {
      const res = await fetch(`${API_BASE}/api/admin/discount/${code.id}`, {
        method: 'PATCH',
        headers: AUTH,
        body: JSON.stringify({ active: !code.active }),
      })
      if (!res.ok) throw new Error('Toggle failed')
    } catch {
      setCodes(codes) // revert on error
    }
  }

  async function deleteCode(id: string) {
    if (!confirm('Delete this discount code? This cannot be undone.')) return
    setCodes(prev => prev.filter(c => c.id !== id))
    try {
      await fetch(`${API_BASE}/api/admin/discount/${id}`, { method: 'DELETE', headers: AUTH })
    } catch {
      load() // reload on error
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div style={wrap}>
      <h1 style={pageHeading}>Discount Codes</h1>
      <p style={subText}>Create and manage promotional codes. Customers enter these at checkout.</p>

      {/* ── Create new code ─────────────────────────────────────────────── */}
      <div style={card}>
        <p style={sectionHeading}>Create New Code</p>
        {formError && <div style={errorBox}>{formError}</div>}
        <form onSubmit={createCode}>
          <div style={row}>
            <div style={fieldWrap}>
              <label style={labelStyle}>Code</label>
              <input
                style={{ ...inputStyle, width: 160, textTransform: 'uppercase' }}
                placeholder="e.g. SUMMER20"
                value={newCode}
                onChange={e => setNewCode(e.target.value.toUpperCase())}
              />
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Type</label>
              <select
                style={{ ...inputStyle, width: 160 }}
                value={newType}
                onChange={e => setNewType(e.target.value as 'percentage' | 'free_delivery')}
              >
                <option value="percentage">Percentage off</option>
                <option value="free_delivery">Free delivery</option>
              </select>
            </div>
            {newType === 'percentage' && (
            <div style={fieldWrap}>
              <label style={labelStyle}>Discount %</label>
              <input
                style={{ ...inputStyle, width: 80 }}
                type="number"
                min="1"
                max="100"
                value={newDiscount}
                onChange={e => setNewDiscount(e.target.value)}
              />
            </div>
            )}
            <div style={fieldWrap}>
              <label style={labelStyle}>Max Uses</label>
              <input
                style={{ ...inputStyle, width: 80 }}
                type="number"
                min="1"
                value={newMaxUses}
                onChange={e => setNewMaxUses(e.target.value)}
              />
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Expires (optional)</label>
              <input
                style={{ ...inputStyle, width: 160 }}
                type="date"
                value={newExpiry}
                onChange={e => setNewExpiry(e.target.value)}
              />
            </div>
            <button type="submit" style={btnPrimary} disabled={saving}>
              {saving ? 'Creating…' : 'Create Code'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Codes table ─────────────────────────────────────────────────── */}
      <div style={card}>
        <p style={sectionHeading}>
          All Codes
          <span style={{ fontWeight: 400, color: '#aaa', marginLeft: 8 }}>({codes.length})</span>
        </p>

        {error && <div style={errorBox}>{error} — <button onClick={load} style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#721c24', textDecoration: 'underline' }}>Retry</button></div>}

        {loading ? (
          <p style={{ color: '#888', fontSize: 13 }}>Loading…</p>
        ) : codes.length === 0 ? (
          <p style={{ color: '#888', fontSize: 13 }}>No discount codes yet. Create one above.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Code</th>
                  <th style={th}>Discount</th>
                  <th style={th}>Uses</th>
                  <th style={th}>Expires</th>
                  <th style={th}>Created</th>
                  <th style={th}>Status</th>
                  <th style={th}></th>
                </tr>
              </thead>
              <tbody>
                {codes.map(c => (
                  <tr key={c.id}>
                    <td style={td}><span style={codePill}>{c.code}</span></td>
                    <td style={td}>
                      {c.type === 'free_delivery'
                        ? <span style={{ color: '#1a5c30', fontWeight: 600 }}>Free delivery</span>
                        : <><strong>{c.discount}%</strong> off</>}
                    </td>
                    <td style={{ ...td, fontVariantNumeric: 'tabular-nums' }}>
                      {c.usedCount} / {c.maxUses}
                      <span style={{ color: '#bbb', marginLeft: 4, fontSize: 11 }}>
                        ({c.maxUses - c.usedCount} left)
                      </span>
                    </td>
                    <td style={{ ...td, color: c.expiresAt ? '#555' : '#bbb' }}>
                      {c.expiresAt ? formatDate(c.expiresAt) : '—'}
                    </td>
                    <td style={{ ...td, color: '#888' }}>{formatDate(c.createdAt)}</td>
                    <td style={td}>
                      <button
                        onClick={() => toggleActive(c)}
                        style={c.active ? toggleOn : toggleOff}
                      >
                        {c.active ? '✓ Active' : '✗ Paused'}
                      </button>
                    </td>
                    <td style={td}>
                      <button onClick={() => deleteCode(c.id)} style={delBtn}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
