'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { statusLabel } from '@/lib/orderStatus'

// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  orderCount:          number
  latestOrderStatus:   string | null
  variant:             'desktop' | 'mobile'
}

export default function AccountSidebarNav({ orderCount, latestOrderStatus, variant }: Props) {
  const pathname = usePathname()

  const ordersLabel =
    orderCount === 0
      ? 'No orders yet'
      : `${orderCount} order${orderCount === 1 ? '' : 's'}`

  const links = [
    { href: '/account/profile',   label: 'Profile',   meta: null        },
    { href: '/account/orders',    label: 'My Orders', meta: ordersLabel },
    { href: '/account/addresses', label: 'Addresses', meta: null        },
    { href: '/account/wishlist',  label: 'Wishlist',  meta: null        },
    { href: '/account/returns',   label: 'Returns',   meta: null        },
  ]

  // ── Desktop: vertical list ──────────────────────────────────────────────────
  if (variant === 'desktop') {
    return (
      <nav className="flex flex-col">
        {links.map(({ href, label, meta }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={`group flex flex-col py-3 border-b border-gray-100 last:border-0 transition-colors ${
                active ? 'text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              <span className={`text-sm ${active ? 'font-semibold' : 'font-normal'}`}>
                {label}
              </span>
              {meta && (
                <span className="text-[10px] mt-0.5 text-gray-300 group-hover:text-gray-500 transition-colors">
                  {meta}
                </span>
              )}
            </Link>
          )
        })}

      </nav>
    )
  }

  // ── Mobile: horizontal scrollable tabs ─────────────────────────────────────
  return (
    <nav className="flex gap-6 whitespace-nowrap">
      {links.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`)
        return (
          <Link
            key={href}
            href={href}
            className={`text-sm pb-2 border-b-2 transition-colors ${
              active
                ? 'text-black border-black font-semibold'
                : 'text-gray-500 border-transparent hover:text-black hover:border-gray-300'
            }`}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
