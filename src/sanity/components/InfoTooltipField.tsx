'use client'

import { useState } from 'react'
import type { FieldProps } from 'sanity'

export function InfoTooltipField(props: FieldProps) {
  const [visible, setVisible] = useState(false)

  // Strip the leading ℹ / i character we used to put in the description string
  const raw = typeof props.description === 'string' ? props.description : null
  const tooltipText = raw ? raw.replace(/^[ℹi]\s*/, '') : null

  return (
    <div>
      {/* Label row — field title + ℹ tooltip icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
          {props.title}
        </span>

        {tooltipText && (
          <span
            style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
          >
            {/* ℹ circle badge */}
            <span style={{
              width: 15, height: 15, borderRadius: '50%',
              background: '#9ca3af', color: '#fff',
              fontSize: 9, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'help', userSelect: 'none', lineHeight: 1,
              flexShrink: 0,
            }}>i</span>

            {/* Tooltip popup */}
            {visible && (
              <div style={{
                position: 'absolute',
                bottom: 'calc(100% + 8px)',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#1f2937',
                color: '#f3f4f6',
                padding: '10px 13px',
                borderRadius: 7,
                fontSize: 12,
                lineHeight: 1.55,
                width: 270,
                zIndex: 9999,
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                pointerEvents: 'none',
              }}>
                {tooltipText}
                {/* Downward arrow */}
                <span style={{
                  position: 'absolute',
                  top: '100%', left: '50%',
                  transform: 'translateX(-50%)',
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid #1f2937',
                  display: 'block', width: 0, height: 0,
                }} />
              </div>
            )}
          </span>
        )}
      </div>

      {/* Input rendered by Sanity — no default label/description below it */}
      {props.children}
    </div>
  )
}
