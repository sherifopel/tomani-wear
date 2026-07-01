'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
import { NAV_LINKS } from '@/lib/nav-links'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [panelTop, setPanelTop] = useState(0)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    document.dispatchEvent(new CustomEvent('mobilemenu', { detail: { open } }))

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

  const toggle = (href: string) => {
    setExpanded((prev) => (prev === href ? null : href))
  }

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
          <nav className="flex h-full flex-col px-6 overflow-y-auto">
            {NAV_LINKS.map((link) => {
              const hasChildren = !!link.children?.length
              const isExpanded = expanded === link.href

              return (
                <div key={link.href} className="border-b border-gray-100">
                  {hasChildren ? (
                    <>
                      {/* Row with two tappable zones: label → navigate, chevron → expand */}
                      <div className="flex items-center">
                        <Link
                          href={link.href}
                          data-testid={`mobile-menu-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => setOpen(false)}
                          className={`flex-1 py-5 text-sm uppercase tracking-widest font-medium transition-colors ${
                            link.accent ? 'text-[var(--brand-red)]' : 'hover:text-gray-400'
                          }`}
                        >
                          {link.label}
                        </Link>
                        <button
                          aria-label={isExpanded ? `Collapse ${link.label}` : `Expand ${link.label}`}
                          onClick={() => toggle(link.href)}
                          className="touch-manipulation p-3 -mr-3 text-gray-400"
                        >
                          {isExpanded
                            ? <ChevronDown size={16} strokeWidth={1.5} />
                            : <ChevronRight size={16} strokeWidth={1.5} />
                          }
                        </button>
                      </div>

                      {/* Sub-links */}
                      {isExpanded && (
                        <div className="pb-2">
                          {link.children!.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              data-testid={`mobile-sub-${child.label.toLowerCase().replace(/\s+/g, '-')}`}
                              onClick={() => setOpen(false)}
                              className="block pl-4 py-3 text-sm text-gray-500 hover:text-black transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      data-testid={`mobile-menu-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between py-5 text-sm uppercase tracking-widest font-medium transition-colors ${
                        link.accent ? 'text-[var(--brand-red)]' : 'hover:text-gray-400'
                      }`}
                    >
                      {link.label}
                      <ChevronRight size={16} strokeWidth={1.5} className="text-gray-300" />
                    </Link>
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
