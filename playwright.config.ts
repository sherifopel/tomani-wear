import { defineConfig, devices } from '@playwright/test'
import type { SectionDef } from 'playwright-final-summary-reporter'

// When running against a Vercel preview URL in CI, send the bypass secret
// as a header so Deployment Protection doesn't block the requests.
const extraHTTPHeaders = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
  ? { 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET }
  : undefined

const tomaniSections: SectionDef[] = [
  { key: 'hero',  label: 'Hero Banner',    matchers: ['@hero'] },
  { key: 'nav',   label: 'Navigation',     matchers: ['@nav', '@mobile'] },
  { key: 'pdp',   label: 'Product Detail', matchers: ['@pdp'] },
  { key: 'cart',  label: 'Cart',           matchers: ['@cart'] },
  { key: 'auth',  label: 'Auth',           matchers: ['@auth'] },
]

export default defineConfig({
  testDir: './e2e/specs',
  tsconfig: './e2e/tsconfig.json',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['playwright-final-summary-reporter', { sections: tomaniSections }],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    extraHTTPHeaders,
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 14'] },
    },
  ],
  webServer: process.env.CI ? undefined : {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
