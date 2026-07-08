export const metadata = { title: 'Size Guide — Tomanni' }

const TOPS = [
  { size: 'S',   chest: '36–38 in', length: 'Standard' },
  { size: 'M',   chest: '38–40 in', length: 'Standard' },
  { size: 'L',   chest: '40–42 in', length: 'Standard' },
  { size: 'XL',  chest: '42–45 in', length: 'Standard' },
  { size: 'XXL', chest: '44–50 in', length: 'Standard' },
]

const PANTS = [
  { size: 'XS',  waist: '28–30', hip: '34–36', inseam: '30' },
  { size: 'S',   waist: '30–32', hip: '36–38', inseam: '30.5' },
  { size: 'M',   waist: '32–34', hip: '38–40', inseam: '31' },
  { size: 'L',   waist: '34–36', hip: '40–42', inseam: '31.5' },
  { size: 'XL',  waist: '36–38', hip: '42–44', inseam: '32' },
  { size: 'XXL', waist: '38–40', hip: '44–46', inseam: '32.5' },
]

function Table({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-gray-100">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-gray-400 font-normal"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-3 ${j === 0 ? 'font-medium' : 'text-gray-500'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function SizeGuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-14 md:py-20">
      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Help & Support</p>
      <h1 className="text-2xl font-semibold tracking-tight mb-4">Size Guide</h1>
      <p className="text-sm text-gray-500 leading-relaxed mb-12">
        All measurements are in inches. If you are between sizes, we recommend sizing up.
      </p>

      <section className="mb-12">
        <h2 className="text-[10px] uppercase tracking-widest text-gray-400 mb-5">Tops & T-Shirts</h2>
        <Table
          headers={['Size', 'Chest (in)', 'Length']}
          rows={TOPS.map(({ size, chest, length }) => [size, chest, length])}
        />
      </section>

      <section>
        <h2 className="text-[10px] uppercase tracking-widest text-gray-400 mb-5">Pants</h2>
        <Table
          headers={['Size', 'Waist (in)', 'Hip (in)', 'Inseam (in)']}
          rows={PANTS.map(({ size, waist, hip, inseam }) => [size, waist, hip, inseam])}
        />
      </section>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Still unsure about your size?{' '}
          <a
            href="/contact"
            className="text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
          >
            Contact us
          </a>{' '}
          and we&apos;ll help you find the right fit.
        </p>
      </div>
    </div>
  )
}
