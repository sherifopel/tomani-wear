'use client'

import React, { useState } from 'react'
import { set, ObjectInputProps, useFormValue } from 'sanity'

const BRAND_YELLOW = '#c9a227'

const DEVICES = [
  { key: 'mobile', label: 'Mobile', previewW: 195, previewH: 380 },
  { key: 'tablet', label: 'Tablet', previewW: 256, previewH: 305 },
  { key: 'desktop', label: 'Desktop', previewW: 451, previewH: 180 },
] as const

type DeviceKey = (typeof DEVICES)[number]['key']

type FocalPoints = {
  mobile?: number
  tablet?: number
  desktop?: number
}

function sanityRefToUrl(ref: string): string {
  // ref format: "image-abc123-1000x1500-jpg"
  const id = ref.replace(/^image-/, '').replace(/-(\w+)$/, '.$1')
  return `https://cdn.sanity.io/images/tu8h6v2e/production/${id}?w=900&auto=format`
}

export function HeroFocalPreview(props: ObjectInputProps) {
  const { value, onChange } = props

  const [activeDevice, setActiveDevice] = useState<DeviceKey>('desktop')
  const [localY, setLocalY] = useState<number | null>(null)

  // Read the hero image from the parent document
  const imageField = useFormValue(['image']) as { asset?: { _ref?: string } } | undefined
  const imageRef = imageField?.asset?._ref
  const imageUrl = imageRef ? sanityRefToUrl(imageRef) : null

  const focalPoints: FocalPoints = (value as FocalPoints | undefined) ?? {}

  const savedValue = (focalPoints[activeDevice] as number | undefined) ?? 50
  const displayValue = localY !== null ? localY : savedValue

  const device = DEVICES.find((d) => d.key === activeDevice)!

  function handleSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLocalY(Number(e.target.value))
  }

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
      {/* Device tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {DEVICES.map((d) => {
          const isActive = d.key === activeDevice
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => {
                setActiveDevice(d.key)
                setLocalY(null)
              }}
              style={{
                padding: '6px 16px',
                border: isActive ? `2px solid ${BRAND_YELLOW}` : '2px solid #ccc',
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

      {/* Image preview */}
      <div
        style={{
          width: device.previewW,
          height: device.previewH,
          overflow: 'hidden',
          borderRadius: 8,
          border: '1px solid #ddd',
          marginBottom: 16,
          background: '#f0f0f0',
          position: 'relative',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Hero preview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: `center ${displayValue}%`,
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              fontSize: 13,
            }}
          >
            No image uploaded yet
          </div>
        )}
      </div>

      {/* Slider */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 6,
            fontSize: 12,
            color: '#555',
          }}
        >
          <span>Top (0)</span>
          <span style={{ fontWeight: 600, color: BRAND_YELLOW }}>Position: {displayValue}%</span>
          <span>Bottom (100)</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={displayValue}
          onChange={handleSliderChange}
          style={{
            width: '100%',
            accentColor: BRAND_YELLOW,
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Save buttons — only shown after slider has been moved */}
      {localY !== null && (
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            type="button"
            onClick={handleSaveForDevice}
            style={{
              padding: '8px 16px',
              background: BRAND_YELLOW,
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            Save for {device.label}
          </button>
          <button
            type="button"
            onClick={handleSaveForAll}
            style={{
              padding: '8px 16px',
              background: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            Save for All Devices
          </button>
        </div>
      )}

      {/* Saved values summary */}
      <div style={{ marginTop: 16, fontSize: 12, color: '#888', display: 'flex', gap: 16 }}>
        {DEVICES.map((d) => {
          const val = (focalPoints[d.key] as number | undefined) ?? (d.key === 'desktop' ? 30 : 50)
          return (
            <span key={d.key}>
              {d.label}: <strong>{val}%</strong>
            </span>
          )
        })}
      </div>
    </div>
  )
}
