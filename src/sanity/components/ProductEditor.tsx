'use client'

/**
 * ProductEditor — unified product management UI for Sanity Studio.
 *
 * Tomiwa sees one clean form instead of scattered individual fields.
 * Four sections: Images · Colour Variants · Sizes · Pricing
 */

import React, { useState, useEffect } from 'react'
import { ObjectInputProps, MemberField, set, unset, useFormValue } from 'sanity'

const BRAND_YELLOW = '#c9a227'

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

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

// ─── Component ───────────────────────────────────────────────────────────────

export function ProductEditor(props: ObjectInputProps) {
  const { members, onChange, renderInput, renderField, renderItem, renderPreview } = props

  const renderProps = { renderInput, renderField, renderItem, renderPreview }

  // Read current values directly from the document (no path prefix — this
  // component is mounted at the document root, so paths are just field names)
  const currentSizes      = (useFormValue(['sizes'])         as string[] | undefined) ?? []
  const currentShoeSizes  = (useFormValue(['shoeSizes'])      as string  | undefined) ?? ''
  const currentPrice      = (useFormValue(['price'])          as number  | undefined)
  const currentCompareAt  = (useFormValue(['compareAtPrice']) as number  | undefined)

  // Local controlled state for custom inputs
  const [localShoeSizes, setLocalShoeSizes] = useState(currentShoeSizes)
  const [localPrice,     setLocalPrice]     = useState(currentPrice != null ? String(currentPrice) : '')
  const [localCompareAt, setLocalCompareAt] = useState(currentCompareAt != null ? String(currentCompareAt) : '')
  const [onSale,         setOnSale]         = useState(currentCompareAt != null)

  // Sync when the document value changes (initial load / undo)
  useEffect(() => { setLocalShoeSizes(currentShoeSizes) }, [currentShoeSizes])
  useEffect(() => { setLocalPrice(currentPrice != null ? String(currentPrice) : '') }, [currentPrice])
  useEffect(() => {
    setLocalCompareAt(currentCompareAt != null ? String(currentCompareAt) : '')
    setOnSale(currentCompareAt != null)
  }, [currentCompareAt])

  // ── Helpers ────────────────────────────────────────────────────────────────

  function toggleSize(size: string) {
    const next = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size]
    onChange(set(next, ['sizes']))
  }

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

  // ── Member lookup ──────────────────────────────────────────────────────────

  function member(name: string) {
    return members.find((m) => m.kind === 'field' && m.name === name)
  }

  const mainImageMember  = member('image')
  const galleryMember    = member('gallery')
  const variantsMember   = member('variants')

  // Identity fields rendered normally above the custom sections
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

        <div style={{ marginBottom: 24 }}>
          <span style={label}>Main Display Image</span>
          <p style={hint}>The image shown on the homepage grid and at the top of the product page.</p>
          <div style={{ marginTop: 10 }}>
            {mainImageMember?.kind === 'field' && (
              <MemberField member={mainImageMember} {...renderProps} />
            )}
          </div>
        </div>

        <div>
          <span style={label}>Additional Images</span>
          <p style={hint}>Front, back, details — shown as thumbnails on the product page. Upload as many as you like.</p>
          <div style={{ marginTop: 10 }}>
            {galleryMember?.kind === 'field' && (
              <MemberField member={galleryMember} {...renderProps} />
            )}
          </div>
        </div>
      </div>

      {/* ── SECTION 2: COLOUR VARIANTS ── */}
      <div style={card}>
        <p style={heading}>Colour Variants</p>
        <p style={{ fontSize: 13, color: '#555', margin: '0 0 16px 0' }}>
          Optional — use this if the product comes in multiple colours. Each variant gets its own
          images and available sizes. Leave empty if it's one colour only.
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
          <span style={label}>Shoe Sizes <span style={{ fontWeight: 400, color: '#888' }}>(optional)</span></span>
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
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: onSale ? 16 : 0 }}>
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

        {/* Compare-at price */}
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
