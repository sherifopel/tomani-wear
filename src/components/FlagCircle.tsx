'use client'

// SVG flags — no clipPath IDs needed; parent span handles the circle clip

function Nigeria({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 3 3" xmlns="http://www.w3.org/2000/svg">
      <rect width="1" height="3" fill="#008751" />
      <rect x="1" width="1" height="3" fill="#ffffff" />
      <rect x="2" width="1" height="3" fill="#008751" />
    </svg>
  )
}

function UK({ size }: { size: number }) {
  // 2:1 viewBox with slice — correct diagonal angle when cropped to circle
  return (
    <svg width={size} height={size} viewBox="0 0 120 60"
      preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      {/* Blue field */}
      <rect width="120" height="60" fill="#012169" />
      {/* White diagonals (St Andrew) */}
      <line x1="0" y1="0" x2="120" y2="60" stroke="#fff" strokeWidth="18" />
      <line x1="120" y1="0" x2="0" y2="60" stroke="#fff" strokeWidth="18" />
      {/* Red diagonals (St Patrick — simplified, centred on white) */}
      <line x1="0" y1="0" x2="120" y2="60" stroke="#C8102E" strokeWidth="8" />
      <line x1="120" y1="0" x2="0" y2="60" stroke="#C8102E" strokeWidth="8" />
      {/* White cross (St George border) */}
      <rect x="0" y="22" width="120" height="16" fill="#fff" />
      <rect x="52" y="0" width="16" height="60" fill="#fff" />
      {/* Red cross (St George) */}
      <rect x="0" y="25" width="120" height="10" fill="#C8102E" />
      <rect x="55" y="0" width="10" height="60" fill="#C8102E" />
    </svg>
  )
}

function USA({ size }: { size: number }) {
  const stripeH = 60 / 13
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: 13 }).map((_, i) => (
        <rect key={i} x="0" y={i * stripeH} width="60" height={stripeH}
          fill={i % 2 === 0 ? '#B22234' : '#ffffff'} />
      ))}
      <rect x="0" y="0" width="24" height={stripeH * 7} fill="#3C3B6E" />
      {[0,1,2,3,4].map(row =>
        [0,1,2,3,4,5].map(col => (
          <circle key={`${row}-${col}`}
            cx={2.2 + col * 3.6 + (row % 2 === 0 ? 0 : 1.8)}
            cy={2.2 + row * 3.6}
            r={0.8} fill="#fff" />
        ))
      )}
    </svg>
  )
}

const FLAGS = { NGN: Nigeria, USD: USA, GBP: UK } as const
export type FlagCode = keyof typeof FLAGS

export default function FlagCircle({ code, size = 24 }: { code: FlagCode; size?: number }) {
  const Flag = FLAGS[code]
  return (
    <span
      style={{
        display: 'inline-flex',
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 0 0 1.5px rgba(0,0,0,0.12)',
        flexShrink: 0,
      }}
    >
      <Flag size={size} />
    </span>
  )
}
