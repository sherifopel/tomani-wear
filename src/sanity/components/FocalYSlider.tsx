import { set, unset } from 'sanity'
import type { NumberInputProps } from 'sanity'

/**
 * Range slider for the desktopFocalY field.
 * Shows the current value next to the track so the editor knows where they are.
 */
export function FocalYSlider(props: NumberInputProps) {
  const value = props.value ?? 30

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 12, color: '#999', minWidth: 32 }}>Top</span>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={value}
          style={{ flex: 1, accentColor: '#c9a227' }}
          onChange={(e) => {
            const next = Number(e.target.value)
            props.onChange(next === undefined ? unset() : set(next))
          }}
        />
        <span style={{ fontSize: 12, color: '#999', minWidth: 48, textAlign: 'right' }}>Bottom</span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            minWidth: 36,
            textAlign: 'right',
            color: '#c9a227',
          }}
        >
          {value}%
        </span>
      </div>
    </div>
  )
}
