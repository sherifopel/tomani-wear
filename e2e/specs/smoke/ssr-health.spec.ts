import { test, expect } from '../../fixtures/fixtures'

// ─── Routes guarded against SSR crashes and blank pages ──────────────────────
// If a third-party lib (e.g. PostHog, analytics) accesses browser globals
// at module import time it will crash SSR and produce a blank white page for
// first-time visitors. This suite catches that before it reaches real users.
const ROUTES = [
  { name: 'Homepage',   path: '/' },
  { name: 'PLP — Men',  path: '/products?category=men' },
  { name: 'PLP — Women',path: '/products?category=women' },
  { name: 'Cart',       path: '/cart' },
  { name: 'Sign In',    path: '/sign-in' },
] as const

// prettier-ignore
test.describe('SSR health', { tag: ['@tomanni', '@tomanni-smoke'] }, () => {
  for (const route of ROUTES) {
    test(route.name, async ({ page, baseURL }) => {
      // Collect uncaught JS exceptions — an SSR crash surfaces here on load
      const uncaughtErrors: string[] = []
      page.on('pageerror', err => uncaughtErrors.push(err.message))

      await page.goto(`${baseURL}${route.path}`, { waitUntil: 'domcontentloaded' })

      // A blank white page from an SSR crash renders a near-empty body
      const bodyChildCount = await page.evaluate(() => document.body.children.length)
      expect(
        bodyChildCount,
        `${route.name}: page body is empty — possible SSR crash or blank white page`,
      ).toBeGreaterThan(0)

      // No uncaught JS exceptions during load
      expect(
        uncaughtErrors,
        `${route.name}: unexpected JS error(s): ${uncaughtErrors.join(' | ')}`,
      ).toHaveLength(0)
    })
  }
})
