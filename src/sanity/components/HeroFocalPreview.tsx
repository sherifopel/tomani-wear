import React, { useState } from 'react'
import { set, ObjectInputProps, useFormValue } from 'sanity'

const BRAND_YELLOW = '#c9a227'

const DEVICES = [
  { key: 'mobile',  label: 'Mobile',  previewW: 195, previewH: 380 },
  { key: 'tablet',  label: 'Tablet',  previewW: 256, previewH: 305 },
  { key: 'desktop', label: 'Desktop', previewW: 451, previewH: 180 },
] as const

type DeviceKey = (typeof DEVICES)[number]['key']

type FocalPoints = {
  mobile?:  number
  tablet?:  number
  desktop?: number
}

function sanityRefToUrl(ref: string): string {
  const id = ref.replace(/^image-/, '').replace(/-(\w+)$/, '.$1')
  return `https://cdn.sanity.io/images/tu8h6v2e/production/${id}?w=900&auto=format`
}

export function HeroFocalPreview(props: ObjectInputProps) {
  const { value, onChange } = props

  const [activeDevice, setActiveDevice] = useState<DeviceKey>('desktop')
  const [localY, setLocalY] = useState<number | null>(null)

  const focalPoints: FocalPoints = (value as FocalPoints | undefined) ?? {}
  const device = DEVICES.find((d) => d.key === activeDevice)!

  const heroImage = useFormValue(['image']) as { asset?: { _ref?: string } } | undefined
  const imageUrl = heroImage?.asset?._ref ? sanityRefToUrl(heroImage.asset._ref) : null

  const savedY   = focalPoints[activeDevice] ?? (activeDevice === 'desktop' ? 30 : 50)
  const displayY = localY !== null ? localY : savedY

  function handleSaveForDevice() {
    if (localY === null) return
    onChange(set(localY, [activeDevice]))
    setLocalY(null)
  }

  function handleSaveForAll() {
    if (localY === null) return
    onChange([
      set(localY, ['mobile']),
      set(localY, ['tablet']),
      set(localY, ['desktop']),
    ])
    setLocalY(null)
  }

  return (
    <div style={{ fontFamily: 'sans-serif', color: '#1a1a1a' }}>

      {/* ── Device tabs ── */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {DEVICES.map((d) => {
          const isActive = d.key === activeDevice
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => { setActiveDevice(d.key); setLocalY(null) }}
              style={{
                padding: '6px 16px',
                border: `2px solid ${isActive ? BRAND_YELLOW : '#ccc'}`,
                borderRadius: 6,
                background: isActive ? BRAND_YELLOW : '#fff',
                color: isActive ? '#fff' : '#333',
                fontWeight: isActive ? 700 : 400,
                cursor: 'pointer',
                fontSize: 13,
                transition: 'all 0.15s',
              }}
            >
              {d.label}
            </button>
          )
        })}
      </div>

      {/* ── Live preview ── */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555', marginBottom: 8 }}>
          Preview
        </p>
        <div style={{ width: device.previewW, height: device.previewH, overflow: 'hidden', borderRadius: 8, border: '1px solid #ddd', background: '#f0f0f0' }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `center ${displayY}%`, display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 12, textAlign: 'center', padding: 16 }}>
              Upload a Hero Image above to see the preview
            </div>
          )}
        </div>
      </div>

      {/* ── Focal point slider ── */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: '#555' }}>
          <span>Top (0)</span>
          <span style={{ fontWeight: 600, color: BRAND_YELLOW }}>Position: {displayY}%</span>
          <span>Bottom (100)</span>
        </div>
        <input
          type="range" min={0} max={100} step={5} value={displayY}
          onChange={(e) => setLocalY(Number(e.target.value))}
          style={{ width: '100%', accentColor: BRAND_YELLOW, cursor: 'pointer' }}
        />
      </div>

      {/* ── Save buttons (only when slider moved) ── */}
      {localY !== null && (
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            type="button"
            onClick={handleSaveForDevice}
            style={{ padding: '8px 16px', background: BRAND_YELLOW, color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
          >
            Save for {device.label}
          </button>
          <button
            type="button"
            onClick={handleSaveForAll}
            style={{ padding: '8px 16px', background: '#333', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
          >
            Save for All Devices
          </button>
        </div>
      )}

      {/* ── Saved values summary ── */}
      <div style={{ marginTop: 16, fontSize: 12, color: '#888', display: 'flex', gap: 16 }}>
        {(['mobile', 'tablet', 'desktop'] as const).map((d) => {
          const val = focalPoints[d] ?? (d === 'desktop' ? 30 : 50)
          return <span key={d}>{d.charAt(0).toUpperCase() + d.slice(1)}: <strong>{val}%</strong></span>
        })}
      </div>

    </div>
  )
}
