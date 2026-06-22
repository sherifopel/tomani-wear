import Link from 'next/link'

const viewports = [
  { label: 'Small', width: 390, height: 844 },
  { label: 'Medium', width: 768, height: 900 },
  { label: 'Large', width: 1280, height: 800 },
  { label: 'Extra Large', width: 1536, height: 900 },
]

export default function HeroPreviewPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-[1800px] px-4 py-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-400">Tomanni</p>
            <h1 className="mt-2 text-2xl font-medium">Hero Screen Preview</h1>
          </div>
          <Link
            href="/?draft=1"
            className="border border-white/30 px-4 py-2 text-xs uppercase tracking-widest text-white hover:bg-white hover:text-black"
          >
            Open Site
          </Link>
        </div>

        <div className="flex flex-wrap items-start gap-6 pb-6">
          {viewports.map((viewport) => (
            <section key={viewport.label} className="shrink-0">
              <div className="mb-2 flex items-center justify-between text-sm text-neutral-300">
                <span>{viewport.label}</span>
                <span>
                  {viewport.width} x {viewport.height}
                </span>
              </div>
              <iframe
                src="/?draft=1"
                title={`${viewport.label} hero preview`}
                width={viewport.width}
                height={viewport.height}
                className="rounded-sm border border-white/20 bg-white"
              />
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
