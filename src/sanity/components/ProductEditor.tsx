'use client'

/**
 * ProductEditor — unified product management UI for Sanity Studio.
 *
 * One image pool: upload as many shots as you like, tick one as "Main Display".
 * Everything else flows from there — gallery, sizes, pricing.
 */

import React, { useState, useEffect } from 'react'
import { ObjectInputProps, MemberField, set, unset, useFormValue } from 'sanity'

const BRAND_YELLOW = '#c9a227'
const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

// ─── Tiny helper: turn a Sanity asset _ref into a CDN preview URL ─────────────
// The _ref looks like: "image-abc123-800x600-jpg"
// We just need the middle part to build the CDN URL.
function assetRefToUrl(ref: string): string {
  // Strip "image-" prefix and replace last "-" before extension with "."
  const withoutPrefix = ref.replace(/^image-/, '')
  const lastDash = withoutPrefix.lastIndexOf('-')
  const idAndDims = withoutPrefix.slice(0, lastDash)
  const ext = withoutPrefix.slice(lastDash + 1)
  return `https://cdn.sanity.io/images/tu8h6v2e/production/${idAndDims}.${ext}?w=200&h=200&fit=crop&auto=format`
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: '#f9f9f9',
  border: '1px solid #e5e5e5',
  borderRadius: 8,
  padding: '20px 24px',
  marginBottom: 20,
}

const heading: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#555',
  margin: '0 0 16px 0',
}

const label: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: '#444',
  marginBottom: 6,
  display: 'block',
}

const hint: React.CSSProperties = {
  fontSize: 12,
  color: '#888',
  marginTop: 6,
  fontStyle: 'italic',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #ccc',
  borderRadius: 6,
  fontSize: 14,
  color: '#1a1a1a',
  background: '#fff',
  boxSizing: 'border-box',
}

// ─── Types ───────────────────────────────────────────────────────────────────

type SanityImageAsset = { _ref?: string }
type ProductImage = {
  _key: string
  image?: { asset?: SanityImageAsset; hotspot?: unknown }
  isMain?: boolean
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ProductEditor(props: ObjectInputProps) {
  const { members, onChange, renderInput, renderField, renderItem, renderPreview } = props
  const renderProps = { renderInput, renderField, renderItem, renderPreview }

  // Read live document values (paths are at document root — this component
  // is mounted at the document level via components: { input: ProductEditor })
  const currentProductImages = (useFormValue(['productImages']) as ProductImage[] | undefined) ?? []
  const currentSizes         = (useFormValue(['sizes'])          as string[]      | undefined) ?? []
  const currentShoeSizes     = (useFormValue(['shoeSizes'])       as string        | undefined) ?? ''
  const currentPrice         = (useFormValue(['price'])           as number        | undefined)
  const currentCompareAt     = (useFormValue(['compareAtPrice'])  as number        | undefined)

  // Local controlled state for text/number inputs (so the field doesn't lose
  // focus on every keystroke — we only write to Sanity on blur)
  const [localShoeSizes, setLocalShoeSizes] = useState(currentShoeSizes)
  const [localPrice,     setLocalPrice]     = useState(currentPrice != null ? String(currentPrice) : '')
  const [localCompareAt, setLocalCompareAt] = useState(currentCompareAt != null ? String(currentCompareAt) : '')
  const [onSale,         setOnSale]         = useState(currentCompareAt != null)

  // Sync local state when the document updates from outside (undo, initial load)
  useEffect(() => { setLocalShoeSizes(currentShoeSizes) }, [currentShoeSizes])
  useEffect(() => { setLocalPrice(currentPrice != null ? String(currentPrice) : '') }, [currentPrice])
  useEffect(() => {
    setLocalCompareAt(currentCompareAt != null ? String(currentCompareAt) : '')
    setOnSale(currentCompareAt != null)
  }, [currentCompareAt])

  // ── Image pool — mark one image as "Main Display" ─────────────────────────
  //
  // When Tomiwa clicks "Main Display" on an image, we:
  //   1. Set isMain = false on every image (clear the previous selection)
  //   2. Set isMain = true on just the clicked one
  //
  // We use onChange with an array of patch operations. Think of each operation
  // as "go to this path in the document and set this value". The path
  // ['productImages', {_key: 'abc'}, 'isMain'] means:
  //   → inside productImages → find the item whose _key is 'abc' → set isMain
  function markAsMain(clickedKey: string) {
    const patches = currentProductImages.map((img) =>
      set(img._key === clickedKey, ['productImages', { _key: img._key }, 'isMain'])
    )
    onChange(patches)
  }

  // ── Clothing sizes — chip toggles ─────────────────────────────────────────
  function toggleSize(size: string) {
    const next = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size]
    onChange(set(next, ['sizes']))
  }

  // ── Pricing ───────────────────────────────────────────────────────────────
  function handlePriceBlur() {
    const n = parseFloat(localPrice)
    if (!isNaN(n) && n > 0) onChange(set(n, ['price']))
  }

  function handleCompareAtBlur() {
    const n = parseFloat(localCompareAt)
    if (!isNaN(n) && n > 0) onChange(set(n, ['compareAtPrice']))
  }

  function handleShoeSizesBlur() {
    onChange(set(localShoeSizes || '', ['shoeSizes']))
  }

  function handleOnSaleToggle(checked: boolean) {
    setOnSale(checked)
    if (!checked) {
      setLocalCompareAt('')
      onChange(unset(['compareAtPrice']))
    }
  }

  // ── Member lookup ─────────────────────────────────────────────────────────
  function member(name: string) {
    return members.find((m) => m.kind === 'field' && m.name === name)
  }

  const productImagesMember = member('productImages')
  const variantsMember      = member('variants')

  const identityFields   = ['name', 'slug', 'category', 'description']
  const visibilityFields = ['featured', 'inStock']

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ fontFamily: 'sans-serif', color: '#1a1a1a' }}>

      {/* ── Identity fields (Name, Slug, Category, Description) ── */}
      {members
        .filter((m) => m.kind === 'field' && identityFields.includes(m.name))
        .map((m) => m.kind === 'field' && (
          <MemberField key={m.key} member={m} {...renderProps} />
        ))
      }

      {/* ── SECTION 1: IMAGES ── */}
      <div style={card}>
        <p style={heading}>Images</p>
        <p style={{ fontSize: 13, color: '#555', margin: '0 0 16px 0' }}>
          Upload all your product shots here — front, back, detail, angles. Then tick
          <strong> Main Display</strong> on the one that should appear at the top of the product
          page and on the shop grid. The rest automatically become the image gallery.
        </p>

        {/* Sanity's default array uploader — handles add / reorder / delete */}
        {productImagesMember?.kind === 'field' && (
          <MemberField member={productImagesMember} {...renderProps} />
        )}

        {/* ── Thumbnail strip with "Main Display" radio buttons ── */}
        {currentProductImages.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <span style={label}>Tap an image below to set it as Main Display</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
              {currentProductImages.map((img) => {
                const url = img.image?.asset?._ref
                  ? assetRefToUrl(img.image.asset._ref)
                  : null
                const isMain = !!img.isMain

                return (
                  <div
                    key={img._key}
                    style={{ position: 'relative', cursor: 'pointer' }}
                    onClick={() => markAsMain(img._key)}
                    title={isMain ? 'Main Display (click to keep)' : 'Click to set as Main Display'}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: 6,
                        overflow: 'hidden',
                        border: isMain ? `3px solid ${BRAND_YELLOW}` : '3px solid #e5e5e5',
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'border-color 0.15s',
                      }}
                    >
                      {url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={url}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span style={{ fontSize: 11, color: '#aaa' }}>No image</span>
                      )}
                    </div>

                    {/* Main Display badge */}
                    {isMain && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 4,
                          left: 0,
                          right: 0,
                          textAlign: 'center',
                          background: BRAND_YELLOW,
                          color: '#fff',
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: '0.05em',
                          padding: '2px 0',
                          borderRadius: '0 0 4px 4px',
                        }}
                      >
                        ★ MAIN
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <p style={{ ...hint, marginTop: 8 }}>
              The image with the gold border is your Main Display. Click any other thumbnail to switch.
            </p>
          </div>
        )}
      </div>

      {/* ── SECTION 2: COLOUR VARIANTS ── */}
      <div style={card}>
        <p style={heading}>Colour Variants</p>
        <p style={{ fontSize: 13, color: '#555', margin: '0 0 16px 0' }}>
          Optional — use this if the product comes in multiple colours. Each variant gets its own
          images and available sizes. Leave empty if it&apos;s one colour only.
        </p>
        {variantsMember?.kind === 'field' && (
          <MemberField member={variantsMember} {...renderProps} />
        )}
      </div>

      {/* ── SECTION 3: SIZES ── */}
      <div style={card}>
        <p style={heading}>Sizes</p>

        {/* Clothing sizes — chip toggles */}
        <div style={{ marginBottom: 24 }}>
          <span style={label}>Clothing Sizes</span>
          <p style={hint}>Click to toggle which sizes are available for this product.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {CLOTHING_SIZES.map((size) => {
              const active = currentSizes.includes(size)
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  style={{
                    padding: '8px 16px',
                    border: `2px solid ${active ? BRAND_YELLOW : '#d1d5db'}`,
                    borderRadius: 6,
                    background: active ? BRAND_YELLOW : '#fff',
                    color: active ? '#fff' : '#374151',
                    fontWeight: active ? 700 : 400,
                    fontSize: 13,
                    minWidth: 52,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {size}
                </button>
              )
            })}
          </div>
          {currentSizes.length > 0 && (
            <p style={{ ...hint, marginTop: 10, fontStyle: 'normal', color: '#555' }}>
              Selected: {currentSizes.join(', ')}
            </p>
          )}
        </div>

        {/* Shoe sizes — free text */}
        <div>
          <span style={label}>
            Shoe Sizes <span style={{ fontWeight: 400, color: '#888' }}>(optional)</span>
          </span>
          <p style={hint}>Enter comma-separated values, e.g. 40, 41, 42, 43</p>
          <input
            type="text"
            value={localShoeSizes}
            onChange={(e) => setLocalShoeSizes(e.target.value)}
            onBlur={handleShoeSizesBlur}
            placeholder="e.g. 40, 41, 42, 43"
            style={{ ...inputStyle, marginTop: 8 }}
          />
        </div>
      </div>

      {/* ── SECTION 4: PRICING ── */}
      <div style={card}>
        <p style={heading}>Pricing</p>

        {/* Price */}
        <div style={{ marginBottom: 20 }}>
          <span style={label}>Price</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#444' }}>₦</span>
            <input
              type="number"
              value={localPrice}
              onChange={(e) => setLocalPrice(e.target.value)}
              onBlur={handlePriceBlur}
              placeholder="0"
              min={0}
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
        </div>

        {/* On sale toggle */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            marginBottom: onSale ? 16 : 0,
          }}
        >
          <input
            type="checkbox"
            checked={onSale}
            onChange={(e) => handleOnSaleToggle(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: BRAND_YELLOW, cursor: 'pointer' }}
          />
          <span style={{ fontSize: 14, color: '#333', fontWeight: 500 }}>
            This item is on sale
          </span>
        </label>

        {/* Compare-at price — only shown when on sale */}
        {onSale && (
          <div>
            <span style={label}>Original Price (shown crossed out)</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#444' }}>₦</span>
              <input
                type="number"
                value={localCompareAt}
                onChange={(e) => setLocalCompareAt(e.target.value)}
                onBlur={handleCompareAtBlur}
                placeholder="0"
                min={0}
                style={{ ...inputStyle, flex: 1 }}
              />
            </div>
            <p style={hint}>Customers see this price crossed out next to the sale price.</p>
          </div>
        )}
      </div>

      {/* ── Visibility toggles (Featured, In Stock) ── */}
      <div style={{ ...card, background: '#fff' }}>
        <p style={heading}>Visibility</p>
        {members
          .filter((m) => m.kind === 'field' && visibilityFields.includes(m.name))
          .map((m) => m.kind === 'field' && (
            <MemberField key={m.key} member={m} {...renderProps} />
          ))
        }
      </div>

    </div>
  )
}
