import { test } from '../../src/fixtures'

// Cross-page SSR/blank-page and JS-error checks across several routes at
// once — not any one journey's behaviour, so it lives in 00-global/
// alongside environment-health.spec.ts. Same exception: no viewport split.

// =============================================================================
// GLOBAL REGRESSION COVERAGE
// =============================================================================

// An SSR crash (e.g. a third-party lib touching browser globals at import time)
// produces a blank white page for first-time visitors. These tests catch that.
const ROUTES = [
  { name: 'Homepage',    path: '/' },
  { name: 'PLP — Men',   path: '/products?category=men' },
  { name: 'PLP — Women', path: '/products?category=women' },
  { name: 'Cart',        path: '/cart' },
  { name: 'Sign In',     path: '/sign-in' },
] as const

// prettier-ignore
test.describe('SSR health — key routes render without JS crashes', { tag: ['@global'] }, () => {
  for (const route of ROUTES) {
    test(`Should render ${route.name} without a blank page or JS error`, async ({ page, baseURL, global }) => {
      global.listenForJSErrors(page)
      await global.navigateTo(page, baseURL!, route.path)
      await global.assertPageNotBlank(page, route.name)
      global.assertNoJSErrors(page, route.name)
    })
  }
})

// =============================================================================
// SMOKE COVERAGE
// =============================================================================

// prettier-ignore
test.describe('SSR Health — Smoke', { tag: ['@global', '@smoke'] }, () => {
  test('Should render Homepage without a blank page or JS error', async ({ page, baseURL, global }) => {
    global.listenForJSErrors(page)
    await global.navigateTo(page, baseURL!, '/')
    await global.assertPageNotBlank(page, 'Homepage')
    global.assertNoJSErrors(page, 'Homepage')
  })
})
