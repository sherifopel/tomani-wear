'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Minus } from 'lucide-react'

type FooterLink = { label: string; href: string; external?: boolean }
type Section = { title: string; links: FooterLink[] }

export default function FooterAccordion({ sections }: { sections: Section[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      {/* Mobile: accordion with + / − */}
      <div className="md:hidden" data-testid="footer-accordion-mobile">
        {sections.map((section, i) => (
          <div key={section.title} className="border-b border-gray-100">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              data-testid={`footer-accordion-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex items-center justify-between w-full py-4 text-xs uppercase tracking-widest font-medium"
            >
              {section.title}
              {openIndex === i
                ? <Minus size={14} strokeWidth={1.5} />
                : <Plus size={14} strokeWidth={1.5} />
              }
            </button>
            {openIndex === i && (
              <ul className="pb-5 flex flex-col gap-3">
                {section.links.map(link => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-black transition-colors duration-200"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-gray-500 hover:text-black transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Desktop: columns */}
      <div
        className="hidden md:grid gap-12 pb-16 border-b border-gray-100"
        style={{ gridTemplateColumns: `repeat(${sections.length}, 1fr)` }}
        data-testid="footer-columns-desktop"
      >
        {sections.map(section => (
          <div key={section.title}>
            <p className="text-xs uppercase tracking-widest font-medium mb-5">{section.title}</p>
            <ul className="flex flex-col gap-3">
              {section.links.map(link => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-500 hover:text-black transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-black transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}
