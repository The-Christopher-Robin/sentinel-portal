import Link from 'next/link'
import { Button } from '@/components/ui/button'

const links = [
  { href: '/features', label: 'Features' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/for-executives', label: 'For executives' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
]

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-ink/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-block h-6 w-6 rounded bg-brand-accent" aria-hidden />
          SentinelPortal
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-brand-muted transition-colors hover:text-brand-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/signin">Sign in</Link>
          </Button>
          <Button asChild variant="accent" size="sm">
            <Link href="/signin">Start free scan</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
