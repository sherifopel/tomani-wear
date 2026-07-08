'use client'
import { set } from 'sanity'
import type { ArrayOfObjectsInputProps } from 'sanity'

const THEMES = [
  { label: 'Black & White', value: 'black-white' },
  { label: 'Grey & Red',    value: 'grey-red'    },
]

type Banner = { _key: string; _type: string; message?: string; theme?: string }

export function AnnouncementBannersInput(props: ArrayOfObjectsInputProps) {
  const { value = [], onChange, readOnly } = props
  const banners = value as Banner[]

  function addBanner() {
    if (banners.length >= 3) return
    onChange(set([...banners, { _type: 'object', _key: crypto.randomUUID(), message: '', theme: 'black-white' }]))
  }

  function updateField(key: string, field: string, val: string) {
    onChange(set(banners.map(b => b._key === key ? { ...b, [field]: val } : b)))
  }

  function removeBanner(key: string) {
    onChange(set(banners.filter(b => b._key !== key)))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {banners.map((banner, i) => (
        <div
          key={banner._key}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 4, background: '#fff' }}
        >
          <span style={{ fontSize: 11, color: '#9ca3af', minWidth: 14 }}>{i + 1}</span>

          <input
            value={banner.message ?? ''}
            onChange={e => updateField(banner._key, 'message', e.target.value)}
            placeholder="Banner message…"
            disabled={readOnly}
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, background: 'transparent' }}
          />

          <div style={{ display: 'flex', gap: 14, fontSize: 12, flexShrink: 0 }}>
            {THEMES.map(t => (
              <label key={t.value} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <input
                  type="radio"
                  name={`theme-${banner._key}`}
                  value={t.value}
                  checked={(banner.theme ?? 'black-white') === t.value}
                  onChange={() => updateField(banner._key, 'theme', t.value)}
                  disabled={readOnly}
                />
                {t.label}
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={() => removeBanner(banner._key)}
            disabled={readOnly}
            style={{ color: '#ef4444', fontSize: 14, border: 'none', background: 'none', cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>
      ))}

      {banners.length < 3 ? (
        <button
          type="button"
          onClick={addBanner}
          disabled={readOnly}
          style={{ padding: '8px', border: '1px dashed #d1d5db', borderRadius: 4, background: 'none', cursor: 'pointer', fontSize: 13, color: '#6b7280' }}
        >
          + Add banner ({banners.length}/3)
        </button>
      ) : (
        <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', margin: 0 }}>Maximum 3 banners</p>
      )}
    </div>
  )
}
