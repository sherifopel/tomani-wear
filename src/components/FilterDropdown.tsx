'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react'

const CATEGORIES = [
  { value: 'new',         label: 'New In' },
  { value: 'men',         label: 'Men' },
  { value: 'women',       label: 'Women' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'collections', label: 'Collections' },
  { value: 'sale',        label: 'Sale' },
]

export default function FilterDropdown({
  current,
  sort,
}: {
  current?: string
  sort?: string
}) {
  const [open, setOpen] = useState(false)
  const desktopRef = useRef<HTMLDivElement>(null)

  const currentLabel = CATEGORIES.find(c => c.value === current)?.label

  // Close desktop dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (desktopRef.current && !desktopRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // Lock body scroll on mobile drawer open
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function buildHref(category?: string) {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (sort && sort !== 'featured') params.set('sort', sort)
    const qs = params.toString()
    return qs ? `/products?${qs}` : '/products'
  }

  const options = (
    <>
      <li>
        <Link
          href={buildHref()}
          onClick={() => setOpen(false)}
          data-testid="plp-filter-option-all"
          className={`flex items-center justify-between px-4 py-3 text-xs uppercase tracking-widest transition-colors duration-150 ${
            !current ? 'font-medium text-black bg-gray-50' : 'text-gray-600 hover:text-black hover:bg-gray-50'
          }`}
        >
          All {!current && <span>✓</span>}
        </Link>
      </li>
      {CATEGORIES.map(cat => (
        <li key={cat.value}>
          <Link
            href={buildHref(cat.value)}
            onClick={() => setOpen(false)}
            data-testid={`plp-filter-option-${cat.value}`}
            className={`flex items-center justify-between px-4 py-3 text-xs uppercase tracking-widest transition-colors duration-150 ${
              current === cat.value ? 'font-medium text-black bg-gray-50' : 'text-gray-600 hover:text-black hover:bg-gray-50'
            }`}
          >
            {cat.label} {current === cat.value && <span>✓</span>}
          </Link>
        </li>
      ))}
    </>
  )

  return (
    <>
      {/* Trigger button — same on mobile and desktop */}
      <div className="relative" ref={desktopRef} data-testid="plp-filter-dropdown">
        <button
          onClick={() => setOpen(v => !v)}
          data-testid="plp-filter-trigger"
          className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors duration-200"
        >
          <SlidersHorizontal size={14} strokeWidth={1.5} className="text-black" />
          <span>Filter{currentLabel && <span className="font-medium">: {currentLabel}</span>}</span>
          <ChevronDown size={14} strokeWidth={1.5} className={`hidden md:block transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>

        {/* Desktop dropdown */}
        {open && (
          <ul
            className="hidden md:block absolute left-0 top-full mt-1 w-44 bg-white border border-gray-200 shadow-md z-50 py-1 rounded"
            data-testid="plp-filter-menu"
          >
            {options}
          </ul>
        )}
      </div>

      {/* Mobile drawer */}
      <>
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          className={`md:hidden fixed inset-0 z-[200] bg-black transition-opacity duration-300 ${
            open ? 'opacity-40 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Drawer */}
        <div
          role="dialog"
          aria-label="Filter products"
          aria-modal="true"
          className={`md:hidden fixed top-0 left-0 z-[201] h-full w-72 bg-white flex flex-col transition-transform duration-300 ease-in-out ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
          data-testid="plp-filter-drawer"
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <p className="text-xs uppercase tracking-widest font-medium">Filter</p>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close filter"
              className="p-1 rounded hover:bg-gray-100 transition-colors duration-200"
              data-testid="plp-filter-close"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Category options */}
          <div className="px-2 py-4">
            <p className="px-4 pb-2 text-[10px] uppercase tracking-widest text-gray-400">Category</p>
            <ul>{options}</ul>
          </div>
        </div>
      </>
    </>
  )
}
