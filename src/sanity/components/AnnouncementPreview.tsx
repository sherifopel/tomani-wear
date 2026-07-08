'use client'
import { useFormValue } from 'sanity'

type Banner = { message?: string; theme?: string }

const THEMES: Record<string, { bg: string; text: string }> = {
  'black-white': { bg: '#000000', text: '#ffffff' },
  'grey-red':    { bg: '#6b7280', text: '#E8000D' },
}

export function AnnouncementPreview() {
  const banners = (useFormValue(['announcementBars']) as Banner[] | undefined) ?? []
  const list = banners.length > 0 ? banners : [{ message: 'Free delivery on orders over ₦50,000', theme: 'black-white' }]

  return (
    <div style={{ paddingTop: 4, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <p style={{ fontSize: 11, color: '#9ca3af', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Live preview
      </p>
      {list.map((b, i) => {
        const { bg, text } = THEMES[b.theme ?? 'black-white']
        return (
          <div key={i}>
            <p style={{ fontSize: 10, color: '#9ca3af', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Banner {i + 1}
            </p>
            <div style={{ backgroundColor: bg, color: text, textAlign: 'center', fontSize: 11, padding: '8px 20px', letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 4 }}>
              {b.message || '—'}
            </div>
          </div>
        )
      })}
    </div>
  )
}
