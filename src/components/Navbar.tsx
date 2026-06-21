import Link from 'next/link'
import { Search, User, ShoppingBag } from 'lucide-react'
import MobileMenu from '@/components/MobileMenu'
import RotatingAnnouncementBar from '@/components/RotatingAnnouncementBar'
import StickyHeader from '@/components/StickyHeader'
import { client } from '@/sanity/client'
import { SETTINGS_QUERY } from '@/sanity/queries'

const navLinks = [
  { label: 'New In',      href: '/new',          underlineColor: 'var(--brand-black)'  },
  { label: 'Men',         href: '/men',          underlineColor: 'var(--brand-yellow)' },
  { label: 'Women',       href: '/women',        underlineColor: 'var(--brand-red)'    },
  { label: 'Accessories', href: '/accessories',  underlineColor: 'var(--brand-black)'  },
  { label: 'Collections', href: '/collections',  underlineColor: 'var(--brand-yellow)' },
  { label: 'Sale',        href: '/sale',         underlineColor: 'var(--brand-red)', accent: true },
]

type Settings = {
  announcementBar?: string
  announcementBars?: string[]
  announcementBarEnabled?: boolean
}

export default async function Navbar() {
  const settings: Settings = await client.fetch(SETTINGS_QUERY) ?? {}
  const showBanner = settings.announcementBarEnabled !== false
  const bannerMessages = settings.announcementBars?.filter(Boolean).length
    ? settings.announcementBars.filter(Boolean)
    : [settings.announcementBar ?? 'Free shipping on orders over ₦50,000']

  const announcementBar = showBanner ? (
    <RotatingAnnouncementBar messages={bannerMessages} />
  ) : undefined

  const mainRow = (
    <div className="border-b border-gray-100 px-6 py-4 grid grid-cols-3 items-center">
      <div className="flex items-center">
        <MobileMenu />
        <span className="hidden md:block text-xs text-gray-400 uppercase tracking-widest">Lagos, NG</span>
      </div>

      <Link
        href="/"
        data-testid="nav-logo-link"
        className="flex justify-center items-center"
      >
        <span className="text-xl md:text-2xl font-bold tracking-[0.25em] uppercase">Tomanni</span>
      </Link>

      <div className="flex items-center justify-end gap-5">
        <button
          data-testid="nav-search-button"
          aria-label="Search"
          className="transition-transform duration-200 hover:scale-125 active:scale-95"
        >
          <Search size={20} strokeWidth={1.5} />
        </button>
        <button
          data-testid="nav-account-button"
          aria-label="Account"
          className="transition-transform duration-200 hover:scale-125 active:scale-95"
        >
          <User size={20} strokeWidth={1.5} />
        </button>
        <button
          data-testid="nav-cart-button"
          aria-label="Cart"
          className="relative transition-transform duration-200 hover:scale-125 active:scale-95"
        >
          <ShoppingBag size={20} strokeWidth={1.5} />
          <span
            data-testid="nav-cart-count"
            className="absolute -top-1 -right-1 bg-[var(--brand-red)] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
          >
            0
          </span>
        </button>
      </div>
    </div>
  )

  return (
    <StickyHeader announcementBar={announcementBar} mainRow={mainRow}>
      {/* Category nav — desktop only; stays visible in compact mode as the sole header */}
      <nav
        data-testid="nav-links"
        className="hidden md:flex border-b border-gray-100 px-6 py-3 items-center justify-center gap-10"
      >
        {/* Logo that lives in the nav but is invisible until compact mode.
            Uses Tailwind's group-data-[compact=true] — reads the data-compact
            attribute set on the parent <header> by StickyHeader. */}
        <Link
          href="/"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute left-6 text-sm font-bold tracking-[0.25em] uppercase
                     opacity-0 pointer-events-none
                     group-data-[compact=true]:opacity-100
                     group-data-[compact=true]:pointer-events-auto
                     transition-opacity duration-300"
        >
          Tomanni
        </Link>

        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}-link`}
            style={{ '--link-underline-color': link.underlineColor } as React.CSSProperties}
            className={`nav-link-underline text-xs uppercase tracking-widest transition-colors whitespace-nowrap ${
              link.accent
                ? 'text-[var(--brand-red)] hover:opacity-70'
                : 'hover:text-gray-400'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </StickyHeader>
  )
}
