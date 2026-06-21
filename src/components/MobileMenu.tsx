'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'New In',      href: '/new',          accent: false },
  { label: 'Men',         href: '/men',          accent: false },
  { label: 'Women',       href: '/women',        accent: false },
  { label: 'Accessories', href: '/accessories',  accent: false },
  { label: 'Collections', href: '/collections',  accent: false },
  { label: 'Sale',        href: '/sale',         accent: true  },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  // createPortal needs the DOM — only run after mount
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <>
      {/* Toggle — stays inside the header, swaps hamburger ↔ X */}
      <button
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen(!open)}
        className="md:hidden transition-transform duration-200 hover:scale-110 active:scale-95"
      >
        {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
      </button>

      {/* Overlay — portalled to <body> so it lives OUTSIDE the header's
          stacking context. Header is z-[101], overlay is z-[100]:
          header always paints on top, seamless effect. */}
      {mounted && open && createPortal(
        <div className="fixed inset-0 z-[100] bg-white">
          <nav className="flex flex-col px-6 pt-[5.5rem] gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`py-4 text-sm uppercase tracking-widest font-medium border-b border-gray-100 transition-colors ${
                  link.accent ? 'text-[var(--brand-red)]' : 'hover:text-gray-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>,
        document.body
      )}
    </>
  )
}
