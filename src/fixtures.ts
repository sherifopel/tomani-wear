import { test as base, expect } from '@playwright/test'

// Auto-clear the localStorage cart after every test so items never accumulate
// between runs — especially important when tests share a logged-in account.
export const test = base.extend({
  page: async ({ page }, use) => {
    await use(page)
    await page.evaluate(() => localStorage.removeItem('tomani-cart'))
  },
})

export { expect }
