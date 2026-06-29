/**
 * 404 — Not Found page
 *
 * Regression: the default Next.js 404 had no navbar or footer.
 * root not-found.tsx only gets the root layout (not the store layout),
 * so Navbar/Footer must be imported directly into the page.
 * These tests lock that in — if either disappears, CI fails.
 */

import { test, expect } from '../../fixtures'
import * as util from '../../utils/utils'

const BROKEN_URL = '/this-page-does-not-exist-at-all'

// ─────────────────────────────────────────────────────────────────────────────
// 🖥  DESKTOP
// ─────────────────────────────────────────────────────────────────────────────

test.describe('404 page — desktop', { tag: ['@tomanni', '@not-found', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await page.goto(`${baseURL}${BROKEN_URL}`, { waitUntil: 'domcontentloaded' })
  })

  test('Should show the 404 page content', async ({ page }) => {
    await expect(page.locator('[data-testid="not-found-page"]')).toBeVisible()
    await expect(page.locator('[data-testid="not-found-heading"]')).toBeVisible()
    await expect(page.locator('[data-testid="not-found-message"]')).toBeVisible()
  })

  // Regression: navbar was missing because root not-found.tsx bypasses store layout
  test('Should show the navbar with logo', async ({ page }) => {
    await expect(page.locator('[data-testid="nav-logo-link"]')).toBeVisible()
  })

  // Regression: footer was missing for the same reason
  test('Should show the footer', async ({ page }) => {
    await expect(page.locator('[data-testid="footer"]')).toBeVisible()
  })

  test('Should show the breadcrumb', async ({ page }) => {
    await expect(page.locator('[data-testid="not-found-breadcrumb"]')).toBeVisible()
  })

  test('Back to Home CTA should link to /', async ({ page, baseURL }) => {
    await page.locator('[data-testid="not-found-home-cta"]').click()
    await expect(page).toHaveURL(`${baseURL}/`)
  })

  test('Shop All CTA should link to /products', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}${BROKEN_URL}`, { waitUntil: 'domcontentloaded' })
    await page.locator('[data-testid="not-found-shop-cta"]').click()
    await expect(page).toHaveURL(`${baseURL}/products`)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 📱 MOBILE
// ─────────────────────────────────────────────────────────────────────────────

test.describe('404 page — mobile', { tag: ['@tomanni', '@not-found', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await page.goto(`${baseURL}${BROKEN_URL}`, { waitUntil: 'domcontentloaded' })
  })

  test('Should show navbar and footer on mobile', async ({ page }) => {
    await expect(page.locator('[data-testid="nav-logo-link"]')).toBeVisible()
    await expect(page.locator('[data-testid="footer"]')).toBeVisible()
  })

  test('Should show the 404 heading on mobile', async ({ page }) => {
    await expect(page.locator('[data-testid="not-found-heading"]')).toBeVisible()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 TOMANNI SMOKE
// ─────────────────────────────────────────────────────────────────────────────

test.describe('404 smoke', { tag: ['@tomanni-smoke', '@not-found'] }, () => {
  test('Should show navbar, 404 content and footer on an unknown URL', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await page.goto(`${baseURL}${BROKEN_URL}`, { waitUntil: 'domcontentloaded' })
    await expect(page.locator('[data-testid="nav-logo-link"]')).toBeVisible()
    await expect(page.locator('[data-testid="not-found-heading"]')).toBeVisible()
    await expect(page.locator('[data-testid="footer"]')).toBeVisible()
  })
})
