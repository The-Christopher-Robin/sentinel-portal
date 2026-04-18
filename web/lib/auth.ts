import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

const credSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const DEMO_USERS = [
  { id: 'u_001', email: 'demo@sentinel.dev', password: 'sentinel-demo-2026', name: 'Alex Demo' },
]

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/signin' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(raw) {
        const parsed = credSchema.safeParse(raw)
        if (!parsed.success) return null
        const user = DEMO_USERS.find(
          (u) => u.email === parsed.data.email && u.password === parsed.data.password
        )
        if (!user) return null
        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (session.user && typeof token.id === 'string') {
        session.user.id = token.id
      }
      return session
    },
  },
})
