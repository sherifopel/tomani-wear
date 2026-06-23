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
  Small:       ['mobileTextPosition',  'mobileTextPositionX'],
  Medium:      ['tabletTextPosition',  'tabletTextPositionX'],
  Large:       ['desktopTextPosition', 'desktopTextPositionX'],
  'Extra Large': ['xlTextPosition',      'xlTextPositionX'],
}

export function HeroContentPreview(props: ObjectInputProps) {
  const { value, members, renderInput, renderField, renderItem, renderPreview } = props
  const renderProps = { renderInput, renderField, renderItem, renderPreview }
  const [activeScreen, setActiveScreen] = useState('Small')

  const focalPoints = useFormValue(['focalPoints']) as FocalPoints | undefined
  const legacyImage = useFormValue(['image'])      as { asset?: { _ref?: string } } | undefined

  const cv = (value as ContentValue | undefined) ?? {}

  const mobileImageRef =
    focalPoints?.imageMobile?.asset?._ref ??
    legacyImage?.asset?._ref
  const tabletImageRef =
    focalPoints?.imageTablet?.asset?._ref ??
    mobileImageRef
  const desktopImageRef =
    focalPoints?.imageDesktop?.asset?._ref ??
    tabletImageRef
  const xlImageRef =
    focalPoints?.imageXl?.asset?._ref ??
    desktopImageRef

  const textColor        = cv.textColor === 'black' ? '#000' : '#fff'
  const buttonTextColor  = cv.buttonCustomColor || BUTTON_BORDER[cv.buttonColor ?? 'white'] || '#fff'
  const buttonBackground = cv.buttonBackgroundColor || 'transparent'
  const defaultY         = cv.textPosition  ?? 85
  const defaultX         = cv.textPositionX ?? 0

  const screens = [
    {
      label: 'Small',
      size: '390 x 844',
      aspectRatio: '9 / 16',
      previewWidth: 170,
      imageRef: mobileImageRef,
      y: cv.mobileTextPosition  ?? defaultY,
      x: cv.mobileTextPositionX ?? defaultX,
    },
    {
      label: 'Medium',
      size: '768 x 900',
      aspectRatio: '4 / 5',
      previewWidth: 230,
      imageRef: tabletImageRef,
      y: cv.tabletTextPosition  ?? defaultY,
      x: cv.tabletTextPositionX ?? defaultX,
    },
    {
      label: 'Large',
      size: '1505 x 600',
      aspectRatio: '1505 / 600',
      previewWidth: 380,
      imageRef: desktopImageRef,
      y: cv.desktopTextPosition  ?? defaultY,
      x: cv.desktopTextPositionX ?? defaultX,
    },
    {
      label: 'Extra Large',
      size: '1920 x 640',
      aspectRatio: '3 / 1',
      previewWidth: 380,
      imageRef: xlImageRef,
      y: cv.xlTextPosition  ?? defaultY,
      x: cv.xlTextPositionX ?? defaultX,
    },
  ]

  const selectedScreen = screens.find((screen) => screen.label === activeScreen) ?? screens[0]

  const renderPreviewFrame = (screen: typeof screens[number]) => {
    const imageUrl = screen.imageRef ? refToUrl(screen.imageRef) : null

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', margin: 0 }}>
            {screen.label}
          </p>
          <p style={{ fontSize: 11, color: '#999', margin: 0 }}>{screen.size}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', maxHeight: 360, overflow: 'hidden', padding: '8px 0' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: screen.previewWidth, aspectRatio: screen.aspectRatio, borderRadius: 8, overflow: 'hidden', background: '#1a1a1a', border: '1px solid #ddd' }}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`${screen.label} slide preview`}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, textAlign: 'center' }}>
                <p style={{ color: '#666', fontSize: 12 }}>Upload an image on the Images tab to see this preview</p>
              </div>
            )}

            {imageUrl && (
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />
            )}

            <div
              style={{
                position: 'absolute',
                padding: screen.label === 'Small' ? '14px 16px' : '16px 20px',
                maxWidth: screen.label === 'Small' ? '88%' : '72%',
                top:       `${screen.y}%`,
                left:      `${screen.x}%`,
                transform: `translateY(-100%) translateX(-${screen.x}%)`,
              }}
            >
              {cv.label && (
                <p style={{ color: BRAND_YELLOW, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
                  {cv.label}
                </p>
              )}

              <p style={{ color: textColor, fontSize: screen.label === 'Small' ? 18 : 20, fontWeight: 700, lineHeight: 1.2, marginBottom: 6, whiteSpace: 'pre-line' }}>
                {cv.heading || <span style={{ opacity: 0.3 }}>Your heading here</span>}
              </p>

              {cv.sub && (
                <p style={{ color: textColor, opacity: 0.85, fontSize: 11, marginBottom: 10, lineHeight: 1.4 }}>
                  {cv.sub}
                </p>
              )}

              {cv.href && (
                <div style={{ display: 'inline-block', border: `1px solid ${buttonTextColor}`, color: buttonTextColor, background: buttonBackground, padding: '5px 14px', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
                  Shop Now
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const fieldMembers = members.filter((member) => member.kind === 'field')
  const findField = (name: string) => fieldMembers.find((member) => (member as { name?: string }).name === name)
  const renderFieldByName = (name: string) => {
    const member = findField(name)
    return member ? <MemberField key={member.key} member={member} {...renderProps} /> : null
  }
  const renderFields = (names: string[]) => names.map(renderFieldByName)

  const preview = (
    <div className="tomanni-hero-content-preview">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 10 }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', margin: 0 }}>
          Preview
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, marginBottom: 14 }}>
        {screens.map((screen) => (
          <button
            key={screen.label}
            type="button"
            onClick={() => setActiveScreen(screen.label)}
            style={{
              border: `1px solid ${activeScreen === screen.label ? BRAND_YELLOW : '#d1d5db'}`,
              background: activeScreen === screen.label ? '#fff8d6' : '#fff',
              color: '#222',
              borderRadius: 6,
              padding: '7px 8px',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            {screen.label}
          </button>
        ))}
      </div>

      {renderPreviewFrame(selectedScreen)}

      <p style={{ fontSize: 11, color: '#aaa', marginTop: 6 }}>
        Switch screen size here. The enablers below update for the selected view.
      </p>
    </div>
  )

  return (
    <div className="tomanni-hero-content-editor">
      <style>
        {`
          .tomanni-hero-content-editor {
            display: block;
          }

          .tomanni-hero-control-panel {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 18px;
            background: #fff;
          }

          .tomanni-hero-content-preview {
            position: sticky;
            top: 0;
            z-index: 5;
            margin-bottom: 28px;
            padding: 14px 0 18px;
            background: #fff;
            border-bottom: 1px solid #e5e7eb;
          }

          .tomanni-hero-content-section {
            margin-bottom: 28px;
          }

          .tomanni-hero-content-section:last-child {
            margin-bottom: 0;
          }

          .tomanni-hero-content-section-title {
            margin: 0 0 16px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #555;
          }
        `}
      </style>

      {preview}

      <div className="tomanni-hero-control-panel">
        <p className="tomanni-hero-content-section-title">Enablers</p>

        <div className="tomanni-hero-content-section">
          <p className="tomanni-hero-content-section-title">Content</p>
          {renderFields(['label', 'heading', 'sub', 'href'])}
        </div>

        <div className="tomanni-hero-content-section">
          <p className="tomanni-hero-content-section-title">{activeScreen} Text Position</p>
          {renderFields(SCREEN_CONTROL_FIELDS[activeScreen] ?? [])}
        </div>

        <div className="tomanni-hero-content-section">
          <p className="tomanni-hero-content-section-title">Button & Colours</p>
          {renderFields(['textColor', 'buttonColor', 'buttonCustomColor', 'buttonBackgroundColor'])}
        </div>
      </div>
    </div>
  )
}
