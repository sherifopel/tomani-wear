'use client'
import { useFormValue } from 'sanity'

type Banner = { message?: string; bgColor?: string; textColor?: string }

export function AnnouncementPreview() {
  const banners = useFormValue(['announcementBars']) as Banner[] | undefined
  const first   = banners?.[0]

  const bg   = first?.bgColor   ?? '#000000'
  const text = first?.textColor ?? '#ffffff'
  const msg  = first?.message   ?? 'Free delivery on orders over ₦50,000'

  return (
    <div style={{ paddingTop: 4 }}>
      <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Live preview — Banner 1
      </p>
      <div
        style={{
          backgroundColor: bg,
          color:           text,
          textAlign:       'center',
          fontSize:        11,
          padding:         '8px 20px',
          letterSpacing:   '0.1em',
          textTransform:   'uppercase',
          borderRadius:    4,
        }}
      >
        {msg}
      </div>
    </div>
  )
}
