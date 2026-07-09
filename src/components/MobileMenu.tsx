'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '@/lib/nav-links'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [panelTop, setPanelTop] = useState(0)

  useEffect(() => {
    document.dispatchEvent(new CustomEvent('mobilemenu', { detail: { open } }))
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!open) return

    const measure = () => {
      const header = document.querySelector('[data-testid="nav-header"]')
      setPanelTop(header?.getBoundingClientRect().bottom ?? 0)
    }

    measure()
    const timer = setTimeout(measure, 320)
    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', measure)
    }
  }, [open])

  return (
    <>
      <button
        data-testid={open ? 'mobile-menu-close-button' : 'mobile-menu-open-button'}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((current) => !current)}
        className="md:hidden p-1.5 rounded hover:bg-gray-100 transition-colors duration-200"
      >
        {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
      </button>

      {open && (
        <div
          data-testid="mobile-menu"
          className="fixed left-0 right-0 bottom-0 z-[100] bg-white border-t border-gray-100 md:hidden"
          style={{ top: panelTop }}
        >
          <nav className="flex h-full flex-col px-6 overflow-y-auto pb-8">
            {NAV_LINKS.map((link) => {
              const hasChildren = !!link.children?.length

              return (
                <div key={link.href} className="border-b border-gray-100">
                  {/* Parent label — always a direct link to the category page */}
                  <Link
                    href={link.href}
                    data-testid={`mobile-menu-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setOpen(false)}
                    className={`block pt-5 ${hasChildren ? 'pb-3' : 'pb-5'} text-sm font-medium transition-colors ${
                      link.accent ? 'text-[var(--brand-red)]' : 'hover:text-gray-400'
                    }`}
                  >
                    {link.label}
                  </Link>

                  {/* Sub-links always visible — no tap required */}
                  {hasChildren && (
                    <div className="flex flex-wrap gap-x-5 gap-y-1 pb-4 pl-1">
                      {link.children!.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          data-testid={`mobile-sub-${child.label.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => setOpen(false)}
                          className="text-sm text-gray-400 hover:text-black transition-colors py-1"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      )}
    </>
  )
}
