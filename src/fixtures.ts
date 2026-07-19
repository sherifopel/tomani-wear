import { test as base, expect } from '@playwright/test'

// Auto-clear the localStorage cart after every test so items never accumulate
// between runs — especially important when tests share a logged-in account.
export const test = base.extend({
  page: async ({ page }, use) => {
    await use(page)
    // Guard: page may be on about:blank (e.g. test skipped before navigation) —
    // WebKit throws SecurityError for localStorage on about:blank.
    await page.evaluate(() => {
      try { localStorage.removeItem('tomani-cart') } catch {}
    }).catch(() => {})
  },
})

export { expect }
