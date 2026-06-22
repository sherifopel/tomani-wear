'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Search, User, ShoppingBag, ChevronRight } from 'lucide-react'

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

  return (
    <>
      {/* Hamburger — sits inside the Navbar header */}
      <button
        data-testid="mobile-menu-open-button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="md:hidden transition-transform duration-200 hover:scale-110 active:scale-95"
      >
        <Menu size={22} strokeWidth={1.5} />
      </button>

      {/* Full-screen overlay */}
      {open && (
        <div
          data-testid="mobile-menu"
          className="fixed inset-0 z-[100] bg-white flex flex-col md:hidden"
        >
          {/* ── Top bar: mirrors the Navbar header ── */}
          <div className="border-b border-gray-100 px-6 py-4 grid grid-cols-3 items-center shrink-0">

            {/* Close button — left slot */}
            <button
              data-testid="mobile-menu-close-button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="transition-transform duration-200 hover:scale-110 active:scale-95 justify-self-start"
            >
              <X size={22} strokeWidth={1.5} />
            </button>

            {/* Logo — centre slot */}
            <Link
              href="/"
              data-testid="mobile-menu-logo"
              onClick={() => setOpen(false)}
              className="flex justify-center items-center"
            >
              <span className="text-[20px] font-light leading-none tracking-[0.22em] uppercase">
                Tomanni
              </span>
            </Link>

            {/* Actions — right slot */}
            <div className="flex items-center justify-end gap-3">
              <button
                data-testid="mobile-menu-search-button"
                aria-label="Search"
                className="transition-transform duration-200 hover:scale-125 active:scale-95"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>
              <button
                data-testid="mobile-menu-account-button"
                aria-label="Account"
                className="transition-transform duration-200 hover:scale-125 active:scale-95"
              >
                <User size={18} strokeWidth={1.5} />
              </button>
              <button
                data-testid="mobile-menu-cart-button"
                aria-label="Cart"
                className="relative transition-transform duration-200 hover:scale-125 active:scale-95"
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                <span className="absolute -top-1 -right-1 bg-[var(--brand-red)] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>

          {/* ── Nav links ── */}
          <nav className="flex flex-col px-6 overflow-y-auto">
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
