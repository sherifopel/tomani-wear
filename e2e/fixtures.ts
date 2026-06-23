import { test as base, expect } from '@playwright/test'
import { logTestStatus, getEnvLabel } from 'playwright-final-summary-reporter'

export const test = base.extend({})

// Print a coloured one-liner after every test: PASSED ✅ / FAILED ❌ / SKIPPED ⚠️
// Works across all spec files automatically — no changes needed per test.
test.afterEach(async ({ browserName }, testInfo) => {
  const baseURL = testInfo.project.use.baseURL ?? ''
  logTestStatus(getEnvLabel(baseURL), testInfo, browserName)
})

export { expect }
