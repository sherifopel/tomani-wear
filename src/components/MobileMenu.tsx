'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X, Plus, Minus } from 'lucide-react'
import type { NavLink } from '@/lib/nav-links'

export default function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false)
  const [panelTop, setPanelTop] = useState(0)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    document.dispatchEvent(new CustomEvent('mobilemenu', { detail: { open } }))

    if (open) {
      // Freeze the page — works on iOS Safari too
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top      = `-${scrollY}px`
      document.body.style.width    = '100%'
    } else {
      // Restore scroll position when menu closes
      const scrollY = parseFloat(document.body.style.top || '0') * -1
      document.body.style.position = ''
      document.body.style.top      = ''
      document.body.style.width    = ''
      window.scrollTo(0, scrollY)
    }

    return () => {
      document.body.style.position = ''
      document.body.style.top      = ''
      document.body.style.width    = ''
    }
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

  const toggle = (href: string) => setExpanded(prev => prev === href ? null : href)

  return (
    <>
      <button
        data-testid={open ? 'mobile-menu-close-button' : 'mobile-menu-open-button'}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen(current => !current)}
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
            {links.map((link) => {
              const hasChildren = !!link.children?.length
              const isExpanded  = expanded === link.href

              return (
                <div key={link.href} className="border-b border-gray-100">
                  <div className="flex items-center">
                    {/* Label — navigates to the category page */}
                    <Link
                      href={link.href}
                      data-testid={`mobile-menu-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setOpen(false)}
                      className={`flex-1 py-5 text-sm font-medium transition-colors ${
                        link.accent ? 'text-[var(--brand-red)]' : 'hover:text-gray-400'
                      }`}
                    >
                      {link.label}
                    </Link>

                    {/* + / − toggle — only shown when there are sub-items */}
                    {hasChildren && (
                      <button
                        aria-label={isExpanded ? `Close ${link.label}` : `Open ${link.label}`}
                        onClick={() => toggle(link.href)}
                        className="touch-manipulation p-3 -mr-3 text-gray-400 active:text-black"
                      >
                        {isExpanded
                          ? <Minus size={16} strokeWidth={1.5} />
                          : <Plus  size={16} strokeWidth={1.5} />
                        }
                      </button>
                    )}
                  </div>

                  {/* Sub-links — revealed when + is tapped */}
                  {hasChildren && isExpanded && (
                    <div className="pb-4 pl-1 flex flex-col gap-0">
                      {link.children!.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          data-testid={`mobile-sub-${child.label.toLowerCase().replace(/\s+/g, '-')}`}
                          onClick={() => setOpen(false)}
                          className="py-3 text-sm text-black hover:text-gray-500 transition-colors border-b border-gray-50 last:border-0"
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
