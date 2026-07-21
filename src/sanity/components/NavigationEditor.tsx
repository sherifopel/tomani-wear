'use client'
import React, { useEffect } from 'react'
import { ObjectInputProps, set } from 'sanity'

// ─── Types ───────────────────────────────────────────────────────────────────

type Child = {
  _key: string
  label: string
  href: string
  enabled?: boolean
}

type Link = {
  _key: string
  label: string
  href: string
  enabled?: boolean
  accent?: boolean
  underlineColor?: string
  children?: Child[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const rk = () => Math.random().toString(36).slice(2, 10)

type DefaultLink = Omit<Link, '_key' | 'children'> & { children?: Omit<Child, '_key'>[] }

// The exact same links as src/lib/nav-links.ts — Tomiwa can start from these
const DEFAULT_LINKS: DefaultLink[] = [
  {
    label: 'New In',
    href: '/products?category=new',
    underlineColor: 'var(--brand-black)',
    enabled: true,
  },
  {
    label: 'Men',
    href: '/products?category=men',
    underlineColor: 'var(--brand-yellow)',
    enabled: true,
    children: [
      { label: 'Hoodies', href: '/products?category=men&type=hoodies', enabled: true },
      { label: 'Jackets', href: '/products?category=men&type=jackets', enabled: true },
      { label: 'Joggers', href: '/products?category=men&type=joggers', enabled: true },
      { label: 'Shirts',  href: '/products?category=men&type=shirts',  enabled: true },
      { label: 'Shorts',  href: '/products?category=men&type=shorts',  enabled: true },
      { label: 'Pants',   href: '/products?category=men&type=trousers', enabled: true },
    ],
  },
  {
    label: 'Women',
    href: '/products?category=women',
    underlineColor: 'var(--brand-red)',
    enabled: true,
    children: [
      { label: 'Dresses', href: '/products?category=women&type=dresses',  enabled: true },
      { label: 'Jackets', href: '/products?category=women&type=jackets',  enabled: true },
      { label: 'Joggers', href: '/products?category=women&type=joggers',  enabled: true },
      { label: 'Shorts',  href: '/products?category=women&type=shorts',   enabled: true },
      { label: 'Tops',    href: '/products?category=women&type=tops',     enabled: true },
      { label: 'Pants',   href: '/products?category=women&type=trousers', enabled: true },
    ],
  },
  {
    label: 'Accessories',
    href: '/products?category=accessories',
    underlineColor: 'var(--brand-black)',
    enabled: true,
    children: [
      { label: 'Bags',  href: '/products?category=accessories&type=bags',  enabled: true },
      { label: 'Belts', href: '/products?category=accessories&type=belts', enabled: true },
      { label: 'Boots', href: '/products?category=accessories&type=boots', enabled: true },
      { label: 'Hats',  href: '/products?category=accessories&type=hats',  enabled: true },
      { label: 'Shoes', href: '/products?category=accessories&type=shoes', enabled: true },
    ],
  },
  {
    label: 'Collections',
    href: '/products?category=collections',
    underlineColor: 'var(--brand-yellow)',
    enabled: true,
    children: [
      { label: 'Archives', href: '/products?category=archives', enabled: true },
    ],
  },
  {
    label: 'Sale',
    href: '/products?category=sale',
    underlineColor: 'var(--brand-red)',
    enabled: true,
    accent: true,
  },
]

// Stamp _key onto every item when loading defaults
function withKeys(links: DefaultLink[]): Link[] {
  return links.map(l => ({
    ...l,
    _key: rk(),
    children: l.children?.map(c => ({ ...c, _key: rk() })),
  }))
}

// ─── Colour swatches ─────────────────────────────────────────────────────────

const COLOURS = [
  { value: 'var(--brand-black)',  hex: '#1a1a1a', name: 'Black'  },
  { value: 'var(--brand-yellow)', hex: '#c9a227', name: 'Yellow' },
  { value: 'var(--brand-red)',    hex: '#c0392b', name: 'Red'    },
]

// ─── Styles ──────────────────────────────────────────────────────────────────

const wrap: React.CSSProperties = { fontFamily: 'system-ui, sans-serif', padding: '4px 0' }

const topRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
}

const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#888',
}

const hint: React.CSSProperties = { fontSize: 12, color: '#aaa', marginTop: 2 }

const linkCard: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e5e5',
  borderRadius: 8,
  marginBottom: 8,
  overflow: 'hidden',
}

const linkRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 12px',
  flexWrap: 'wrap',
}

const inputBase: React.CSSProperties = {
  padding: '6px 10px',
  border: '1px solid #ddd',
  borderRadius: 6,
  fontSize: 13,
  color: '#1a1a1a',
  background: '#fafafa',
  outline: 'none',
}

const iconBtn: React.CSSProperties = {
  padding: '4px 8px',
  background: 'transparent',
  border: '1px solid #e0e0e0',
  borderRadius: 5,
  fontSize: 11,
  cursor: 'pointer',
  color: '#555',
  lineHeight: 1,
}

const delBtn: React.CSSProperties = {
  ...iconBtn,
  color: '#c0392b',
  borderColor: '#f5c6cb',
  marginLeft: 'auto',
}

const childrenWrap: React.CSSProperties = {
  borderTop: '1px dashed #ebebeb',
  padding: '8px 12px 4px 32px',
  background: '#fafafa',
}

const childRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '4px 0',
}

const addChildBtn: React.CSSProperties = {
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '6px 12px 6px 32px',
  background: 'transparent',
  border: 'none',
  borderTop: '1px dashed #ebebeb',
  fontSize: 12,
  color: '#888',
  cursor: 'pointer',
}

const btnPrimary: React.CSSProperties = {
  padding: '8px 16px',
  background: '#c9a227',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
  letterSpacing: '0.04em',
}

const btnSecondary: React.CSSProperties = {
  padding: '8px 14px',
  background: '#f5f5f5',
  color: '#555',
  border: '1px solid #e0e0e0',
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
}

const emptyBox: React.CSSProperties = {
  border: '2px dashed #e5e5e5',
  borderRadius: 8,
  padding: '32px 24px',
  textAlign: 'center',
  color: '#aaa',
  fontSize: 13,
  marginBottom: 12,
}

// ─── Component ───────────────────────────────────────────────────────────────

export function NavigationEditor({ value, onChange }: ObjectInputProps) {
  const raw = value as Record<string, unknown> | undefined
  const links: Link[] = (raw?.links as Link[]) ?? []

  // Fix the "Untitled" heading — set title once on first render if missing
  useEffect(() => {
    if (!raw?.title) {
      onChange(set('Navigation', ['title']))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Replace the entire links array
  const update = (newLinks: Link[]) => onChange(set(newLinks, ['links']))

  // ── Link operations ──────────────────────────────────────────────────────
  const setLabel = (i: number, v: string) =>
    update(links.map((l, idx) => idx === i ? { ...l, label: v } : l))

  const setHref = (i: number, v: string) =>
    update(links.map((l, idx) => idx === i ? { ...l, href: v } : l))

  const toggleEnabled = (i: number) =>
    update(links.map((l, idx) => idx === i ? { ...l, enabled: l.enabled === false } : l))

  const toggleAccent = (i: number) =>
    update(links.map((l, idx) => idx === i ? { ...l, accent: !l.accent } : l))

  const setColor = (i: number, color: string) =>
    update(links.map((l, idx) => idx === i ? { ...l, underlineColor: color } : l))

  const moveUp = (i: number) => {
    if (i === 0) return
    const next = [...links]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    update(next)
  }

  const moveDown = (i: number) => {
    if (i === links.length - 1) return
    const next = [...links]
    ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
    update(next)
  }

  const removeLink = (i: number) => update(links.filter((_, idx) => idx !== i))

  const addLink = () =>
    update([...links, { _key: rk(), label: '', href: '/', enabled: true, underlineColor: 'var(--brand-black)' }])

  // ── Child operations ─────────────────────────────────────────────────────
  const addChild = (i: number) =>
    update(links.map((l, idx) => idx !== i ? l : {
      ...l,
      children: [...(l.children ?? []), { _key: rk(), label: '', href: '/', enabled: true }],
    }))

  const setChildLabel = (i: number, j: number, v: string) =>
    update(links.map((l, idx) => idx !== i ? l : {
      ...l,
      children: (l.children ?? []).map((c, ci) => ci === j ? { ...c, label: v } : c),
    }))

  const setChildHref = (i: number, j: number, v: string) =>
    update(links.map((l, idx) => idx !== i ? l : {
      ...l,
      children: (l.children ?? []).map((c, ci) => ci === j ? { ...c, href: v } : c),
    }))

  const toggleChild = (i: number, j: number) =>
    update(links.map((l, idx) => idx !== i ? l : {
      ...l,
      children: (l.children ?? []).map((c, ci) => ci === j ? { ...c, enabled: c.enabled === false } : c),
    }))

  const removeChild = (i: number, j: number) =>
    update(links.map((l, idx) => idx !== i ? l : {
      ...l,
      children: (l.children ?? []).filter((_, ci) => ci !== j),
    }))

  const loadDefaults = () => update(withKeys(DEFAULT_LINKS))

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={wrap}>
      <div style={topRow}>
        <div>
          <div style={sectionLabel}>Nav Links ({links.length})</div>
          <div style={hint}>Changes save automatically when you hit Publish.</div>
        </div>
        <button onClick={loadDefaults} style={btnSecondary}>
          ↺ {links.length === 0 ? 'Load current nav' : 'Reset to defaults'}
        </button>
      </div>

      {links.length === 0 ? (
        <div style={emptyBox}>
          No links yet.{' '}
          <button onClick={loadDefaults} style={{ ...btnPrimary, display: 'inline', padding: '4px 10px', fontSize: 12 }}>
            Load current nav
          </button>{' '}
          to start with your existing navigation.
        </div>
      ) : (
        links.map((link, i) => {
          const isVisible = link.enabled !== false

          return (
            <div key={link._key} style={linkCard}>
              {/* ── Main link row ──────────────────────────────────────── */}
              <div style={linkRow}>
                {/* Visibility pill */}
                <button
                  onClick={() => toggleEnabled(i)}
                  title={isVisible ? 'Visible — click to hide' : 'Hidden — click to show'}
                  style={{
                    padding: '3px 10px',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    background: isVisible ? '#d4edda' : '#f0f0f0',
                    color:      isVisible ? '#1a5c30' : '#888',
                    minWidth: 54,
                  }}
                >
                  {isVisible ? 'Show' : 'Hide'}
                </button>

                {/* Label */}
                <input
                  style={{ ...inputBase, width: 110 }}
                  placeholder="Label"
                  value={link.label}
                  onChange={e => setLabel(i, e.target.value)}
                />

                {/* Href */}
                <input
                  style={{ ...inputBase, flex: 1, minWidth: 160 }}
                  placeholder="/products?category=..."
                  value={link.href}
                  onChange={e => setHref(i, e.target.value)}
                />

                {/* Underline colour swatches */}
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  {COLOURS.map(c => (
                    <button
                      key={c.value}
                      title={c.name + ' underline'}
                      onClick={() => setColor(i, c.value)}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        background: c.hex,
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        flexShrink: 0,
                        boxShadow: link.underlineColor === c.value
                          ? `0 0 0 2px #fff, 0 0 0 4px ${c.hex}`
                          : `0 0 0 1px #e5e5e5`,
                      }}
                    />
                  ))}
                </div>

                {/* Red accent (Sale) toggle */}
                <button
                  onClick={() => toggleAccent(i)}
                  title="Highlight in red — use for Sale"
                  style={{
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    letterSpacing: '0.06em',
                    background: link.accent ? '#c0392b' : '#f0f0f0',
                    color:      link.accent ? '#fff'    : '#bbb',
                  }}
                >
                  SALE
                </button>

                {/* Reorder */}
                <button onClick={() => moveUp(i)}   style={iconBtn} disabled={i === 0}                 title="Move up">▲</button>
                <button onClick={() => moveDown(i)} style={iconBtn} disabled={i === links.length - 1} title="Move down">▼</button>

                {/* Delete */}
                <button onClick={() => removeLink(i)} style={delBtn} title="Remove link">✕</button>
              </div>

              {/* ── Sub-links ─────────────────────────────────────────── */}
              {(link.children ?? []).length > 0 && (
                <div style={childrenWrap}>
                  {link.children!.map((child, j) => (
                    <div key={child._key} style={childRow}>
                      <span style={{ color: '#ccc', fontSize: 11, flexShrink: 0 }}>└─</span>
                      <button
                        onClick={() => toggleChild(i, j)}
                        style={{
                          padding: '2px 8px',
                          borderRadius: 20,
                          fontSize: 10,
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          background: child.enabled !== false ? '#d4edda' : '#f0f0f0',
                          color:      child.enabled !== false ? '#1a5c30' : '#888',
                          minWidth: 44,
                        }}
                      >
                        {child.enabled !== false ? 'Show' : 'Hide'}
                      </button>
                      <input
                        style={{ ...inputBase, width: 100 }}
                        placeholder="Label"
                        value={child.label}
                        onChange={e => setChildLabel(i, j, e.target.value)}
                      />
                      <input
                        style={{ ...inputBase, flex: 1 }}
                        placeholder="/products?..."
                        value={child.href}
                        onChange={e => setChildHref(i, j, e.target.value)}
                      />
                      <button onClick={() => removeChild(i, j)} style={{ ...iconBtn, color: '#c0392b', borderColor: '#f5c6cb' }} title="Remove">✕</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add sub-link */}
              <button onClick={() => addChild(i)} style={addChildBtn}>
                + Add dropdown link
              </button>
            </div>
          )
        })
      )}

      {/* Add top-level link */}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button onClick={addLink} style={btnPrimary}>+ Add Link</button>
      </div>
    </div>
  )
}
