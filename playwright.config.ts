import { defineConfig, type ReporterDescription } from '@playwright/test'
import type { ReporterOptions } from 'playwright-final-summary-reporter'
import { getRunSettings } from './e2e/utils/environment'

// =============================================================================
// ENVIRONMENT & RUN RESOLUTION
// =============================================================================
// Resolve the run before importing specs. Unknown environments fail closed.
const { environment, suite, viewport, grep } = getRunSettings()
process.env.TEST_ENV = environment.name
const isCI = !!process.env.CI

// no dotenv.config() — nothing reads process.env directly yet

const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || process.env.SITE_PATH || environment.baseURL

// bypasses Vercel deployment protection on preview/dev URLs
const extraHTTPHeaders = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
  ? { 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET }
  : undefined

const ciReporters: ReporterDescription[] = [
  ['./e2e/reporters/status-reporter.ts'],
  ['playwright-final-summary-reporter', {
    sections: [
      { key: 'smoke',    label: 'SSR Health',          matchers: ['@smoke'] },
      { key: 'header',   label: 'Header',              matchers: ['@header'] },
      { key: 'hero',     label: 'Hero Carousel',       matchers: ['@hero', '@homepage'] },
      { key: 'pdp',      label: 'Product Detail Page', matchers: ['@pdp'] },
      { key: 'cart',     label: 'Cart',                matchers: ['@cart'] },
      { key: 'checkout', label: 'Checkout',            matchers: ['@checkout'] },
      { key: 'a11y',     label: 'Accessibility',       matchers: ['@a11y'] },
    ],
  } satisfies ReporterOptions],
]

const localReporters: ReporterDescription[] = [
  ['line'],
  ['html', { open: 'never' }],
  ...ciReporters,
]

export default defineConfig({
  testDir: './e2e/tests',
  tsconfig: './e2e/tsconfig.json',
  // TEST_SUITE=axe narrows to 08-accessibility only; no testIgnore elsewhere (keeps a11y in regression)
  testMatch: suite === 'axe' ? '**/08-accessibility/**/*.spec.ts' : '**/*.spec.ts',
  grep, // suite + viewport only, not environment
  timeout: 60_000,
  expect: { timeout: 12_000 },
  fullyParallel: true,
  forbidOnly: isCI,
  // PULL_REQUEST (set by smoke.yml) → 0 retries, fail fast
  retries:
    process.env.PLAYWRIGHT_RETRIES !== undefined
      ? Number(process.env.PLAYWRIGHT_RETRIES)
      : process.env.PULL_REQUEST
        ? 0
        : isCI
          ? 2
          : 0,
  workers: process.env.PULL_REQUEST ? 1 : 2,
  reporter: isCI ? ciReporters : localReporters,
  metadata: { environment: environment.label, suite, viewport },
  use: {
    baseURL,
    viewport: { width: 1440, height: 1080 }, // mobile specs set their own via setDeviceMode()
    actionTimeout: 12_000,
    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: process.env.HEADLESS ? process.env.HEADLESS === 'true' : true,
    extraHTTPHeaders,
  },

  // ===========================================================================
  // PROJECTS
  // ===========================================================================
  // browsers only; setup runs the environment-health check first
  projects: [
    {
      name: 'setup',
      testMatch: '**/00-global/environment-health.spec.ts',
      grep: new RegExp(`(?=.*(?:^|\\s)${environment.tag}(?:\\s|$))`),
      metadata: { environment: environment.label },
    },
    {
      name: 'chromium',
      testIgnore: '**/00-global/environment-health.spec.ts',
      dependencies: ['setup'],
      metadata: { environment: environment.label },
      use: {
        browserName: 'chromium',
        launchOptions: { args: ['--disable-session-crashed-bubble', '--no-restore-last-session'] },
      },
    },
    {
      name: 'webkit',
      testIgnore: '**/00-global/environment-health.spec.ts',
      dependencies: ['setup'],
      metadata: { environment: environment.label },
      use: { browserName: 'webkit' },
    },
    {
      name: 'firefox',
      testIgnore: '**/00-global/environment-health.spec.ts',
      dependencies: ['setup'],
      metadata: { environment: environment.label },
      use: { browserName: 'firefox' },
    },
  ],

  // local dev server only — CI always supplies a baseURL
  webServer: isCI
    ? undefined
    : {
        command: 'pnpm dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120_000,
      },
})
