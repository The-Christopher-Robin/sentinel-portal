import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const stats = [
  { label: 'Sites monitored', value: '182' },
  { label: 'Removals completed', value: '47' },
  { label: 'Pending removals', value: '23' },
  { label: 'Re-listed this month', value: '4' },
]

const recent = [
  { site: 'spokeo.com', status: 'Removed', at: '2 hours ago' },
  { site: 'whitepages.com', status: 'Pending', at: 'Yesterday' },
  { site: 'beenverified.com', status: 'Removed', at: '3 days ago' },
  { site: 'intelius.com', status: 'Re-listed', at: '5 days ago' },
]

export const metadata = { title: 'Overview' }

export default function PortalOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="mt-1 text-sm text-brand-muted">
          Here is where your data stands across the broker sites we cover.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="text-2xl">{s.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>
            The last few things that changed across your broker queue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-brand-ink/10">
            {recent.map((r) => (
              <li key={r.site} className="flex items-center justify-between py-3 text-sm">
                <span>{r.site}</span>
                <span className="text-xs text-brand-muted">{r.status} - {r.at}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
