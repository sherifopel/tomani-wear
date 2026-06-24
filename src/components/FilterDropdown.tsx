'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

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
  const ref = useRef<HTMLDivElement>(null)

  const currentLabel = CATEGORIES.find(c => c.value === current)?.label

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function buildHref(category?: string) {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (sort && sort !== 'featured') params.set('sort', sort)
    const qs = params.toString()
    return qs ? `/products?${qs}` : '/products'
  }

  return (
    <div className="relative" ref={ref} data-testid="plp-filter-dropdown">
      <button
        onClick={() => setOpen(v => !v)}
        data-testid="plp-filter-trigger"
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-xs uppercase tracking-widest hover:border-black transition-colors duration-200 bg-white rounded"
      >
        <span>
          Filter{currentLabel && <span className="font-medium">: {currentLabel}</span>}
        </span>
        <ChevronDown size={14} strokeWidth={1.5} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          className="absolute left-0 top-full mt-1 w-44 bg-white border border-gray-200 shadow-md z-50 py-1 rounded"
          data-testid="plp-filter-menu"
        >
          <li>
            <Link
              href={buildHref()}
              onClick={() => setOpen(false)}
              data-testid="plp-filter-option-all"
              className={`block px-4 py-3 text-xs uppercase tracking-widest transition-colors duration-150 ${
                !current ? 'font-medium text-black bg-gray-50' : 'text-gray-600 hover:text-black hover:bg-gray-50'
              }`}
            >
              {!current && <span className="mr-2">✓</span>}All
            </Link>
          </li>
          {CATEGORIES.map(cat => (
            <li key={cat.value}>
              <Link
                href={buildHref(cat.value)}
                onClick={() => setOpen(false)}
                data-testid={`plp-filter-option-${cat.value}`}
                className={`block px-4 py-3 text-xs uppercase tracking-widest transition-colors duration-150 ${
                  current === cat.value ? 'font-medium text-black bg-gray-50' : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
              >
                {current === cat.value && <span className="mr-2">✓</span>}
                {cat.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
