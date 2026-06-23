'use client'

import { ObjectInputProps, MemberField, useFormValue } from 'sanity'

const BRAND_YELLOW = '#c9a227'

type FocalPoints = {
  imageMobile?:  { asset?: { _ref?: string } }
  imageTablet?:  { asset?: { _ref?: string } }
  imageDesktop?: { asset?: { _ref?: string } }
  imageXl?:      { asset?: { _ref?: string } }
}

type ContentValue = {
  label?:         string
  heading?:       string
  sub?:           string
  href?:          string
  textPosition?:  number
  textPositionX?: number
  textColor?:     string
  buttonColor?:   string
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

export function HeroContentPreview(props: ObjectInputProps) {
  const { value, members, renderInput, renderField, renderItem, renderPreview } = props
  const renderProps = { renderInput, renderField, renderItem, renderPreview }

  const focalPoints = useFormValue(['focalPoints']) as FocalPoints | undefined
  const legacyImage = useFormValue(['image'])      as { asset?: { _ref?: string } } | undefined

  const imageRef =
    focalPoints?.imageMobile?.asset?._ref  ??
    focalPoints?.imageTablet?.asset?._ref  ??
    focalPoints?.imageDesktop?.asset?._ref ??
    focalPoints?.imageXl?.asset?._ref      ??
    legacyImage?.asset?._ref

  const imageUrl = imageRef ? refToUrl(imageRef) : null

  const cv = (value as ContentValue | undefined) ?? {}

  const textColor     = cv.textColor === 'black' ? '#000' : '#fff'
  const buttonBorder  = BUTTON_BORDER[cv.buttonColor ?? 'white'] ?? '#fff'
  const textPosition  = cv.textPosition  ?? 85
  const textPositionX = cv.textPositionX ?? 0

  return (
    <div>
      {/* ── Live preview ── */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: 10 }}>
          Live Preview
        </p>

        <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 7', borderRadius: 8, overflow: 'hidden', background: '#1a1a1a', border: '1px solid #ddd' }}>

          {/* Image */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="slide preview"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#666', fontSize: 12 }}>Upload an image on the Images tab to see the preview</p>
            </div>
          )}

          {/* Gradient overlay */}
          {imageUrl && (
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }} />
          )}

          {/* Text overlay — mirrors live site: vertical + horizontal position */}
          <div
            style={{
              position: 'absolute',
              padding: '16px 20px',
              maxWidth: '70%',
              top:       `${textPosition}%`,
              left:      `${textPositionX}%`,
              transform: `translateY(-100%) translateX(-${textPositionX}%)`,
            }}
          >
            {cv.label && (
              <p style={{ color: BRAND_YELLOW, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
                {cv.label}
              </p>
            )}

            <p style={{ color: textColor, fontSize: 20, fontWeight: 700, lineHeight: 1.2, marginBottom: 6, whiteSpace: 'pre-line' }}>
              {cv.heading || <span style={{ opacity: 0.3 }}>Your heading here</span>}
            </p>

            {cv.sub && (
              <p style={{ color: textColor, opacity: 0.85, fontSize: 11, marginBottom: 10, lineHeight: 1.4 }}>
                {cv.sub}
              </p>
            )}

            {cv.href && (
              <div style={{ display: 'inline-block', border: `1px solid ${buttonBorder}`, color: buttonBorder, padding: '5px 14px', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
                Shop Now
              </div>
            )}
          </div>
        </div>

        <p style={{ fontSize: 11, color: '#aaa', marginTop: 6 }}>
          Updates as you type. Drag the Text Vertical Position slider below to reposition.
        </p>
      </div>

      {/* ── Fields ── */}
      {members.map((m) => m.kind === 'field' && (
        <MemberField key={m.key} member={m} {...renderProps} />
      ))}
    </div>
  )
}
