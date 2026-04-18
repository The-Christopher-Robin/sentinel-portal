import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type Status = 'Removed' | 'Pending' | 'Re-listed' | 'Needs action'

const rows: Array<{ site: string; status: Status; updated: string }> = [
  { site: 'spokeo.com', status: 'Removed', updated: '2h ago' },
  { site: 'whitepages.com', status: 'Pending', updated: 'yesterday' },
  { site: 'beenverified.com', status: 'Removed', updated: '3d ago' },
  { site: 'intelius.com', status: 'Re-listed', updated: '5d ago' },
  { site: 'mylife.com', status: 'Pending', updated: '6d ago' },
  { site: 'radaris.com', status: 'Needs action', updated: '8d ago' },
  { site: 'peoplefinder.com', status: 'Removed', updated: '12d ago' },
  { site: 'fastpeoplesearch.com', status: 'Pending', updated: '14d ago' },
]

const badge: Record<Status, string> = {
  Removed: 'bg-emerald-100 text-emerald-800',
  Pending: 'bg-amber-100 text-amber-800',
  'Re-listed': 'bg-red-100 text-red-800',
  'Needs action': 'bg-blue-100 text-blue-800',
}

export const metadata = { title: 'Removals' }

export default function RemovalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Removals</h1>
        <p className="mt-1 text-sm text-brand-muted">
          Every broker site in your coverage list and where it stands today.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sites ({rows.length})</CardTitle>
          <CardDescription>
            Demo data. In production this table streams from the removal pipeline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border border-brand-ink/10">
            <table className="w-full text-sm">
              <thead className="bg-brand-fog text-xs uppercase tracking-wider text-brand-muted">
                <tr>
                  <th className="px-4 py-2 text-left">Site</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-ink/10">
                {rows.map((r) => (
                  <tr key={r.site}>
                    <td className="px-4 py-3 font-medium">{r.site}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badge[r.status]}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-brand-muted">{r.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
