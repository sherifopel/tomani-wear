import Link from 'next/link'

type Crumb = { label: string; href?: string }

export default function Breadcrumbs({
  crumbs,
  testId,
}: {
  crumbs: Crumb[]
  testId?: string
}) {
  return (
    <nav
      className="hidden md:flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest py-4"
      data-testid={testId}
    >
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span>/</span>}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-black transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-black font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
