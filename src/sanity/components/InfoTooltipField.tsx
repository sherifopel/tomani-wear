'use client'

import { useState } from 'react'
import type { FieldProps } from 'sanity'

export function InfoTooltipField(props: FieldProps) {
  const [visible, setVisible] = useState(false)

  // Strip leading ℹ / i placeholder character we used in description strings
  const raw = typeof props.description === 'string' ? props.description : null
  const tooltipText = raw ? raw.replace(/^[ℹi]\s*/, '') : null

  // If there's no description there's nothing to show — render default as-is
  if (!tooltipText) return <>{props.renderDefault(props)}</>

  return (
    <div>
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
          {props.title}
        </span>

        {/* ℹ badge — tooltip anchored to the RIGHT so it never overlaps content above */}
        <span
          style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
        >
          <span style={{
            width: 15, height: 15, borderRadius: '50%',
            background: '#9ca3af', color: '#fff',
            fontSize: 9, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'help', userSelect: 'none', lineHeight: 1,
          }}>i</span>

          {visible && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 'calc(100% + 10px)',
              transform: 'translateY(-50%)',
              background: '#1f2937',
              color: '#f3f4f6',
              padding: '10px 13px',
              borderRadius: 7,
              fontSize: 12,
              lineHeight: 1.55,
              width: 260,
              zIndex: 9999,
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              pointerEvents: 'none',
              whiteSpace: 'normal',
            }}>
              {/* Left-pointing arrow */}
              <span style={{
                position: 'absolute',
                top: '50%', right: '100%',
                transform: 'translateY(-50%)',
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderRight: '6px solid #1f2937',
                display: 'block', width: 0, height: 0,
              }} />
              {tooltipText}
            </div>
          )}
        </span>
      </div>

      {/* Field input — no default description shown below */}
      {props.children}
    </div>
  )
}
