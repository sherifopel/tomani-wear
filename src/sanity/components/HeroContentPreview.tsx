'use client'

import { useState } from 'react'
import { ObjectInputProps, MemberField, useFormValue } from 'sanity'

const BRAND_YELLOW = '#c9a227'

type FocalPoints = {
  imageMobile?:  { asset?: { _ref?: string } }
  imageTablet?:  { asset?: { _ref?: string } }
  imageDesktop?: { asset?: { _ref?: string } }
  imageXl?:      { asset?: { _ref?: string } }
}

type ContentValue = {
  label?:                string
  heading?:              string
  sub?:                  string
  ctaLabel?:             string
  href?:                 string
  textPosition?:         number
  textPositionX?:        number
  mobileTextPosition?:   number
  mobileTextPositionX?:  number
  tabletTextPosition?:   number
  tabletTextPositionX?:  number
  desktopTextPosition?:  number
  desktopTextPositionX?: number
  xlTextPosition?:       number
  xlTextPositionX?:      number
  textColor?:            string
  textCustomColor?:      string
  buttonColor?:          string
  buttonCustomColor?:    string
  buttonBackgroundColor?: string
}

function refToUrl(ref: string): string {
  const id = ref.replace(/^image-/, '').replace(/-(\w+)$/, '.$1')
  return `https://cdn.sanity.io/images/tu8h6v2e/production/${id}?w=900&auto=format`
}

const BUTTON_BORDER: Record<string, string> = {
  white: '#ffffff',
  black: '#000000',
  gold:  BRAND_YELLOW,
}

const SCREEN_CONTROL_FIELDS: Record<string, string[]> = {
  Small:         ['mobileTextPosition',  'mobileTextPositionX'],
  Medium:        ['tabletTextPosition',  'tabletTextPositionX'],
  Large:         ['desktopTextPosition', 'desktopTextPositionX'],
  'Extra Large': ['xlTextPosition',      'xlTextPositionX'],
}

const CSS = `
  .tw-page-builder {
    display: flex;
    gap: 0;
    align-items: flex-start;
  }

  /* ── Left: scrollable controls ── */
  .tw-controls {
    flex: 0 0 52%;
    min-width: 0;
    padding-right: 20px;
    border-right: 1px solid #e5e7eb;
  }

  /* Reduce Sanity's own field labels so they don't wrap */
  .tw-controls label,
  .tw-controls [data-ui="FormField"] > div > label {
    font-size: 12px !important;
  }

  .tw-section {
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #f0f0f0;
  }

  .tw-section:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  .tw-section-title {
    margin: 0 0 12px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #555;
  }

  /* ── Right: sticky live preview ── */
  .tw-preview-panel {
    flex: 1;
    min-width: 0;
    position: sticky;
    top: 0;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 16px;
    margin-left: 20px;
    background: #fafafa;
  }

  .tw-screen-switcher {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
    margin-bottom: 14px;
  }

  .tw-hint {
    font-size: 10px;
    color: #aaa;
    margin-top: 8px;
    text-align: center;
  }

  /* ── Colour field cards ── */
  .tw-field-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px 14px;
    margin-bottom: 10px;
    background: #fff;
  }

  .tw-field-card:last-child {
    margin-bottom: 0;
  }
`

export function HeroContentPreview(props: ObjectInputProps) {
  const { value, members, renderInput, renderField, renderItem, renderPreview } = props
  const renderProps = { renderInput, renderField, renderItem, renderPreview }
  const [activeScreen, setActiveScreen] = useState('Small')

  const focalPoints = useFormValue(['focalPoints']) as FocalPoints | undefined
  const legacyImage = useFormValue(['image'])      as { asset?: { _ref?: string } } | undefined

  const cv = (value as ContentValue | undefined) ?? {}

  const mobileImageRef  = focalPoints?.imageMobile?.asset?._ref  ?? legacyImage?.asset?._ref
  const tabletImageRef  = focalPoints?.imageTablet?.asset?._ref  ?? mobileImageRef
  const desktopImageRef = focalPoints?.imageDesktop?.asset?._ref ?? tabletImageRef
  const xlImageRef      = focalPoints?.imageXl?.asset?._ref      ?? desktopImageRef

  const textColor        = cv.textCustomColor || (cv.textColor === 'black' ? '#000' : '#fff')
  const buttonTextColor  = cv.buttonCustomColor || BUTTON_BORDER[cv.buttonColor ?? 'white'] || '#fff'
  const buttonBackground = cv.buttonBackgroundColor || 'transparent'
  const defaultY         = cv.textPosition  ?? 85
  const defaultX         = cv.textPositionX ?? 0
  const buttonLabel      = cv.ctaLabel || 'Shop Now'

  const screens = [
    { label: 'Small',       size: '390 × 844',    aspectRatio: '9 / 16',      previewWidth: 150, imageRef: mobileImageRef,  y: cv.mobileTextPosition  ?? defaultY, x: cv.mobileTextPositionX  ?? defaultX },
    { label: 'Medium',      size: '768 × 900',    aspectRatio: '4 / 5',       previewWidth: 200, imageRef: tabletImageRef,  y: cv.tabletTextPosition  ?? defaultY, x: cv.tabletTextPositionX  ?? defaultX },
    { label: 'Large',       size: '1505 × 600',   aspectRatio: '1505 / 600',  previewWidth: 320, imageRef: desktopImageRef, y: cv.desktopTextPosition ?? defaultY, x: cv.desktopTextPositionX ?? defaultX },
    { label: 'Extra Large', size: '1920 × 640',   aspectRatio: '3 / 1',       previewWidth: 320, imageRef: xlImageRef,      y: cv.xlTextPosition      ?? defaultY, x: cv.xlTextPositionX      ?? defaultX },
  ]

  const selectedScreen = screens.find(s => s.label === activeScreen) ?? screens[0]

  const fieldMembers    = members.filter(m => m.kind === 'field')
  const findField       = (name: string) => fieldMembers.find(m => (m as { name?: string }).name === name)
  const renderFieldByName = (name: string) => {
    const member = findField(name)
    return member ? <MemberField key={member.key} member={member} {...renderProps} /> : null
  }
  const renderFields = (names: string[]) => names.map(renderFieldByName)

  const renderPreviewFrame = (screen: typeof screens[number]) => {
    const imageUrl = screen.imageRef ? refToUrl(screen.imageRef) : null
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', margin: 0 }}>{screen.label}</p>
          <p style={{ fontSize: 10, color: '#999', margin: 0 }}>{screen.size}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', maxHeight: 340, overflow: 'hidden', padding: '4px 0' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: screen.previewWidth, aspectRatio: screen.aspectRatio, borderRadius: 8, overflow: 'hidden', background: '#1a1a1a', border: '1px solid #ddd' }}>
            {imageUrl ? (
              <img src={imageUrl} alt={`${screen.label} preview`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, textAlign: 'center' }}>
                <p style={{ color: '#666', fontSize: 11 }}>Upload an image on the Images tab to see this preview</p>
              </div>
            )}

            {imageUrl && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />}

            <div style={{ position: 'absolute', padding: screen.label === 'Small' ? '12px 14px' : '14px 18px', maxWidth: screen.label === 'Small' ? '88%' : '72%', top: `${screen.y}%`, left: `${screen.x}%`, transform: `translateY(-100%) translateX(-${screen.x}%)` }}>
              {cv.label && (
                <p style={{ color: BRAND_YELLOW, fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>{cv.label}</p>
              )}
              <p style={{ color: textColor, fontSize: screen.label === 'Small' ? 15 : 17, fontWeight: 700, lineHeight: 1.2, marginBottom: 4, whiteSpace: 'pre-line' }}>
                {cv.heading || <span style={{ opacity: 0.3 }}>Your heading here</span>}
              </p>
              {cv.sub && (
                <p style={{ color: textColor, opacity: 0.85, fontSize: 9, marginBottom: 8, lineHeight: 1.4 }}>{cv.sub}</p>
              )}
              {cv.href && (
                <div style={{ display: 'inline-block', border: `1px solid ${buttonTextColor}`, color: buttonTextColor, background: buttonBackground, padding: '4px 12px', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
                  {buttonLabel}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="tw-page-builder">
      <style>{CSS}</style>

      {/* ── Left: Controls ─────────────────────────────── */}
      <div className="tw-controls">

        <div className="tw-section">
          <p className="tw-section-title">Content</p>
          {renderFields(['label', 'heading', 'sub', 'ctaLabel', 'href'])}
        </div>

        <div className="tw-section">
          <p className="tw-section-title">{activeScreen} — Text Position</p>
          {renderFields(SCREEN_CONTROL_FIELDS[activeScreen] ?? [])}
        </div>

        <div className="tw-section">
          <p className="tw-section-title">Default Text Position</p>
          {renderFields(['textPosition', 'textPositionX'])}
        </div>

        <div className="tw-section">
          <p className="tw-section-title">Colours & Button</p>
          <div className="tw-field-card">{renderFieldByName('textColor')}</div>
          <div className="tw-field-card">{renderFieldByName('textCustomColor')}</div>
          <div className="tw-field-card">{renderFieldByName('buttonColor')}</div>
          <div className="tw-field-card">{renderFieldByName('buttonCustomColor')}</div>
          <div className="tw-field-card">{renderFieldByName('buttonBackgroundColor')}</div>
        </div>

      </div>

      {/* ── Right: Live Preview ─────────────────────────── */}
      <div className="tw-preview-panel">
        <p className="tw-section-title" style={{ marginBottom: 10 }}>Live Preview</p>

        <div className="tw-screen-switcher">
          {screens.map(screen => (
            <button
              key={screen.label}
              type="button"
              onClick={() => setActiveScreen(screen.label)}
              style={{
                border:      `1px solid ${activeScreen === screen.label ? BRAND_YELLOW : '#d1d5db'}`,
                background:  activeScreen === screen.label ? '#fff8d6' : '#fff',
                color:       '#222',
                borderRadius: 6,
                padding:     '6px 8px',
                fontSize:    10,
                fontWeight:  700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor:      'pointer',
              }}
            >
              {screen.label}
            </button>
          ))}
        </div>

        {renderPreviewFrame(selectedScreen)}

        <p className="tw-hint">Switch size to preview per-device text positions</p>
      </div>
    </div>
  )
}
