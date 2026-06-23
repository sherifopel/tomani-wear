'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronRight } from 'lucide-react'

const navLinks = [
  { label: 'New In',       href: '/new',          accent: false },
  { label: 'Men',          href: '/men',          accent: false },
  { label: 'Women',        href: '/women',        accent: false },
  { label: 'Accessories',  href: '/accessories',  accent: false },
  { label: 'Collections',  href: '/collections',  accent: false },
  { label: 'Sale',         href: '/sale',         accent: true  },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [panelTop, setPanelTop] = useState(0)

  useEffect(() => {
    // Tell StickyHeader whether the menu is open so it can keep the banner visible
    document.dispatchEvent(new CustomEvent('mobilemenu', { detail: { open } }))

    if (!open) return

    const measure = () => {
      const header = document.querySelector('[data-testid="nav-header"]')
      setPanelTop(header?.getBoundingClientRect().bottom ?? 0)
    }

    // Measure immediately so the panel starts in the right place when the
    // banner is already visible (page at top, not compact).
    measure()

    // Re-measure after the banner's 300ms expand animation for the case where
    // the header was compact (banner collapsed) and is now expanding.
    const timer = setTimeout(measure, 320)
    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', measure)
    }
  }, [open])

  return (
    <>
      {/* Hamburger — sits inside the Navbar header */}
      <button
        data-testid={open ? 'mobile-menu-close-button' : 'mobile-menu-open-button'}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((current) => !current)}
        className="md:hidden p-1.5 rounded hover:bg-gray-100 transition-colors duration-200"
      >
        {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
      </button>

      {/* Menu panel — opens below the sticky banner/header instead of covering it. */}
      {open && (
        <div
          data-testid="mobile-menu"
          className="fixed left-0 right-0 bottom-0 z-[100] bg-white border-t border-gray-100 md:hidden"
          style={{ top: panelTop }}
        >
          {/* ── Nav links ── */}
          <nav className="flex h-full flex-col px-6 overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`mobile-menu-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between py-5 text-sm uppercase tracking-widest font-medium border-b border-gray-100 transition-colors ${
                  link.accent ? 'text-[var(--brand-red)]' : 'hover:text-gray-400'
                }`}
              >
                {link.label}
                <ChevronRight size={16} strokeWidth={1.5} className="text-gray-300" />
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
