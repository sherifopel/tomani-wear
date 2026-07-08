'use client'
import { useFormValue } from 'sanity'

type Banner = { message?: string; theme?: string }

const THEMES: Record<string, { bg: string; text: string }> = {
  'black-white': { bg: '#000000', text: '#ffffff' },
  'grey-red':    { bg: '#6b7280', text: '#E8000D' },
}

export function AnnouncementPreview() {
  const banners = useFormValue(['announcementBars']) as Banner[] | undefined
  const first   = banners?.[0]
  const { bg, text } = THEMES[first?.theme ?? 'black-white']
  const msg = first?.message ?? 'Free delivery on orders over ₦50,000'

  return (
    <div style={{ paddingTop: 4 }}>
      <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Live preview — Banner 1
      </p>
      <div style={{ backgroundColor: bg, color: text, textAlign: 'center', fontSize: 11, padding: '8px 20px', letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 4 }}>
        {msg}
      </div>
    </div>
  )
}
