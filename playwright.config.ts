import { defineConfig, type ReporterDescription } from '@playwright/test'
import type { ReporterOptions } from 'playwright-final-summary-reporter'
import { getRunSettings } from './e2e/utils/environment'

// =============================================================================
// ENVIRONMENT & RUN RESOLUTION
// =============================================================================
// Resolve the run before importing specs. Unknown environments fail closed.
const { environment, suite, viewport, grep } = getRunSettings()
process.env.TEST_ENV = environment.name
const isCI = process.env.CI === 'true' || process.env.CI === '1'

// Vercel preview/dev base URL wins when CI supplies one (the dynamic per-PR
// preview in particular can't live in the static registry below); otherwise
// fall back to the environment's own baseURL. SITE_PATH kept as the reference
// names it, even though nothing in this repo sets it yet.
const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || process.env.SITE_PATH || environment.baseURL

// ─── Vercel deployment protection bypass ────────────────────────────────────
// Project addition, not in the reference (ITS doesn't run on Vercel): when
// running against a Vercel preview/dev URL, send the bypass secret as a
// header so Deployment Protection doesn't block the requests.
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
// Deviation from the reference: CI is `blob` plus three custom reporters
// (testReporter, axeReporter, a Slack reporter) there, because ITS shards and
// merges blob reports across a bigger CI matrix. This repo's CI doesn't
// shard, there's no merge-reports step to consume a blob file, and the
// logger/reporters pass (Stage 1 step 10) hasn't landed a Slack reporter yet
// — so CI and local share the same two custom reporters for now.

export default defineConfig({
  testDir: './e2e/specs',
  tsconfig: './e2e/tsconfig.json',
  // grep is suite + viewport only here, not environment — see the deviation
  // note at the top of e2e/utils/environment.ts.
  grep,
  timeout: 60_000,
  expect: { timeout: 12_000 },
  fullyParallel: true,
  forbidOnly: isCI,
  // Reference expression, substituted: ITS gives its `qa` environment fewer
  // retries than uat/prod after a specific flakiness incident there. Tomani
  // Wear has no equivalent environment-specific history, so every CI run
  // gets the same retry count. PULL_REQUEST is set by smoke.yml (the only
  // PR-triggered workflow) so PR feedback fails fast instead of retrying.
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
    // Desktop is the default; mobile describes set their viewport with
    // setDeviceMode() (see e2e/helpers/utils.ts) — no per-project viewport.
    viewport: { width: 1440, height: 1080 },
    // No storageState yet (reference: undefined for the axe suite, a saved
    // session otherwise). Logged-in sessions are Stage 2 step 24, not started
    // — account.spec.ts and order-history.spec.ts stay skipped until then.
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
  // Browser projects are independent of environment and viewport — specs own
  // viewport overrides via setDeviceMode(). "setup" runs the environment
  // health check first; chromium/webkit/firefox won't start until it passes.
  // It's a single non-viewport-specific test, so its grep only requires the
  // environment tag, not the suite/viewport tags the root `grep` above adds,
  // so it's never accidentally filtered out of a scoped run.
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

  // ─── Local dev server ────────────────────────────────────────────────────
  // Project addition, not in the reference (ITS points at an already-running
  // BigCommerce store). CI always supplies a baseURL (preview/dev/prod), so
  // no local server is started there.
  webServer: isCI
    ? undefined
    : {
        command: 'pnpm dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120_000,
      },
})
