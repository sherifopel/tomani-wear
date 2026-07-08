'use client'
import { useFormValue } from 'sanity'

export function AnnouncementPreview() {
  const bgColor   = useFormValue(['announcementBarBgColor'])  as string | undefined
  const textColor = useFormValue(['announcementBarTextColor']) as string | undefined
  const messages  = useFormValue(['announcementBars']) as string[] | undefined

  const previewText = messages?.filter(Boolean)[0] ?? 'Free delivery on orders over ₦50,000'

  return (
    <div style={{ paddingTop: 4 }}>
      <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Live preview
      </p>
      <div
        style={{
          backgroundColor: bgColor  ?? '#000000',
          color:           textColor ?? '#ffffff',
          textAlign:       'center',
          fontSize:        11,
          padding:         '8px 20px',
          letterSpacing:   '0.1em',
          textTransform:   'uppercase',
          borderRadius:    4,
        }}
      >
        {previewText}
      </div>
    </div>
  )
}
