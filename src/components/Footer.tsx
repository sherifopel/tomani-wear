import Link from 'next/link'
import { client } from '@/sanity/client'
import { SETTINGS_QUERY } from '@/sanity/queries'
import FooterAccordion from '@/components/FooterAccordion'

const FOOTER_SECTIONS = [
  {
    title: 'Help & Support',
    links: [
      { label: 'FAQ',               href: '/faq' },
      { label: 'Contact Us',        href: '/contact' },
      { label: 'Returns & Refunds', href: '/returns' },
      { label: 'Size Guide',        href: '/size-guide' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { label: 'New In',       href: '/products?category=new' },
      { label: 'Men',          href: '/products?category=men' },
      { label: 'Women',        href: '/products?category=women' },
      { label: 'Accessories',  href: '/products?category=accessories' },
      { label: 'Collections',  href: '/products?category=collections' },
      { label: 'Sale',         href: '/products?category=sale' },
    ],
  },
  {
    title: 'Tomanni',
    links: [
      { label: 'Our Story',  href: '/about' },
      { label: 'Instagram',  href: 'https://www.instagram.com/tomanniofficial', external: true },
    ],
  },
]

type FooterLink = {
  label?: string
  href?: string
}

type SocialLink = {
  platform?: string
  url?: string
}

type Settings = {
  instagramUrl?: string
  footerLinks?: FooterLink[]
  socialLinks?: SocialLink[]
}

const platformLabels: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  pinterest: 'Pinterest',
  tiktok: 'TikTok',
  whatsapp: 'WhatsApp',
  x: 'X',
  youtube: 'YouTube',
  other: 'Social link',
}

function isInternalLink(href: string) {
  return href.startsWith('/')
}

function getPlatformLabel(platform?: string) {
  if (!platform) return platformLabels.other
  return platformLabels[platform] ?? platformLabels.other
}

function SocialIcon({ platform }: { platform?: string }) {
  switch (platform) {
    case 'facebook':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    case 'pinterest':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0C5.4 0 0 5.35 0 11.94c0 5.05 3.15 9.36 7.6 11.1-.1-.95-.2-2.4.04-3.44l1.4-5.9s-.36-.72-.36-1.78c0-1.67.97-2.92 2.18-2.92 1.03 0 1.53.77 1.53 1.7 0 1.03-.66 2.57-1 4-.28 1.2.6 2.17 1.78 2.17 2.14 0 3.78-2.25 3.78-5.5 0-2.88-2.07-4.9-5.03-4.9-3.42 0-5.43 2.57-5.43 5.22 0 1.03.4 2.14.9 2.74.1.12.11.23.08.36l-.34 1.37c-.05.22-.18.27-.41.16-1.55-.72-2.52-2.98-2.52-4.8 0-3.9 2.84-7.5 8.2-7.5 4.3 0 7.65 3.06 7.65 7.16 0 4.28-2.7 7.72-6.45 7.72-1.26 0-2.44-.65-2.84-1.42l-.77 2.94c-.28 1.07-1.04 2.42-1.55 3.24.94.29 1.93.45 2.96.45 6.6 0 12-5.35 12-11.94C24 5.35 18.6 0 12 0z" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2-2.75v-3.5a6.33 6.33 0 1 0 5.45 6.25V8.73a8.16 8.16 0 0 0 4.77 1.52V6.69z" />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.47 0 .1 5.37.1 11.96c0 2.1.55 4.16 1.6 5.97L0 24l6.22-1.63a11.95 11.95 0 0 0 5.84 1.49h.01c6.59 0 11.96-5.37 11.96-11.96 0-3.2-1.25-6.2-3.51-8.42zM12.07 21.84h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.69.97.99-3.6-.23-.37a9.88 9.88 0 0 1-1.51-5.29c0-5.48 4.46-9.94 9.95-9.94 2.65 0 5.14 1.03 7.02 2.91a9.86 9.86 0 0 1 2.91 7.03c0 5.48-4.46 9.94-9.94 9.94zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.1 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
        </svg>
      )
    case 'x':
      return <span className="text-lg font-medium leading-none">X</span>
    default:
      return <span className="text-lg font-medium leading-none">+</span>
  }
}

export default async function Footer() {
  const settings: Settings = await client.fetch(SETTINGS_QUERY) ?? {}
  const socialLinks = settings.socialLinks?.filter((link) => link.platform && link.url) ?? []
  const footerLinks = settings.footerLinks?.filter((link) => link.label && link.href) ?? []
  const visibleSocialLinks = socialLinks.length
    ? socialLinks
    : settings.instagramUrl
      ? [{ platform: 'instagram', url: settings.instagramUrl }]
      : []

  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-10 px-6" data-testid="footer">
      <div className="max-w-7xl mx-auto">

        {/* Nav sections — accordion on mobile, columns on desktop */}
        <FooterAccordion sections={FOOTER_SECTIONS} />

        {/* Wordmark */}
        <Link
          href="/"
          data-testid="footer-logo"
          className="block text-2xl md:text-3xl font-bold tracking-[0.35em] uppercase leading-none mt-12 mb-4"
        >
          Tomanni
        </Link>

        {/* Bottom bar — social icons above copyright on mobile; side by side on desktop */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
          {visibleSocialLinks.length > 0 && (
            <div className="flex items-center gap-4" data-testid="footer-social">
              {visibleSocialLinks.map((link) => (
                <a
                  key={`${link.platform}-${link.url}`}
                  href={link.url}
                  aria-label={getPlatformLabel(link.platform)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`footer-social-${link.platform}`}
                  className="flex h-7 w-7 items-center justify-center text-black hover:opacity-50 transition-opacity duration-200"
                >
                  <SocialIcon platform={link.platform} />
                </a>
              ))}
            </div>
          )}

          <p className="text-[10px] uppercase tracking-widest text-gray-400" data-testid="footer-copyright">
            © {new Date().getFullYear()} Tomanni Official. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}
