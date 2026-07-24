import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

// Lightweight config — no Prisma, safe to import in proxy.ts (middleware).
// Resend (email magic link) is NOT here because email providers need a database
// adapter to store verification tokens — that lives in auth.ts instead.
export const authConfig = {
  session: { strategy: 'jwt' as const },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: '/sign-in',
  },
} satisfies NextAuthConfig
