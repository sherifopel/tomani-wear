'use client'

import React, { useState, useEffect } from 'react'
import { ObjectInputProps, MemberField, set, unset, useFormValue } from 'sanity'

const BRAND_YELLOW = '#c9a227'

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const sectionStyle: React.CSSProperties = {
  background: '#f8f8f8',
  border: '1px solid #e5e5e5',
  borderRadius: 8,
  padding: '20px 24px',
  marginBottom: 20,
}

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#555',
  marginBottom: 16,
  marginTop: 0,
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: '#444',
  marginBottom: 6,
  display: 'block',
}

const tipStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#888',
  marginTop: 8,
  fontStyle: 'italic',
}

export function ProductEditor(props: ObjectInputProps) {
  const { members, onChange, renderInput, renderField, renderItem, renderPreview } = props

  // ── Read current values ──────────────────────────────────────────────────
  const clothingSizes = (useFormValue(['productSetup', 'clothingSizes']) as string[] | undefined) ?? []
  const shoeSizes = (useFormValue(['productSetup', 'shoeSizes']) as string | undefined) ?? ''
  const currentPrice = (useFormValue(['productSetup', 'price']) as number | undefined)
  const currentCompareAt = (useFormValue(['productSetup', 'compareAtPrice']) as number | undefined)
  const variants = useFormValue(['productSetup', 'variants']) as unknown[] | undefined

  // ── Local state ──────────────────────────────────────────────────────────
  const [localPrice, setLocalPrice] = useState<string>(currentPrice != null ? String(currentPrice) : '')
  const [localCompareAt, setLocalCompareAt] = useState<string>(currentCompareAt != null ? String(currentCompareAt) : '')
  const [onSale, setOnSale] = useState<boolean>(currentCompareAt != null)
  const [localShoeSizes, setLocalShoeSizes] = useState<string>(shoeSizes)

  // Sync local state when document value changes (e.g. on initial load)
  useEffect(() => {
    setLocalPrice(currentPrice != null ? String(currentPrice) : '')
  }, [currentPrice])

  useEffect(() => {
    setLocalCompareAt(currentCompareAt != null ? String(currentCompareAt) : '')
    setOnSale(currentCompareAt != null)
  }, [currentCompareAt])

  useEffect(() => {
    setLocalShoeSizes(shoeSizes)
  }, [shoeSizes])

  // ── Helpers ──────────────────────────────────────────────────────────────
  function toggleSize(size: string) {
    const next = clothingSizes.includes(size)
      ? clothingSizes.filter((s) => s !== size)
      : [...clothingSizes, size]
    onChange(set(next, ['clothingSizes']))
  }

  function handlePriceBlur() {
    const num = parseFloat(localPrice)
    if (!isNaN(num) && num > 0) {
      onChange(set(num, ['price']))
    }
  }

  function handleCompareAtBlur() {
    const num = parseFloat(localCompareAt)
    if (!isNaN(num) && num > 0) {
      onChange(set(num, ['compareAtPrice']))
    }
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

  // ── Member field lookup ──────────────────────────────────────────────────
  function getMember(name: string) {
    return members.find((m) => m.kind === 'field' && m.name === name)
  }

  const mainImageMember = getMember('mainImage')
  const galleryMember = getMember('gallery')
  const variantsMember = getMember('variants')

  const hasVariants = Array.isArray(variants) && variants.length > 0

  // ── Shared render props ───────────────────────────────────────────────────
  const renderProps = {
    renderInput,
    renderField,
    renderItem,
    renderPreview,
  }

  return (
    <div style={{ fontFamily: 'sans-serif', color: '#1a1a1a' }}>

      {/* ── SECTION 1: IMAGES ── */}
      <div style={sectionStyle}>
        <p style={sectionHeadingStyle}>Images</p>

        <div style={{ marginBottom: 20 }}>
          <span style={labelStyle}>Main Display Image</span>
          {mainImageMember && mainImageMember.kind === 'field' && (
            <MemberField member={mainImageMember} {...renderProps} />
          )}
        </div>

        <div>
          <span style={labelStyle}>Additional Images (angles, back, details)</span>
          {galleryMember && galleryMember.kind === 'field' && (
            <MemberField member={galleryMember} {...renderProps} />
          )}
          <p style={tipStyle}>Tip: upload front view, back view, and detail shots.</p>
        </div>
      </div>

      {/* ── SECTION 2: COLOUR VARIANTS ── */}
      {variantsMember && (
        <div style={sectionStyle}>
          <p style={sectionHeadingStyle}>Colour Variants</p>
          <p style={{ ...tipStyle, marginBottom: 12, fontStyle: 'normal', color: '#555' }}>
            Optional — add a variant per colourway, each with its own images and available sizes. Leave empty if the product only comes in one colour.
          </p>
          {variantsMember.kind === 'field' && (
            <MemberField member={variantsMember} {...renderProps} />
          )}
        </div>
      )}

      {/* ── SECTION 3: SIZES ── */}
      <div style={sectionStyle}>
        <p style={sectionHeadingStyle}>Sizes</p>

        {/* Clothing sizes — chip toggles */}
        <div style={{ marginBottom: 20 }}>
          <span style={labelStyle}>Clothing Sizes</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CLOTHING_SIZES.map((size) => {
              const active = clothingSizes.includes(size)
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  style={{
                    padding: '8px 16px',
                    border: `2px solid ${active ? BRAND_YELLOW : '#ccc'}`,
                    borderRadius: 6,
                    background: active ? BRAND_YELLOW : '#fff',
                    color: active ? '#fff' : '#333',
                    fontWeight: active ? 700 : 400,
                    cursor: 'pointer',
                    fontSize: 13,
                    minWidth: 52,
                    transition: 'all 0.15s',
                  }}
                >
                  {size}
                </button>
              )
            })}
          </div>
          {clothingSizes.length > 0 && (
            <p style={{ ...tipStyle, marginTop: 8 }}>
              Selected: {clothingSizes.join(', ')}
            </p>
          )}
        </div>

        {/* Shoe sizes — text input */}
        <div>
          <span style={labelStyle}>
            Shoe Sizes (optional)
          </span>
          <p style={{ ...tipStyle, marginBottom: 8, fontStyle: 'normal' }}>
            Enter as comma-separated values, e.g. 40, 41, 42, 43
          </p>
          <input
            type="text"
            value={localShoeSizes}
            onChange={(e) => setLocalShoeSizes(e.target.value)}
            onBlur={handleShoeSizesBlur}
            placeholder="e.g. 40, 41, 42, 43"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ccc',
              borderRadius: 6,
              fontSize: 14,
              color: '#1a1a1a',
              background: '#fff',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* ── SECTION 4: PRICING ── */}
      <div style={sectionStyle}>
        <p style={sectionHeadingStyle}>Pricing</p>

        {/* Current price */}
        <div style={{ marginBottom: 16 }}>
          <span style={labelStyle}>Price</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#444' }}>₦</span>
            <input
              type="number"
              value={localPrice}
              onChange={(e) => setLocalPrice(e.target.value)}
              onBlur={handlePriceBlur}
              placeholder="0"
              min={0}
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px solid #ccc',
                borderRadius: 6,
                fontSize: 14,
                color: '#1a1a1a',
                background: '#fff',
              }}
            />
          </div>
        </div>

        {/* On sale toggle */}
        <div style={{ marginBottom: onSale ? 16 : 0 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
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
        </div>

        {/* Compare-at price (only when on sale) */}
        {onSale && (
          <div>
            <span style={labelStyle}>Compare-at Price (original price before sale)</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#444' }}>₦</span>
              <input
                type="number"
                value={localCompareAt}
                onChange={(e) => setLocalCompareAt(e.target.value)}
                onBlur={handleCompareAtBlur}
                placeholder="0"
                min={0}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: '1px solid #ccc',
                  borderRadius: 6,
                  fontSize: 14,
                  color: '#1a1a1a',
                  background: '#fff',
                }}
              />
            </div>
            <p style={tipStyle}>
              This is the original price customers see crossed out on the product page.
            </p>
          </div>
        )}
      </div>

    </div>
  )
}
