import { test as base, expect } from '@playwright/test'
import * as Barrel from './index'

// =============================================================================
// TYPES
// =============================================================================

type CustomFixtures = {
  accessibilityPage: typeof Barrel.accessibilityPage
  account: typeof Barrel.account
  cart: typeof Barrel.cart
  checkout: typeof Barrel.checkout
  home: typeof Barrel.home
  journey: typeof Barrel.journey
  notFoundPage: typeof Barrel.notFoundPage
  pdp: typeof Barrel.pdp
  plp: typeof Barrel.plp
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
  // context) explicitly at the call site, e.g. home.openMobileMenu(page).
  accessibilityPage: async ({}, use) => { await use(Barrel.accessibilityPage) },
  account: async ({}, use) => { await use(Barrel.account) },
  cart: async ({}, use) => { await use(Barrel.cart) },
  checkout: async ({}, use) => { await use(Barrel.checkout) },
  home: async ({}, use) => { await use(Barrel.home) },
  journey: async ({}, use) => { await use(Barrel.journey) },
  notFoundPage: async ({}, use) => { await use(Barrel.notFoundPage) },
  pdp: async ({}, use) => { await use(Barrel.pdp) },
  plp: async ({}, use) => { await use(Barrel.plp) },
  smokePage: async ({}, use) => { await use(Barrel.smokePage) },
})

export { expect }
