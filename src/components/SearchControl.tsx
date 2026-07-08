'use client'

import { FormEvent, useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

export default function SearchControl() {
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery]       = useState('')
  const inputRef                = useRef<HTMLInputElement>(null)
  const router                  = useRouter()

  const expand = useCallback(() => {
    setExpanded(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const collapse = useCallback(() => {
    if (!query.trim()) setExpanded(false)
  }, [query])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    setQuery('')
    setExpanded(false)
    router.push(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : '/products')
  }

  return (
    <div
      className="relative"
      onMouseEnter={expand}
      onMouseLeave={collapse}
      data-testid="search-desktop-wrapper"
    >
      {/* Icon — always visible */}
      <button
        type="button"
        aria-label="Search"
        data-testid="nav-search-button"
        onClick={expand}
        className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
      >
        <Search className="h-[15px] w-[15px] md:h-5 md:w-5" strokeWidth={1.5} />
      </button>

      {/* Oval — floats over the logo on all screen sizes */}
      {expanded && (
        <form
          role="search"
          onSubmit={onSubmit}
          data-testid="search-form-desktop"
          className="
            absolute right-0 top-1/2 -translate-y-1/2 z-[150]
            flex items-center gap-2
            pl-5 pr-2 py-2
            bg-white rounded-full border border-gray-300 shadow-md
          "
          style={{
            width: 'min(320px, calc(100vw - 160px))',
            animation: 'searchExpand 0.2s ease-out',
          }}
        >
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            name="q"
            type="text"
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
  )
}
