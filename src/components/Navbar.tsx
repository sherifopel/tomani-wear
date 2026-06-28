import Link from 'next/link'
import { Search, User } from 'lucide-react'
import MobileMenu from '@/components/MobileMenu'
import NavCartButton from '@/components/NavCartButton'
import RotatingAnnouncementBar from '@/components/RotatingAnnouncementBar'
import StickyHeader from '@/components/StickyHeader'
import { client } from '@/sanity/client'
import { SETTINGS_QUERY } from '@/sanity/queries'

const navLinks = [
  { label: 'New In',      href: '/products?category=new',         underlineColor: 'var(--brand-black)'  },
  { label: 'Men',         href: '/products?category=men',         underlineColor: 'var(--brand-yellow)' },
  { label: 'Women',       href: '/products?category=women',       underlineColor: 'var(--brand-red)'    },
  { label: 'Accessories', href: '/products?category=accessories', underlineColor: 'var(--brand-black)'  },
  { label: 'Collections', href: '/products?category=collections', underlineColor: 'var(--brand-yellow)' },
  { label: 'Sale',        href: '/products?category=sale',        underlineColor: 'var(--brand-red)', accent: true },
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
    <div
      data-testid="nav-main-row"
      className="border-b border-gray-100 px-6 py-4 grid grid-cols-[auto_1fr_auto] items-center"
    >
      <div className="flex items-center">
        <MobileMenu />
        <span className="hidden md:block text-xs text-gray-400 uppercase tracking-widest">Lagos, NG</span>
      </div>

      <Link
        href="/"
        data-testid="nav-logo-link"
        className="justify-self-center flex items-center"
      >
        <span className="logo-shine text-[20px] md:text-[28px] font-bold leading-none tracking-[0.22em] uppercase">Tomanni</span>
      </Link>

      <div className="flex items-center justify-end gap-2 md:gap-5 text-black">
        <button
          data-testid="nav-search-button"
          aria-label="Search"
          className="p-1.5 rounded hover:bg-gray-100 transition-colors duration-200"
        >
          <Search className="h-[18px] w-[18px] md:h-5 md:w-5" strokeWidth={1.5} />
        </button>
        <button
          data-testid="nav-account-button"
          aria-label="Account"
          className="p-1.5 rounded hover:bg-gray-100 transition-colors duration-200"
        >
          <User className="h-[18px] w-[18px] md:h-5 md:w-5" strokeWidth={1.5} />
        </button>
        <NavCartButton />
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
          className="hidden lg:block absolute left-6 text-sm font-bold tracking-[0.22em] uppercase
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
