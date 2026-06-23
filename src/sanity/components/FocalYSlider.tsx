import { set, unset } from 'sanity'
import type { NumberInputProps } from 'sanity'

const BRAND_YELLOW = '#c9a227'

function makeSlider(startLabel: string, endLabel: string, defaultValue = 50) {
  return function SliderInput(props: NumberInputProps) {
    const value = props.value ?? defaultValue
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: '#999', minWidth: 32 }}>{startLabel}</span>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={value}
            style={{ flex: 1, accentColor: BRAND_YELLOW }}
            onChange={(e) => {
              const next = Number(e.target.value)
              props.onChange(next === undefined ? unset() : set(next))
            }}
          />
          <span style={{ fontSize: 12, color: '#999', minWidth: 48, textAlign: 'right' }}>{endLabel}</span>
          <span style={{ fontSize: 13, fontWeight: 600, minWidth: 36, textAlign: 'right', color: BRAND_YELLOW }}>
            {value}%
          </span>
        </div>
      </div>
    )
  }
}

export const FocalYSlider = makeSlider('Top',  'Bottom', 85)
export const FocalXSlider = makeSlider('Left', 'Right',  0)
