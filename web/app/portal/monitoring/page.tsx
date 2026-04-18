import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const events = [
  { at: '2 hours ago', kind: 'scan', note: '182 broker sites scanned, 3 new listings detected.' },
  { at: 'yesterday', kind: 'submit', note: 'Opt-out requests submitted to 3 newly-listed sites.' },
  { at: '3 days ago', kind: 'removal', note: 'beenverified.com confirmed removal.' },
  { at: '5 days ago', kind: 'relist', note: 'intelius.com re-listed you after prior removal. Auto re-submitted.' },
  { at: '8 days ago', kind: 'scan', note: 'Monthly full sweep completed.' },
]

const kindBadge: Record<string, string> = {
  scan: 'bg-blue-100 text-blue-800',
  submit: 'bg-amber-100 text-amber-800',
  removal: 'bg-emerald-100 text-emerald-800',
  relist: 'bg-red-100 text-red-800',
}

export const metadata = { title: 'Monitoring' }

export default function MonitoringPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Monitoring</h1>
        <p className="mt-1 text-sm text-brand-muted">
          A running log of everything the pipeline has done for you.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity log</CardTitle>
          <CardDescription>
            Demo events. In production this feed streams from the scan and submission workers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-brand-ink/10">
            {events.map((e, i) => (
              <li key={i} className="flex items-start gap-3 py-3 text-sm">
                <span
                  className={`mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${kindBadge[e.kind]}`}
                >
                  {e.kind}
                </span>
                <div>
                  <p>{e.note}</p>
                  <p className="mt-0.5 text-xs text-brand-muted">{e.at}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
