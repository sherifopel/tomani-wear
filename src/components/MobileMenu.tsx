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
    if (!open) return

    const updatePanelTop = () => {
      const header = document.querySelector('[data-testid="nav-header"]')
      setPanelTop(header?.getBoundingClientRect().bottom ?? 0)
    }

    updatePanelTop()
    window.addEventListener('resize', updatePanelTop)
    return () => window.removeEventListener('resize', updatePanelTop)
  }, [open])

  return (
    <>
      {/* Hamburger — sits inside the Navbar header */}
      <button
        data-testid={open ? 'mobile-menu-close-button' : 'mobile-menu-open-button'}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((current) => !current)}
        className="md:hidden transition-transform duration-200 hover:scale-110 active:scale-95"
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
