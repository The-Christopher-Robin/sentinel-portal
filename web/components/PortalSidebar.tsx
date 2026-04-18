import Link from 'next/link'
import { Activity, CreditCard, Home, Settings, Shield } from 'lucide-react'

const items = [
  { href: '/portal', label: 'Overview', icon: Home },
  { href: '/portal/removals', label: 'Removals', icon: Shield },
  { href: '/portal/monitoring', label: 'Monitoring', icon: Activity },
  { href: '/portal/billing', label: 'Billing', icon: CreditCard },
  { href: '/portal/account', label: 'Account', icon: Settings },
]

export function PortalSidebar({ userName }: { userName: string }) {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-brand-ink/10 bg-brand-fog p-4 md:block">
      <Link href="/" className="flex items-center gap-2 px-2 py-1 font-semibold">
        <span className="inline-block h-6 w-6 rounded bg-brand-accent" aria-hidden />
        SentinelPortal
      </Link>

      <nav className="mt-6 space-y-1">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-brand-ink transition-colors hover:bg-white"
          >
            <Icon className="h-4 w-4 text-brand-muted" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 rounded-md bg-white p-3 text-xs text-brand-muted shadow-sm">
        <div className="font-medium text-brand-ink">{userName}</div>
        <div>Member since 2025</div>
      </div>
    </aside>
  )
}
