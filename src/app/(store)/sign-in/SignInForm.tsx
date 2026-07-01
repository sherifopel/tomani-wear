'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function SignInForm({ callbackUrl }: { callbackUrl: string }) {
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('resend', { email, callbackUrl, redirect: false })

    setLoading(false)

    if (res?.error) {
      setError('Something went wrong. Please try again.')
    } else {
      setEmailSent(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-sm">

        <div className="text-center mb-10">
          <h1
            data-testid="sign-in-heading"
            className="font-sans text-2xl font-semibold tracking-tight mb-2"
          >
            Who's stepping in?
          </h1>
          <p className="text-sm text-neutral-500">
            Sign in or create your account
          </p>
        </div>

        {/* Google */}
        <button
          type="button"
          data-testid="sign-in-google-button"
          disabled={googleLoading}
          onClick={async () => {
            setGoogleLoading(true)
            try {
              await signIn('google', { callbackUrl })
            } catch {
              setError('Could not connect to Google. Please try again.')
              setGoogleLoading(false)
            }
          }}
          className="w-full flex items-center justify-center gap-3 border border-neutral-300 rounded px-4 py-3 text-sm font-medium hover:bg-neutral-50 transition-colors mb-6 touch-manipulation disabled:opacity-60"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://www.google.com/favicon.ico"
            alt=""
            width={18}
            height={18}
            className="rounded"
          />
          {googleLoading ? 'Redirecting…' : 'Continue with Google'}
        </button>

        <div className="flex items-center gap-3 mb-6">
          <hr className="flex-1 border-neutral-200" />
          <span className="text-xs text-neutral-400 uppercase tracking-wider">or</span>
          <hr className="flex-1 border-neutral-200" />
        </div>

        {/* Magic link */}
        {emailSent ? (
          <div
            data-testid="sign-in-email-sent"
            className="text-center bg-neutral-50 border border-neutral-200 rounded-md px-6 py-8"
          >
            <p className="font-medium mb-1">Check your email</p>
            <p className="text-sm text-neutral-500">
              We sent a sign-in link to <strong>{email}</strong>
            </p>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} data-testid="sign-in-magic-link-form">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              data-testid="sign-in-email-input"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-neutral-300 rounded px-4 py-3 text-sm outline-none focus:border-black transition-colors mb-3"
              suppressHydrationWarning
            />

            {error && (
              <p data-testid="sign-in-error" className="text-sm text-red-500 mb-3">
                {error}
              </p>
            )}

            <button
              data-testid="sign-in-email-button"
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded px-4 py-3 text-sm font-medium btn-wipe disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              {loading ? 'Sending…' : 'Continue with email'}
            </button>
          </form>
        )}

        <p className="text-xs text-neutral-400 text-center mt-8">
          By signing in, you agree to our{' '}
          <a href="/privacy" className="underline underline-offset-2">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}
