import { test, expect } from '../../src/fixtures'
import { Log }           from 'logr-kit'

// =============================================================================
// ENVIRONMENT HEALTH (setup project)
// =============================================================================
// Reference: product-inventory-health.spec.ts, substituted per the reference's
// own table — BigCommerce has a catalog to check for stock corruption on
// every run; Tomani Wear doesn't, so the project-specific preflight is a
// plain "does the environment under test respond" check instead.
//
// Runs as the `setup` project in playwright.config.ts: chromium/webkit/
// firefox all depend on it, so a dead environment fails fast with one clear
// result instead of every spec timing out individually. Read only, no data
// changes.

test.describe('Environment health', { tag: ['@local', '@dev', '@prod'] }, () => {
  test('Should respond with a successful status', async ({ page, baseURL }) => {
    Log.info(`Checking ${baseURL} responds before running the suite`)
    const response = await page.goto(baseURL!, { waitUntil: 'domcontentloaded' })
    expect(response?.ok(), `Expected ${baseURL} to respond with a 2xx status`).toBeTruthy()
    Log.ok(`${baseURL} is up`)
  })
})
