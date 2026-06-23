import { set, unset } from 'sanity'
import type { StringInputProps } from 'sanity'

export function ColorPickerInput(props: StringInputProps) {
  const value = props.value ?? ''

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <input
        type="color"
        value={value || '#ffffff'}
        style={{ width: 44, height: 36, padding: 2, border: '1px solid #d1d5db', borderRadius: 6 }}
        onChange={(event) => props.onChange(set(event.target.value))}
      />
      <input
        type="text"
        value={value}
        placeholder="#ffffff"
        style={{ flex: 1, minWidth: 0, height: 36, padding: '0 10px', border: '1px solid #d1d5db', borderRadius: 6 }}
        onChange={(event) => {
          const next = event.target.value.trim()
          props.onChange(next ? set(next) : unset())
        }}
      />
    </div>
  )
}
