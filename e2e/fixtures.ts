import { test as base } from '@playwright/test'
import { logTestStatus } from 'playwright-final-summary-reporter'

/**
 * Extended test fixture that logs a coloured one-liner per test as it completes.
 * Import `test` from this file instead of '@playwright/test' in spec files.
 *
 * Output looks like:
 *   [PREVIEW-XX:Desktop Chrome] - Test(1): hero visible: PASSED ✅  0.42m
 */
export const test = base.extend({})

base.afterEach(async ({ browserName }, testInfo) => {
  const baseURL = testInfo.project.use.baseURL ?? ''
  logTestStatus(getEnvLabel(baseURL), testInfo, browserName)
})

function getEnvLabel(baseURL: string): string {
  if (baseURL.includes('localhost')) return 'LOCAL'
  if (baseURL.includes('vercel.app')) return 'PREVIEW'
  if (baseURL.includes('staging'))   return 'STAGING'
  return 'PROD'
}
