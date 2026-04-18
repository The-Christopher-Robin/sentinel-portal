import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export const runtime = 'nodejs'

const UPSTREAM = process.env.CHAT_API_URL ?? 'http://localhost:4000'
const SECRET = process.env.CHAT_API_SHARED_SECRET ?? 'change-me'

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const session = await auth()
  const userId = session?.user?.id ?? 'anonymous'

  try {
    const upstream = await fetch(`${UPSTREAM}/chat`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${SECRET}`,
        'x-user-id': userId,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    })

    const payload = await upstream.text()
    return new NextResponse(payload, {
      status: upstream.status,
      headers: { 'content-type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'upstream_unreachable'
    return NextResponse.json(
      { error: 'upstream_failed', message },
      { status: 502 }
    )
  }
}
