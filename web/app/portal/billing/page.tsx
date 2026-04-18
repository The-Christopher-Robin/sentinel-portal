import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const invoices = [
  { id: 'inv_2604', date: 'Apr 1, 2026', amount: '$14.99', status: 'Paid' },
  { id: 'inv_2503', date: 'Mar 1, 2026', amount: '$14.99', status: 'Paid' },
  { id: 'inv_2402', date: 'Feb 1, 2026', amount: '$14.99', status: 'Paid' },
]

export const metadata = { title: 'Billing' }

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Billing</h1>
        <p className="mt-1 text-sm text-brand-muted">
          Current plan, payment method, and past invoices.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
          <CardDescription>Monthly, billed on the 1st.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between text-sm">
          <div>
            <div className="text-2xl font-semibold">$14.99 / month</div>
            <div className="text-brand-muted">Next charge: May 1, 2026</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Change plan</Button>
            <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-50">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>Past 12 months, downloadable as PDF.</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-brand-muted">
              <tr>
                <th className="py-2">Invoice</th>
                <th className="py-2">Date</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-ink/10">
              {invoices.map((i) => (
                <tr key={i.id}>
                  <td className="py-3 font-mono text-xs">{i.id}</td>
                  <td className="py-3">{i.date}</td>
                  <td className="py-3">{i.amount}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                      {i.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
