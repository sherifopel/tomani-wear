import Link from 'next/link'
import MobileMenu from '@/components/MobileMenu'
import NavCartButton from '@/components/NavCartButton'
import AccountButton from '@/components/AccountButton'
import RotatingAnnouncementBar from '@/components/RotatingAnnouncementBar'
import StickyHeader from '@/components/StickyHeader'
import SearchControl from '@/components/SearchControl'
import { client } from '@/sanity/client'
import { SETTINGS_QUERY } from '@/sanity/queries'
import { NAV_LINKS } from '@/lib/nav-links'

type Banner = { message: string; theme?: string }

type Settings = {
  announcementBars?: Banner[]
  announcementBarEnabled?: boolean
}

export default async function Navbar() {
  const settings: Settings = await client.fetch(SETTINGS_QUERY) ?? {}
  const showBanner = settings.announcementBarEnabled !== false
  const banners: Banner[] = settings.announcementBars?.filter(b => b.message) ?? [
    { message: 'Free delivery on orders over ₦50,000', theme: 'black-white' },
  ]

  const announcementBar = showBanner ? (
    <RotatingAnnouncementBar banners={banners} />
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
        <SearchControl />
        <AccountButton />
        <NavCartButton />
      </div>
    </div>
  )

  return (
    <StickyHeader announcementBar={announcementBar} mainRow={mainRow}>
      {/* Category nav — desktop only */}
      <nav
        data-testid="nav-links"
        className="hidden md:flex border-b border-gray-100 bg-gray-100 px-6 py-3 items-center justify-center gap-10"
      >
        {/* Compact-mode logo */}
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

        {NAV_LINKS.map((link) => (
          <div
            key={link.href}
            className="relative group/navitem flex items-center"
          >
            {/* Main nav link */}
            <Link
              href={link.href}
              data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}-link`}
              style={{ '--link-underline-color': link.underlineColor } as React.CSSProperties}
              className={`nav-link-underline text-xs uppercase tracking-widest transition-colors whitespace-nowrap ${
                link.accent
                  ? 'text-[var(--brand-red)] hover:opacity-70'
                  : 'hover:text-gray-400'
              }`}
            >
              {link.label}
            </Link>

            {/* Dropdown — floating bricks, no panel background */}
            {link.children && (
              <div
                className="absolute left-0 top-full z-[200]
                           invisible opacity-0 translate-y-1
                           group-hover/navitem:visible group-hover/navitem:opacity-100
                           group-hover/navitem:translate-y-0
                           transition-all duration-150 delay-75
                           group-hover/navitem:delay-0"
              >
                {/* Invisible bridge keeps hover alive while cursor moves down */}
                <div className="h-3 w-full" />
                <div className="flex flex-col gap-1.5 min-w-[180px]">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      data-testid={`nav-sub-${child.label.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block px-4 py-2.5 text-xs uppercase tracking-widest
                                 bg-white rounded border border-gray-200
                                 text-black font-semibold hover:bg-black hover:text-white hover:border-black
                                 shadow-sm hover:shadow-md
                                 transition-all duration-150 whitespace-nowrap"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>
    </StickyHeader>
  )
}
