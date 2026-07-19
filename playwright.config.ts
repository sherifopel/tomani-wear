import { defineConfig, devices } from '@playwright/test'
import type { ReporterOptions } from 'playwright-final-summary-reporter'

// ─── CI detection ────────────────────────────────────────────────────────
// Read once so every conditional below (retries, timeout, webServer) agrees
// on what "CI" means instead of re-checking process.env.CI ad hoc.
const isCI = process.env.CI === 'true' || process.env.CI === '1'

// ─── Vercel deployment protection bypass ──────────────────────────────────
// When running against a Vercel preview URL in CI, send the bypass secret
// as a header so Deployment Protection doesn't block the requests.
const extraHTTPHeaders = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
  ? { 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET }
  : undefined

export default defineConfig({
  testDir: './e2e/specs',
  tsconfig: './e2e/tsconfig.json',
  fullyParallel: true,
  workers: 2, // single local Next.js dev server — more workers just contend for it
  retries:
    process.env.PLAYWRIGHT_RETRIES !== undefined
      ? Number(process.env.PLAYWRIGHT_RETRIES)
      : isCI
        ? 2
        : 0,
  timeout: isCI ? 60_000 : 30_000,

  // ─── Reporters ─────────────────────────────────────────────────────────
  reporter: [
    ['./e2e/reporters/status-reporter.ts'],
    ['playwright-final-summary-reporter', {
      sections: [
        { key: 'smoke',    label: 'SSR Health',          matchers: ['@tomanni-smoke'] },
        { key: 'header',   label: 'Header',              matchers: ['@header'] },
        { key: 'hero',     label: 'Hero Carousel',       matchers: ['@hero', '@homepage'] },
        { key: 'pdp',      label: 'Product Detail Page', matchers: ['@pdp'] },
        { key: 'cart',     label: 'Cart',                matchers: ['@cart'] },
        { key: 'checkout', label: 'Checkout',            matchers: ['@checkout'] },
      ],
    } satisfies ReporterOptions],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    extraHTTPHeaders,
  },

  // ─── Device matrix ─────────────────────────────────────────────────────
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 14'] },
    },
  ],
  // ─── Local dev server ──────────────────────────────────────────────────
  // CI runs against a deployed BASE_URL, so no local server is needed there.
  webServer: isCI
    ? undefined
    : {
        command: 'pnpm dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120_000,
      },
})
