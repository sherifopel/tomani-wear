import { Page, expect } from '@playwright/test'

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  LOCATORS                                                                  ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const smokeSelectors = (page: Page) => ({
  page: {
    bodyChildren: page.locator('body > *'),
  },
})

// Module-level WeakMap so each page instance tracks its own uncaught errors.
// WeakMap means the entry is garbage-collected when the page is closed —
// no memory leak across parallel tests.
const pageErrors = new WeakMap<Page, string[]>()

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ACTIONS                                                                   ║
// ╚════════════════════════════════════════════════════════════════════════════╝

// Call this BEFORE navigating — registers the pageerror listener so no errors
// that fire during page load are missed.
export const listenForJSErrors = (page: Page): void => {
  const errors: string[] = []
  pageErrors.set(page, errors)
  page.on('pageerror', err => errors.push(err.message))
}

export const navigateTo = async (page: Page, baseURL: string, path: string): Promise<void> => {
  await page.goto(`${baseURL}${path}`)
  await page.waitForLoadState('domcontentloaded')
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ASSERTIONS                                                                ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const assertPageNotBlank = async (page: Page, routeName: string): Promise<void> => {
  const { page: pageLocators } = smokeSelectors(page)
  await expect(
    pageLocators.bodyChildren,
    `${routeName}: page body has no children — possible SSR crash or blank white page`,
  ).not.toHaveCount(0)
}

// WebKit fires ResizeObserver loop warnings as pageerror events; Chrome ignores them.
// They indicate a resize callback triggered a layout change mid-frame — not an app crash.
const BENIGN_ERRORS = [
  'ResizeObserver loop completed with undelivered notifications',
  'ResizeObserver loop limit exceeded',
]

export const assertNoJSErrors = (page: Page, routeName: string): void => {
  const errors = pageErrors.get(page) ?? []
  const real = errors.filter(msg => !BENIGN_ERRORS.some(b => msg.includes(b)))
  expect(
    real,
    `${routeName}: unexpected JS error(s) on load: ${real.join(' | ')}`,
  ).toHaveLength(0)
}
