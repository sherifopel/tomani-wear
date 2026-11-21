import { test as base, expect } from '@playwright/test'
import * as Barrel from './index'

// =============================================================================
// TYPES
// =============================================================================

type CustomFixtures = {
  accessibilityPage: typeof Barrel.accessibilityPage
  accountPage: typeof Barrel.accountPage
  cartPage: typeof Barrel.cartPage
  cartMergePage: typeof Barrel.cartMergePage
  checkoutPage: typeof Barrel.checkoutPage
  headerPage: typeof Barrel.headerPage
  homePage: typeof Barrel.homePage
  notFoundPage: typeof Barrel.notFoundPage
  pdpPage: typeof Barrel.pdpPage
  plpPage: typeof Barrel.plpPage
  smokePage: typeof Barrel.smokePage
}

// =============================================================================
// FIXTURE DEFINITIONS
// =============================================================================

export const test = base.extend<CustomFixtures>({
  // ─── Augmented page: clears the cart between tests ──────────────────────────
  // Auto-clear the localStorage cart after every test so items never
  // accumulate between runs — especially important when tests share a
  // logged-in account. Substitution for the reference's API-based
  // `cartCleanup` fixture: Tomani's cart lives in localStorage, not a
  // session tied to a BigCommerce pool account.
  page: async ({ page }, use) => {
    await use(page)
    // Guard: page may be on about:blank (e.g. test skipped before navigation) —
    // WebKit throws SecurityError for localStorage on about:blank.
    await page.evaluate(() => {
      try { localStorage.removeItem('tomani-cart') } catch {}
    }).catch(() => {})
  },

  // ─── Page object fixtures — raw module passthrough ───────────────────────────
  // One per barrel export, same name. Specs pass `page` (and any other
  // context) explicitly at the call site, e.g. headerPage.openMobileMenu(page).
  accessibilityPage: async ({}, use) => { await use(Barrel.accessibilityPage) },
  accountPage: async ({}, use) => { await use(Barrel.accountPage) },
  cartPage: async ({}, use) => { await use(Barrel.cartPage) },
  cartMergePage: async ({}, use) => { await use(Barrel.cartMergePage) },
  checkoutPage: async ({}, use) => { await use(Barrel.checkoutPage) },
  headerPage: async ({}, use) => { await use(Barrel.headerPage) },
  homePage: async ({}, use) => { await use(Barrel.homePage) },
  notFoundPage: async ({}, use) => { await use(Barrel.notFoundPage) },
  pdpPage: async ({}, use) => { await use(Barrel.pdpPage) },
  plpPage: async ({}, use) => { await use(Barrel.plpPage) },
  smokePage: async ({}, use) => { await use(Barrel.smokePage) },
})

export { expect }
