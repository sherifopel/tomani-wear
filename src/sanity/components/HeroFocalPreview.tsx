import { useState } from 'react'
import { set, ObjectInputProps, MemberField } from 'sanity'

const BRAND_YELLOW = '#c9a227'

// ─── Device config ────────────────────────────────────────────────────────────

const DEVICES = [
  { key: 'mobile',  label: 'Mobile',      previewW: 195, previewH: 380, imageField: 'imageMobile',  focalYField: 'mobile',  focalXField: 'mobileX'  },
  { key: 'tablet',  label: 'Tablet',      previewW: 256, previewH: 305, imageField: 'imageTablet',  focalYField: 'tablet',  focalXField: 'tabletX'  },
  { key: 'desktop', label: 'Desktop',     previewW: 451, previewH: 180, imageField: 'imageDesktop', focalYField: 'desktop', focalXField: 'desktopX' },
  { key: 'xl',      label: 'Extra Large', previewW: 560, previewH: 155, imageField: 'imageXl',      focalYField: 'xlarge',  focalXField: 'xlargeX'  },
] as const

type DeviceKey = (typeof DEVICES)[number]['key']

type ObjectValue = {
  imageMobile?:  { asset?: { _ref?: string } }
  imageTablet?:  { asset?: { _ref?: string } }
  imageDesktop?: { asset?: { _ref?: string } }
  imageXl?:      { asset?: { _ref?: string } }
  video?:        { asset?: { _ref?: string; url?: string } }
  mobile?:   number
  tablet?:   number
  desktop?:  number
  xlarge?:   number
  mobileX?:  number
  tabletX?:  number
  desktopX?: number
  xlargeX?:  number
}

const DEFAULT_Y: Record<DeviceKey, number> = { mobile: 50, tablet: 50, desktop: 30, xl: 30 }
const DEFAULT_X: Record<DeviceKey, number> = { mobile: 50, tablet: 50, desktop: 50, xl: 50 }

// Same fallback order as the GROQ coalesce() chain
const FALLBACK_CHAIN: Record<DeviceKey, DeviceKey[]> = {
  mobile:  [],
  tablet:  ['mobile'],
  desktop: ['tablet', 'mobile'],
  xl:      ['desktop', 'tablet', 'mobile'],
}

function sanityRefToUrl(ref: string): string {
  const id = ref.replace(/^image-/, '').replace(/-(\w+)$/, '.$1')
  return `https://cdn.sanity.io/images/tu8h6v2e/production/${id}?w=900&auto=format`
}

function getEffectiveImage(
  objectValue: ObjectValue,
  deviceKey: DeviceKey,
): { ref: string; source: DeviceKey } | null {
  const own = DEVICES.find((d) => d.key === deviceKey)!
  const ownRef = (objectValue[own.imageField as keyof ObjectValue] as ObjectValue['imageMobile'])?.asset?._ref
  if (ownRef) return { ref: ownRef, source: deviceKey }
  for (const fallbackKey of FALLBACK_CHAIN[deviceKey]) {
    const fb = DEVICES.find((d) => d.key === fallbackKey)!
    const fbRef = (objectValue[fb.imageField as keyof ObjectValue] as ObjectValue['imageMobile'])?.asset?._ref
    if (fbRef) return { ref: fbRef, source: fallbackKey }
  }
  return null
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroFocalPreview(props: ObjectInputProps) {
  const { value, onChange, members, renderInput, renderField, renderItem, renderPreview } = props
  const renderProps = { renderInput, renderField, renderItem, renderPreview }

  const [activeDevice, setActiveDevice] = useState<DeviceKey>('mobile')
  const [localY, setLocalY] = useState<number | null>(null)
  const [localX, setLocalX] = useState<number | null>(null)

  const objectValue = (value as ObjectValue | undefined) ?? {}
  const device = DEVICES.find((d) => d.key === activeDevice)!

  const effective       = getEffectiveImage(objectValue, activeDevice)
  const imageUrl        = effective ? sanityRefToUrl(effective.ref) : null
  const isUsingFallback = effective !== null && effective.source !== activeDevice
  const fallbackLabel   = isUsingFallback ? DEVICES.find((d) => d.key === effective.source)!.label : null

  const imageMember = members.find((m) => m.kind === 'field' && m.name === device.imageField)
  const videoMember = members.find((m) => m.kind === 'field' && m.name === 'video')
  const videoRef    = objectValue.video?.asset?._ref
  const hasVideo    = Boolean(videoRef)

  const savedY   = (objectValue[device.focalYField as keyof ObjectValue] as number | undefined) ?? DEFAULT_Y[activeDevice]
  const savedX   = (objectValue[device.focalXField as keyof ObjectValue] as number | undefined) ?? DEFAULT_X[activeDevice]
  const displayY = localY !== null ? localY : savedY
  const displayX = localX !== null ? localX : savedX

  // X slider is only useful on Desktop/XL when they have their own image uploaded.
  // Portrait fallback images in a wide container fill the width → no horizontal overflow → slider does nothing.
  const wideDevices: DeviceKey[] = ['desktop', 'xl']
  const showXSlider = !wideDevices.includes(activeDevice) || !isUsingFallback

  const hasPendingChanges = localY !== null || (showXSlider && localX !== null)

  function handleSwitchDevice(key: DeviceKey) {
    setActiveDevice(key)
    setLocalY(null)
    setLocalX(null)
  }

  function handleSaveForDevice() {
    const patches = []
    if (localY !== null) patches.push(set(localY, [device.focalYField]))
    if (localX !== null) patches.push(set(localX, [device.focalXField]))
    onChange(patches)
    setLocalY(null)
    setLocalX(null)
  }

  function handleSaveForAll() {
    const patches = []
    if (localY !== null) {
      patches.push(set(localY, ['mobile']), set(localY, ['tablet']), set(localY, ['desktop']), set(localY, ['xlarge']))
    }
    if (localX !== null) {
      patches.push(set(localX, ['mobileX']), set(localX, ['tabletX']), set(localX, ['desktopX']), set(localX, ['xlargeX']))
    }
    onChange(patches)
    setLocalY(null)
    setLocalX(null)
  }

  // Build video CDN URL from the asset ref so we can preview it inline
  const videoCdnUrl = videoRef
    ? `https://cdn.sanity.io/files/tu8h6v2e/production/${videoRef.replace(/^file-/, '').replace(/-([^-]+)$/, '.$1')}`
    : null

  return (
    <div style={{ fontFamily: 'sans-serif', color: '#1a1a1a' }}>

      {/* ── Video upload ── */}
      {videoMember && videoMember.kind === 'field' && (
        <div style={{ marginBottom: 24, padding: 16, border: `2px solid ${hasVideo ? BRAND_YELLOW : '#e0e0e0'}`, borderRadius: 8, background: hasVideo ? '#fffdf0' : '#fafafa' }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: hasVideo ? BRAND_YELLOW : '#888', marginBottom: 4 }}>
            {hasVideo ? '▶ Video active' : 'Hero Video (optional)'}
          </p>
          {hasVideo && (
            <p style={{ fontSize: 11, color: '#b08a00', marginBottom: 12 }}>
              Video plays on the live site. Your device images are kept — switch to each device tab below to preview how the video is cropped at that screen size.
            </p>
          )}
          <MemberField member={videoMember} {...renderProps} />
        </div>
      )}

      {/* ── Device tabs ── */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
        {DEVICES.map((d) => {
          const isActive = d.key === activeDevice
          const hasImage = Boolean(
            (objectValue[d.imageField as keyof ObjectValue] as ObjectValue['imageMobile'])?.asset?._ref
          )
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => handleSwitchDevice(d.key)}
              style={{
                padding: '6px 16px',
                border: `2px solid ${isActive ? BRAND_YELLOW : hasImage ? '#4caf50' : '#ccc'}`,
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
              {hasImage && !isActive && (
                <span style={{ marginLeft: 6, color: '#4caf50', fontSize: 11 }}>✓</span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Native Sanity image upload for the active device ── */}
      {imageMember && imageMember.kind === 'field' && (
        <div style={{ marginBottom: 20 }}>
          <MemberField member={imageMember} {...renderProps} />
        </div>
      )}

      {/* ── Crop preview + sliders — shown when device has its own image OR a fallback ── */}
      {imageUrl && (
        <>
          {/* Fallback notice */}
          {isUsingFallback && (
            <div style={{ marginBottom: 12, padding: '8px 12px', background: '#fffbea', border: '1px solid #f0d060', borderRadius: 6, fontSize: 12, color: '#7a5c00' }}>
              Showing <strong>{fallbackLabel}</strong> image — no {device.label} image uploaded yet. Upload one above to use a different image for this screen size.
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555', marginBottom: 8 }}>
              Crop Preview — {device.label}
            </p>
            <div style={{ width: device.previewW, height: device.previewH, overflow: 'hidden', borderRadius: 8, border: `1px solid ${hasVideo ? BRAND_YELLOW : isUsingFallback ? '#f0d060' : '#ddd'}`, background: '#000', maxWidth: '100%' }}>
              {hasVideo && videoCdnUrl ? (
                <video
                  src={videoCdnUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${displayX}% ${displayY}%`, display: 'block' }}
                />
              ) : (
                <img
                  src={imageUrl}
                  alt={`${device.label} crop preview`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${displayX}% ${displayY}%`, display: 'block' }}
                />
              )}
            </div>
          </div>

          {/* ── Vertical (Y) slider ── */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: '#555' }}>
              <span>Top (0)</span>
              <span style={{ fontWeight: 600, color: BRAND_YELLOW }}>Vertical: {displayY}%</span>
              <span>Bottom (100)</span>
            </div>
            <input
              type="range"
              min={0} max={100} step={5}
              value={displayY}
              onChange={(e) => setLocalY(Number(e.target.value))}
              style={{ width: '100%', accentColor: BRAND_YELLOW, cursor: 'pointer' }}
            />
          </div>

          {/* ── Horizontal (X) slider — hidden on Desktop/XL when using a fallback image ── */}
          {showXSlider ? (
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12, color: '#555' }}>
                <span>Left (0)</span>
                <span style={{ fontWeight: 600, color: BRAND_YELLOW }}>Horizontal: {displayX}%</span>
                <span>Right (100)</span>
              </div>
              <input
                type="range"
                min={0} max={100} step={5}
                value={displayX}
                onChange={(e) => setLocalX(Number(e.target.value))}
                style={{ width: '100%', accentColor: BRAND_YELLOW, cursor: 'pointer' }}
              />
            </div>
          ) : (
            <p style={{ fontSize: 12, color: '#aaa', marginBottom: 12, fontStyle: 'italic' }}>
              Horizontal positioning is available once you upload a dedicated {device.label} image above.
            </p>
          )}

          {/* ── Save buttons — appear when either slider has been moved ── */}
          {hasPendingChanges && (
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

          {/* ── Summary of saved positions for all devices ── */}
          <div style={{ marginTop: 16, fontSize: 12, color: '#888', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {DEVICES.map((d) => {
              const y = (objectValue[d.focalYField as keyof ObjectValue] as number | undefined) ?? DEFAULT_Y[d.key]
              const x = (objectValue[d.focalXField as keyof ObjectValue] as number | undefined) ?? DEFAULT_X[d.key]
              return <span key={d.key}>{d.label}: <strong>X {x}% · Y {y}%</strong></span>
            })}
          </div>
        </>
      )}

    </div>
  )
}
