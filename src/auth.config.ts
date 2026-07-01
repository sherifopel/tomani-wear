import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'

// Lightweight config — no Prisma, safe to import in proxy.ts
export const authConfig = {
  session: { strategy: 'jwt' as const },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY!,
      from: 'Tomani Wear <onboarding@resend.dev>',
    }),
  ],
  pages: {
    signIn: '/sign-in',
  },
} satisfies NextAuthConfig
