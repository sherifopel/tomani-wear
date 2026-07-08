'use client'

import { FormEvent, useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

export default function SearchControl() {
  const [expanded, setExpanded]     = useState(false)
  const [query, setQuery]           = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const inputRef                    = useRef<HTMLInputElement>(null)
  const mobileInputRef              = useRef<HTMLInputElement>(null)
  const router                      = useRouter()

  const expand = useCallback(() => {
    setExpanded(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const collapse = useCallback(() => {
    if (!query.trim()) setExpanded(false)
  }, [query])

  function onDesktopSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    setQuery('')
    setExpanded(false)
    router.push(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : '/products')
  }

  function openMobile() {
    setMobileOpen(true)
    setTimeout(() => mobileInputRef.current?.focus(), 50)
  }

  function closeMobile() {
    setMobileOpen(false)
    setQuery('')
  }

  function onMobileSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    closeMobile()
    router.push(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : '/products')
  }

  return (
    <>
      {/* ── Desktop: oval floats over layout — logo never moves ──────────────────
          The wrapper div is only as wide as the icon button (so the nav grid
          column stays the same size). The expanded form is `absolute`, floating
          OVER the logo/center area. Moving the mouse from icon → form stays
          inside the wrapper's subtree, so onMouseLeave never fires mid-hover.
      ── */}
      <div
        className="hidden md:block relative"
        onMouseEnter={expand}
        onMouseLeave={collapse}
        data-testid="search-desktop-wrapper"
      >
        {/* Icon — always visible, always anchored to this spot */}
        <button
          type="button"
          aria-label="Search"
          data-testid="nav-search-button"
          onClick={expand}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
        >
          <Search className="h-5 w-5" strokeWidth={1.5} />
        </button>

        {/* Oval — absolute, floats left from the icon, sits above the logo */}
        {expanded && (
          <form
            role="search"
            onSubmit={onDesktopSubmit}
            data-testid="search-form-desktop"
            className="
              absolute right-0 top-1/2 -translate-y-1/2 z-[150]
              flex items-center gap-2
              pl-5 pr-2 py-2
              bg-white rounded-full border border-gray-300 shadow-md
            "
            style={{
              width: '320px',
              animation: 'searchExpand 0.2s ease-out',
            }}
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              name="q"
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              placeholder="Search the store…"
              className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
              data-testid="search-input"
            />

            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); inputRef.current?.focus() }}
                aria-label="Clear search"
                className="text-gray-400 hover:text-black transition-colors shrink-0"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            )}

            {/* Submit — sits at the right end of the oval, mirrors NP */}
            <button
              type="submit"
              aria-label="Search"
              className="shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Search className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </form>
        )}
      </div>

      {/* ── Mobile: icon → full overlay ─────────────────────────────────────── */}
      <button
        type="button"
        onClick={openMobile}
        data-testid="nav-search-button-mobile"
        aria-label="Search"
        className="md:hidden p-1.5 rounded hover:bg-gray-100 transition-colors duration-200"
      >
        <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </button>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-[300] bg-black/40 md:hidden"
            onClick={closeMobile}
            data-testid="search-backdrop"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            data-testid="search-dialog"
            className="fixed inset-x-0 top-0 z-[301] bg-white border-b border-gray-200 px-4 py-4"
            style={{ animation: 'searchSlideDown 0.15s ease-out' }}
          >
            <form
              role="search"
              onSubmit={onMobileSubmit}
              className="flex items-center gap-3"
              data-testid="search-form"
            >
              <Search className="h-5 w-5 shrink-0 text-gray-400" strokeWidth={1.5} />
              <input
                ref={mobileInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                name="q"
                type="search"
                enterKeyHint="search"
                autoComplete="off"
                placeholder="Search products…"
                className="min-w-0 flex-1 border-0 bg-transparent py-3 text-base outline-none placeholder:text-gray-400"
                data-testid="search-input-mobile"
              />
              <button
                type="button"
                onClick={closeMobile}
                aria-label="Close search"
                className="rounded p-2 hover:bg-gray-100 transition-colors"
                data-testid="search-close"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </form>
          </div>
        </>
      )}
    </>
  )
}
