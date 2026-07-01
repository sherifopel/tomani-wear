'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ArrowUpDown } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured items' },
  { value: 'newest',     label: 'Newest items' },
  { value: 'price-asc',  label: 'Price: Ascending' },
  { value: 'price-desc', label: 'Price: Descending' },
]

export default function SortDropdown({
  current,
  category,
}: {
  current: string
  category?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const currentLabel = SORT_OPTIONS.find(o => o.value === current)?.label ?? 'Featured items'

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function buildHref(sort: string) {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (sort !== 'featured') params.set('sort', sort)
    const qs = params.toString()
    return qs ? `/products?${qs}` : '/products'
  }

  return (
    <div className="relative" ref={ref} data-testid="plp-sort-dropdown">
      <button
        onClick={() => setOpen(v => !v)}
        data-testid="plp-sort-trigger"
        className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors duration-200"
      >
        <ArrowUpDown size={14} strokeWidth={1.5} className="text-black" />
        {/* Mobile: just "Sort", Desktop: full label */}
        <span className="md:hidden">Sort</span>
        <span className="hidden md:inline">Sort by: <span className="font-medium">{currentLabel}</span></span>
        <ChevronDown size={14} strokeWidth={1.5} className={`hidden md:block transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 shadow-md z-50 py-1 rounded"
          data-testid="plp-sort-menu"
        >
          {SORT_OPTIONS.map(option => (
            <li key={option.value}>
              <Link
                href={buildHref(option.value)}
                onClick={() => setOpen(false)}
                data-testid={`plp-sort-option-${option.value}`}
                className={`block px-4 py-3 text-xs uppercase tracking-widest transition-colors duration-150 ${
                  current === option.value
                    ? 'font-medium text-black bg-gray-50'
                    : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
              >
                {current === option.value && <span className="mr-2">✓</span>}
                {option.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
