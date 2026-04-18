import { auth } from '@/lib/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const metadata = { title: 'Account' }

export default async function AccountPage() {
  const session = await auth()
  const email = session?.user?.email ?? ''

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="mt-1 text-sm text-brand-muted">
          Profile, billing, and data-deletion controls.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Identity information brokers use to match you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block text-brand-muted">Email</span>
            <Input type="email" defaultValue={email} disabled />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-brand-muted">Previous addresses (comma separated)</span>
            <Input defaultValue="Seattle WA, Bellevue WA, Redmond WA" />
          </label>
          <Button variant="accent">Save</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>
            Deleting your account stops monitoring and purges your profile after 30 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50">
            Request account deletion
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
