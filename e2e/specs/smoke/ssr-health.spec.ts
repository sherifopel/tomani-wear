import { test }      from '../../fixtures/fixtures'
import * as smokePage from '../../page-objects/smoke.page'

// ─── Routes to guard against SSR crashes ─────────────────────────────────────
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
test.describe('SSR health — key routes render without JS crashes', { tag: ['@tomanni', '@smoke'] }, () => {
  for (const route of ROUTES) {
    test(`Should render ${route.name} without a blank page or JS error`, async ({ page, baseURL }) => {
      smokePage.listenForJSErrors(page)
      await smokePage.navigateTo(page, baseURL!, route.path)
      await smokePage.assertPageNotBlank(page, route.name)
      smokePage.assertNoJSErrors(page, route.name)
    })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 TOMANNI SMOKE
// ─────────────────────────────────────────────────────────────────────────────

// prettier-ignore
test.describe('SSR health Smoke', { tag: ['@tomanni-smoke', '@smoke'] }, () => {
  test('Should render Homepage without a blank page or JS error', async ({ page, baseURL }) => {
    smokePage.listenForJSErrors(page)
    await smokePage.navigateTo(page, baseURL!, '/')
    await smokePage.assertPageNotBlank(page, 'Homepage')
    smokePage.assertNoJSErrors(page, 'Homepage')
  })
})
