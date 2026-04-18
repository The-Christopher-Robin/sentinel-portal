import { redirect } from 'next/navigation'
import { auth, signOut } from '@/lib/auth'
import { PortalSidebar } from '@/components/PortalSidebar'
import { ChatBox } from '@/components/ChatBox'
import { Button } from '@/components/ui/button'

async function doSignOut() {
  'use server'
  await signOut({ redirectTo: '/' })
}

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect('/signin')

  return (
    <div className="flex min-h-screen bg-brand-fog">
      <PortalSidebar userName={session.user.name ?? session.user.email ?? 'Member'} />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-brand-ink/10 bg-white px-6 py-3">
          <div className="text-sm text-brand-muted">
            Signed in as <span className="text-brand-ink">{session.user.email}</span>
          </div>
          <form action={doSignOut}>
            <Button type="submit" variant="ghost" size="sm">Sign out</Button>
          </form>
        </header>
        <div className="p-6">{children}</div>
      </div>
      <ChatBox />
    </div>
  )
}
