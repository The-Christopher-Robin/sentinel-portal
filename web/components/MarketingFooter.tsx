import Link from 'next/link'

const groups = [
  {
    heading: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/how-it-works', label: 'How it works' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/for-executives', label: 'For executives' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/blog', label: 'Blog' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
]

export function MarketingFooter() {
  return (
    <footer className="mt-24 border-t border-brand-ink/10 bg-brand-fog">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="inline-block h-6 w-6 rounded bg-brand-accent" aria-hidden />
            SentinelPortal
          </div>
          <p className="mt-3 max-w-xs text-sm text-brand-muted">
            Remove your personal information from broker sites and keep it off
            for good.
          </p>
        </div>

        {groups.map((g) => (
          <div key={g.heading}>
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              {g.heading}
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-brand-ink transition-colors hover:text-brand-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-brand-ink/10 py-4 text-center text-xs text-brand-muted">
        (c) {new Date().getFullYear()} SentinelPortal
      </div>
    </footer>
  )
}
