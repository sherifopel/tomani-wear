'use client'
import React, { useState, useEffect } from 'react'
import { ObjectInputProps, MemberField, set, unset, useFormValue, useClient, DEFAULT_STUDIO_CLIENT_OPTIONS } from 'sanity'

/**
 * ProductEditor — unified product management UI for Sanity Studio.
 *
 * One image pool: upload as many shots as you like, tick one as "Main Display".
 * Everything else flows from there — gallery, sizes, pricing.
 */


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
  cloudinaryUrl?: string
  image?: { asset?: SanityImageAsset; hotspot?: unknown }
  isMain?: boolean
}
type ColorItem = { _key: string; colorName?: string; colorHex?: string }

// Navigation-derived types for the dynamic category picker
type NavLink = { label: string; href: string; children?: NavLink[] }
type NavCategory = {
  label: string
  navSlug: string      // slug used in the URL (?category=new)
  storedSlug: string   // slug stored in Sanity (new-in, not new)
  types: { label: string; slug: string }[]
}
type CategoryType = { _key: string; category: string; type: string }

// ─── Component ───────────────────────────────────────────────────────────────

export function ProductEditor(props: ObjectInputProps) {
  const { members, onChange, renderInput, renderField, renderItem, renderPreview } = props
  const renderProps = { renderInput, renderField, renderItem, renderPreview }


  const client = useClient(DEFAULT_STUDIO_CLIENT_OPTIONS)

  // Read live document values (paths are at document root — this component
  // is mounted at the document level via components: { input: ProductEditor })
  const currentProductImages   = (useFormValue(['productImages'])   as ProductImage[]  | undefined) ?? []
  const currentColors          = (useFormValue(['colors'])          as ColorItem[]     | undefined) ?? []
  const currentSizes           = (useFormValue(['sizes'])           as string[]        | undefined) ?? []
  const currentShoeSizes       = (useFormValue(['shoeSizes'])       as string          | undefined) ?? ''
  const currentPrice           = (useFormValue(['price'])           as number          | undefined)
  const currentCompareAt       = (useFormValue(['compareAtPrice'])  as number          | undefined)
  // Category-related values — managed by the dynamic category section below
  const currentCategories      = (useFormValue(['categories'])      as string[]        | undefined) ?? []
  const currentCategoryTypes   = (useFormValue(['categoryTypes'])   as CategoryType[]  | undefined) ?? []
  const currentMenType         = (useFormValue(['menType'])         as string          | undefined) ?? ''
  const currentWomenType       = (useFormValue(['womenType'])       as string          | undefined) ?? ''
  const currentAccessoriesType = (useFormValue(['accessoriesType']) as string          | undefined) ?? ''

  // Local controlled state for text/number inputs (so the field doesn't lose
  // focus on every keystroke — we only write to Sanity on blur)
  const [localShoeSizes, setLocalShoeSizes]   = useState(currentShoeSizes)
  const [localPrice,     setLocalPrice]       = useState(currentPrice != null ? String(currentPrice) : '')
  const [localCompareAt, setLocalCompareAt]   = useState(currentCompareAt != null ? String(currentCompareAt) : '')
  const [onSale,         setOnSale]           = useState(currentCompareAt != null)
  const [newColorName,   setNewColorName]     = useState('')
  const [newColorHex,    setNewColorHex]      = useState(BRAND_YELLOW)
  const [uploadProgress, setUploadProgress]  = useState<{ done: number; total: number } | null>(null)
  const [isDragging,     setIsDragging]      = useState(false)
  const [navCategories,  setNavCategories]   = useState<NavCategory[]>([])

  // Sync local state when the document updates from outside (undo, initial load)
  useEffect(() => { setLocalShoeSizes(currentShoeSizes) }, [currentShoeSizes])
  useEffect(() => { setLocalPrice(currentPrice != null ? String(currentPrice) : '') }, [currentPrice])
  useEffect(() => {
    setLocalCompareAt(currentCompareAt != null ? String(currentCompareAt) : '')
    setOnSale(currentCompareAt != null)
  }, [currentCompareAt])

  // Fetch nav categories from Sanity once on mount.
  // When Tomiwa publishes a new Navigation with a "Kids" category, the next time
  // someone opens a product form it will appear here automatically — no code deploy.
  useEffect(() => {
    client
      .fetch<{ links?: NavLink[] }>(
        `*[_id == "navigation-singleton"][0]{ links[]{ label, href, children[]{ label, href } } }`
      )
      .then((nav) => {
        const links = nav?.links ?? []
        const cats: NavCategory[] = links
          .filter((link) => {
            try {
              const slug = new URL(link.href, 'http://x').searchParams.get('category')
              return slug && slug !== 'sale' // sale is computed (compareAt > price), not stored
            } catch {
              return false
            }
          })
          .map((link) => {
            const navSlug    = new URL(link.href, 'http://x').searchParams.get('category')!
            const storedSlug = navSlug === 'new' ? 'new-in' : navSlug
            const types = (link.children ?? [])
              .map((child) => {
                try {
                  const typeSlug = new URL(child.href, 'http://x').searchParams.get('type')
                  return typeSlug ? { label: child.label, slug: typeSlug } : null
                } catch {
                  return null
                }
              })
              .filter((t): t is { label: string; slug: string } => t !== null)
            return { label: link.label, navSlug, storedSlug, types }
          })
        setNavCategories(cats)
      })
      .catch(() => {}) // silently fail — category section shows "Loading…" if nav is missing
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Legacy type lookup for backward compat with existing products ──────────
  // Old products store their type in menType/womenType/accessoriesType.
  // New products use categoryTypes. We read both so the UI looks correct
  // regardless of when the product was created.
  const legacyTypeByStoredSlug: Record<string, string> = {
    men:         currentMenType,
    women:       currentWomenType,
    accessories: currentAccessoriesType,
  }

  // ── Category toggle ───────────────────────────────────────────────────────
  function toggleCategory(storedSlug: string) {
    const isSelected = currentCategories.includes(storedSlug)
    const nextCategories = isSelected
      ? currentCategories.filter((c) => c !== storedSlug)
      : [...currentCategories, storedSlug]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patches: any[] = [set(nextCategories, ['categories'])]

    if (isSelected) {
      // Remove this category's type from the new-style array
      patches.push(set(currentCategoryTypes.filter((t) => t.category !== storedSlug), ['categoryTypes']))
      // Clear legacy fields too so old GROQ filters don't pick up stale data
      if (storedSlug === 'men')         patches.push(unset(['menType']))
      if (storedSlug === 'women')       patches.push(unset(['womenType']))
      if (storedSlug === 'accessories') patches.push(unset(['accessoriesType']))
    }

    onChange(patches)
  }

  // ── Set product type within a category ───────────────────────────────────
  function setTypeForCategory(storedSlug: string, typeSlug: string) {
    // Update (or insert) the entry in the new categoryTypes array
    const existing = currentCategoryTypes.find((t) => t.category === storedSlug)
    const nextTypes: CategoryType[] = existing
      ? currentCategoryTypes.map((t) => t.category === storedSlug ? { ...t, type: typeSlug } : t)
      : [...currentCategoryTypes, { _key: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`, category: storedSlug, type: typeSlug }]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patches: any[] = [set(nextTypes, ['categoryTypes'])]

    // Dual-write to legacy fields so existing GROQ carousel filters still work
    if (storedSlug === 'men')         patches.push(set(typeSlug, ['menType']))
    if (storedSlug === 'women')       patches.push(set(typeSlug, ['womenType']))
    if (storedSlug === 'accessories') patches.push(set(typeSlug, ['accessoriesType']))

    onChange(patches)
  }

  // ── Multi-image upload ────────────────────────────────────────────────────
  async function uploadImages(files: File[]) {
    if (!files.length) return
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!imageFiles.length) return
    setUploadProgress({ done: 0, total: imageFiles.length })

    // Hardcoded because Sanity Studio's Vite bundler doesn't inject NEXT_PUBLIC_*
    // env vars — these are intentionally public (unsigned upload, no secret exposed).
    const cloudName    = 'o9wmvrnu'
    const uploadPreset = 'tomanni-products'

    let done = 0
    const assets = await Promise.all(
      imageFiles.map(async (file) => {
        const body = new FormData()
        body.append('file', file)
        body.append('upload_preset', uploadPreset)
        const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body })
        const data = await res.json() as { secure_url?: string; error?: { message: string } }
        if (data.error) throw new Error(`Cloudinary error: ${data.error.message}`)
        done++
        setUploadProgress({ done, total: imageFiles.length })
        return data as { secure_url: string }
      })
    )

    const isFirstUpload = currentProductImages.length === 0
    const newImages: ProductImage[] = assets.map((asset, i) => ({
      _key:         `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}${i}`,
      cloudinaryUrl: asset.secure_url.replace('/upload/', '/upload/w_1400,f_auto,q_85/'),
      isMain:       isFirstUpload && i === 0,
    }))

    onChange(set([...currentProductImages, ...newImages], ['productImages']))
    setUploadProgress(null)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) uploadImages(Array.from(e.target.files))
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) uploadImages(Array.from(e.dataTransfer.files))
  }

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

  // ── Delete an image from the pool ────────────────────────────────────────
  function deleteImage(key: string) {
    const next = currentProductImages.filter((img) => img._key !== key)
    // If we just deleted the main image, auto-promote the first remaining one
    const hadMain = currentProductImages.find((img) => img._key === key)?.isMain
    if (hadMain && next.length > 0) next[0] = { ...next[0], isMain: true }
    onChange(set(next, ['productImages']))
  }

  // ── Reorder images left / right ───────────────────────────────────────────
  function moveImage(key: string, dir: 'left' | 'right') {
    const idx = currentProductImages.findIndex((img) => img._key === key)
    if (idx === -1) return
    if (dir === 'left'  && idx === 0) return
    if (dir === 'right' && idx === currentProductImages.length - 1) return
    const next = [...currentProductImages]
    const [item] = next.splice(idx, 1)
    next.splice(dir === 'left' ? idx - 1 : idx + 1, 0, item)
    onChange(set(next, ['productImages']))
  }

  // ── Colours ───────────────────────────────────────────────────────────────
  function addColor() {
    if (!newColorName.trim()) return
    const key = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
    onChange(set([...currentColors, { _key: key, colorName: newColorName.trim(), colorHex: newColorHex }], ['colors']))
    setNewColorName('')
    setNewColorHex(BRAND_YELLOW)
  }

  function removeColor(key: string) {
    onChange(set(currentColors.filter((c) => c._key !== key), ['colors']))
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


  // categories / menType / womenType / accessoriesType are intentionally excluded
  // from MemberField rendering — they are managed by the custom CATEGORY section below.
  const identityFields   = ['name', 'slug', 'tags', 'description']
  const visibilityFields = ['inStock']

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ fontFamily: 'sans-serif', color: '#1a1a1a' }}>

      {/* ── Identity fields (Name, Slug, Categories, Type, Tags, Description) ── */}
      {members
        .filter((m) => m.kind === 'field' && identityFields.includes(m.name))
        .map((m) => m.kind === 'field' && (
          <div key={m.key} style={{ marginBottom: 20 }}>
            <MemberField member={m} {...renderProps} />
          </div>
        ))
      }

      {/* ── SECTION 1: CATEGORY ── */}
      {/* Categories and sub-types come from the live Navigation document.
          When Tomiwa adds "Kids" to Navigation and publishes, it appears here
          automatically — no code deploy needed. */}
      <div style={card}>
        <p style={heading}>Category</p>

        {navCategories.length === 0 ? (
          <p style={hint}>Loading categories from Navigation…</p>
        ) : (
          <>
            <span style={label}>Which section does this product belong to?</span>
            <p style={{ ...hint, marginBottom: 12 }}>
              A unisex item can belong to both Men and Women.
            </p>

            {/* Category chips — one per top-level nav link (excluding Sale) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {navCategories.map((cat) => {
                const selected = currentCategories.includes(cat.storedSlug)
                return (
                  <button
                    key={cat.navSlug}
                    type="button"
                    onClick={() => toggleCategory(cat.storedSlug)}
                    style={{
                      padding: '7px 18px',
                      borderRadius: 20,
                      border: `2px solid ${selected ? BRAND_YELLOW : '#d1d5db'}`,
                      background: selected ? '#fffbf0' : '#fff',
                      color: selected ? '#8a6e00' : '#374151',
                      fontWeight: selected ? 700 : 400,
                      fontSize: 13,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {cat.label}
                  </button>
                )
              })}
            </div>

            {/* Sub-type picker — appears for each selected category that has types */}
            {navCategories
              .filter((cat) => currentCategories.includes(cat.storedSlug) && cat.types.length > 0)
              .map((cat) => {
                // Prefer the new categoryTypes entry; fall back to the legacy field for old products
                const selectedType =
                  currentCategoryTypes.find((t) => t.category === cat.storedSlug)?.type
                  ?? legacyTypeByStoredSlug[cat.storedSlug]
                  ?? ''
                return (
                  <div key={cat.storedSlug} style={{ marginBottom: 16 }}>
                    <span style={label}>{cat.label} — Sub-category</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                      {cat.types.map((type) => {
                        const active = selectedType === type.slug
                        return (
                          <button
                            key={type.slug}
                            type="button"
                            onClick={() => setTypeForCategory(cat.storedSlug, type.slug)}
                            style={{
                              padding: '6px 14px',
                              borderRadius: 16,
                              border: `2px solid ${active ? BRAND_YELLOW : '#d1d5db'}`,
                              background: active ? BRAND_YELLOW : '#fff',
                              color: active ? '#fff' : '#374151',
                              fontWeight: active ? 700 : 400,
                              fontSize: 12,
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}
                          >
                            {type.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
          </>
        )}
      </div>

      {/* ── SECTION 2: IMAGES ── */}
      <div style={card}>
        <p style={heading}>Images</p>

        {/* ── Multi-upload drop zone ── */}
        <label
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '28px 20px',
            border: `2px dashed ${isDragging ? BRAND_YELLOW : '#ccc'}`,
            borderRadius: 8,
            background: isDragging ? '#fffbf0' : '#fafafa',
            cursor: uploadProgress ? 'default' : 'pointer',
            transition: 'all 0.15s',
            marginBottom: 16,
          }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileInput}
            disabled={!!uploadProgress}
          />

          {uploadProgress ? (
            <>
              <div style={{ fontSize: 22 }}>⏳</div>
              <p style={{ fontSize: 13, color: '#555', margin: 0, textAlign: 'center' }}>
                Uploading {uploadProgress.done} / {uploadProgress.total}…
              </p>
              <div style={{ width: '100%', maxWidth: 200, height: 4, background: '#e5e5e5', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(uploadProgress.done / uploadProgress.total) * 100}%`,
                  background: BRAND_YELLOW,
                  transition: 'width 0.2s',
                }} />
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 28 }}>📸</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#333', margin: 0, textAlign: 'center' }}>
                Drop images here or click to select
              </p>
              <p style={{ fontSize: 12, color: '#888', margin: 0, textAlign: 'center' }}>
                Select multiple files at once — front, back, detail shots all in one go
              </p>
            </>
          )}
        </label>

        {/* ── Thumbnail grid — click to set main, ← → to reorder, × to delete ── */}
        {currentProductImages.length > 0 && (
          <div>
            <span style={label}>
              Click image to set as Main Display &nbsp;·&nbsp; ← → to reorder &nbsp;·&nbsp; × to delete
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
              {currentProductImages.map((img, idx) => {
                const url    = img.cloudinaryUrl
                  ?? (img.image?.asset?._ref ? assetRefToUrl(img.image.asset._ref) : null)
                const isMain = !!img.isMain
                const isFirst = idx === 0
                const isLast  = idx === currentProductImages.length - 1

                return (
                  <div key={img._key} style={{ position: 'relative', userSelect: 'none' }}>

                    {/* Image box — click to mark as main */}
                    <div
                      onClick={() => markAsMain(img._key)}
                      title={isMain ? 'Main Display' : 'Click to set as Main Display'}
                      style={{
                        width: 96,
                        height: 96,
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: isMain ? `3px solid ${BRAND_YELLOW}` : '3px solid #e5e5e5',
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'border-color 0.15s',
                        position: 'relative',
                      }}
                    >
                      {url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: 11, color: '#aaa' }}>No preview</span>
                      )}

                      {/* ★ MAIN badge */}
                      {isMain && (
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          textAlign: 'center', background: BRAND_YELLOW, color: '#fff',
                          fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                          padding: '3px 0',
                        }}>
                          ★ MAIN
                        </div>
                      )}
                    </div>

                    {/* × delete button — top-right corner */}
                    <button
                      type="button"
                      onClick={() => deleteImage(img._key)}
                      title="Remove image"
                      style={{
                        position: 'absolute', top: -7, right: -7,
                        width: 20, height: 20,
                        borderRadius: '50%',
                        background: '#333', color: '#fff',
                        border: '2px solid #fff',
                        fontSize: 12, lineHeight: 1,
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700,
                        padding: 0,
                      }}
                    >×</button>

                    {/* ← → reorder buttons — below the image */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 4 }}>
                      <button
                        type="button"
                        onClick={() => moveImage(img._key, 'left')}
                        disabled={isFirst}
                        title="Move left"
                        style={{
                          width: 24, height: 18,
                          border: '1px solid #d1d5db',
                          borderRadius: 4,
                          background: isFirst ? '#f3f4f6' : '#fff',
                          color: isFirst ? '#d1d5db' : '#374151',
                          fontSize: 10, cursor: isFirst ? 'default' : 'pointer',
                          padding: 0,
                        }}
                      >←</button>
                      <button
                        type="button"
                        onClick={() => moveImage(img._key, 'right')}
                        disabled={isLast}
                        title="Move right"
                        style={{
                          width: 24, height: 18,
                          border: '1px solid #d1d5db',
                          borderRadius: 4,
                          background: isLast ? '#f3f4f6' : '#fff',
                          color: isLast ? '#d1d5db' : '#374151',
                          fontSize: 10, cursor: isLast ? 'default' : 'pointer',
                          padding: 0,
                        }}
                      >→</button>
                    </div>
                  </div>
                )
              })}
            </div>
            <p style={{ ...hint, marginTop: 10 }}>
              Gold border = Main Display image shown on the product page and shop grid.
            </p>
          </div>
        )}
      </div>

      {/* ── SECTION 2: AVAILABLE COLOURS ── */}
      <div style={card}>
        <p style={heading}>Available Colours</p>
        <p style={{ fontSize: 13, color: '#555', margin: '0 0 16px 0' }}>
          Optional — add each colour this product comes in. Leave empty for single-colour items.
        </p>

        {/* Existing colour pills */}
        {currentColors.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {currentColors.map((color) => (
              <div
                key={color._key}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: '#fff', border: '1px solid #e5e5e5',
                  borderRadius: 20, padding: '6px 10px 6px 8px',
                }}
              >
                <div style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: color.colorHex ?? '#ccc',
                  border: '1px solid rgba(0,0,0,0.15)', flexShrink: 0,
                }} />
                <span style={{ fontSize: 13, color: '#333' }}>{color.colorName}</span>
                <button
                  type="button"
                  onClick={() => removeColor(color._key)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 0 2px', fontSize: 15, color: '#aaa', lineHeight: 1 }}
                  title="Remove colour"
                >×</button>
              </div>
            ))}
          </div>
        )}

        {/* Add new colour row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="color"
            value={newColorHex}
            onChange={(e) => setNewColorHex(e.target.value)}
            title="Pick a colour"
            style={{ width: 38, height: 38, padding: 2, border: '1px solid #ccc', borderRadius: 6, cursor: 'pointer', background: 'none', flexShrink: 0 }}
          />
          <input
            type="text"
            value={newColorName}
            onChange={(e) => setNewColorName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addColor()}
            placeholder="Colour name (e.g. Burgundy)"
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            type="button"
            onClick={addColor}
            disabled={!newColorName.trim()}
            style={{
              padding: '10px 16px',
              background: newColorName.trim() ? BRAND_YELLOW : '#e5e5e5',
              color: newColorName.trim() ? '#fff' : '#aaa',
              border: 'none', borderRadius: 6,
              fontSize: 13, fontWeight: 600,
              cursor: newColorName.trim() ? 'pointer' : 'default',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >Add</button>
        </div>
        <p style={hint}>Tap the colour square to open the picker. Press Enter or click Add.</p>
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

      {/* ── Visibility toggles (In Stock) ── */}
      <div style={{ ...card, background: '#fff' }}>
        <p style={heading}>Visibility</p>
        {members
          .filter((m) => m.kind === 'field' && visibilityFields.includes(m.name))
          .map((m) => m.kind === 'field' && (
            <div key={m.key} style={{ marginBottom: 12 }}>
              <MemberField member={m} {...renderProps} />
            </div>
          ))
        }
      </div>

    </div>
  )
}
