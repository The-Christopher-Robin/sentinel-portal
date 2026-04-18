import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AuthError } from 'next-auth'
import { signIn } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

async function doSignIn(formData: FormData) {
  'use server'
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/portal',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      redirect('/signin?error=1')
    }
    // NEXT_REDIRECT and any other thrown signals must propagate so the
    // happy-path redirect actually happens.
    throw error
  }
}

export const metadata = { title: 'Sign in' }

export default function SignInPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-fog px-4">
      <div className="w-full max-w-sm rounded-lg border border-brand-ink/10 bg-white p-8 shadow-sm">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-block h-6 w-6 rounded bg-brand-accent" aria-hidden />
          SentinelPortal
        </Link>
        <h1 className="mt-6 text-xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-brand-muted">
          Use the demo account{' '}
          <code className="rounded bg-brand-fog px-1 text-xs">demo@sentinel.dev</code> /{' '}
          <code className="rounded bg-brand-fog px-1 text-xs">sentinel-demo-2026</code>.
        </p>

        <form action={doSignIn} className="mt-6 space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block text-brand-muted">Email</span>
            <Input type="email" name="email" required autoComplete="email" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-brand-muted">Password</span>
            <Input type="password" name="password" required minLength={8} autoComplete="current-password" />
          </label>
          {searchParams.error ? (
            <p className="text-xs text-red-600">
              That did not match. Check email and password and try again.
            </p>
          ) : null}
          <Button type="submit" variant="accent" className="w-full">
            Sign in
          </Button>
        </form>

        <Link href="/" className="mt-4 block text-center text-xs text-brand-muted hover:text-brand-ink">
          Back to home
        </Link>
      </div>
    </main>
  )
}
