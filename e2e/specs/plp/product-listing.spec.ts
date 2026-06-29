/**
 * Product Listing Page (PLP)
 *
 * Tests the /products page and category filtering via ?category= param.
 * All tests run against the preview deployment — products come from live Sanity data.
 */

import { test, expect } from '../../fixtures'
import * as plpPage from '../../pages/plp.page'
import * as util from '../../utils/utils'

// ─────────────────────────────────────────────────────────────────────────────
// 🖥  DESKTOP
// ─────────────────────────────────────────────────────────────────────────────

test.describe('PLP — product grid', { tag: ['@tomanni', '@plp', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await plpPage.navigate(page, baseURL!)
  })

  test('Should load the products page', async ({ page }) => {
    const { page: plp } = plpPage.plpSelectors(page)
    await expect(plp).toBeVisible()
  })

  test('Should display at least one product card', async ({ page }) => {
    const { cards } = plpPage.plpSelectors(page)
    await expect(cards.all.first()).toBeVisible()
  })

  test('Should show a product name on each card', async ({ page }) => {
    const { cards } = plpPage.plpSelectors(page)
    await expect(cards.name).toBeVisible()
    await expect(cards.name).not.toBeEmpty()
  })

  test('Should show a price in Naira on each card', async ({ page }) => {
    const { cards } = plpPage.plpSelectors(page)
    await expect(cards.price).toBeVisible()
    await expect(cards.price).toContainText('₦')
  })

  test('Should show a product image on each card', async ({ page }) => {
    const { cards } = plpPage.plpSelectors(page)
    await expect(cards.image).toBeVisible()
  })

  test('Should show a product count', async ({ page }) => {
    const { count } = plpPage.plpSelectors(page)
    await expect(count).toBeVisible()
    await expect(count).not.toBeEmpty()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 🔗 NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────

test.describe('PLP — navigation', { tag: ['@tomanni', '@plp', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await plpPage.navigate(page, baseURL!)
  })

  test('Should navigate to the PDP when a product card is clicked', async ({ page, baseURL }) => {
    const { cards } = plpPage.plpSelectors(page)
    await cards.all.first().click()
    await expect(page).not.toHaveURL(`${baseURL}/products`)
    await expect(page.locator('[data-testid="pdp-page"]')).toBeVisible()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 🏷  CATEGORY FILTER
// ─────────────────────────────────────────────────────────────────────────────

test.describe('PLP — category filtering', { tag: ['@tomanni', '@plp', '@desktop'] }, () => {
  test('Should show men products when ?category=men is set', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await plpPage.navigate(page, baseURL!, 'men')
    const { cards, page: plp } = plpPage.plpSelectors(page)
    await expect(plp).toBeVisible()
    await expect(cards.all.first()).toBeVisible()
  })

  test('Should show empty state for a category with no products', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await plpPage.navigate(page, baseURL!, 'this-category-does-not-exist')
    const { empty, emptyCta } = plpPage.plpSelectors(page)
    await expect(empty).toBeVisible()
    await expect(emptyCta).toBeVisible()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 📱 MOBILE
// ─────────────────────────────────────────────────────────────────────────────

test.describe('PLP — mobile', { tag: ['@tomanni', '@plp', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await plpPage.navigate(page, baseURL!)
  })

  test('Should display product cards on mobile', async ({ page }) => {
    const { cards } = plpPage.plpSelectors(page)
    await expect(cards.all.first()).toBeVisible()
  })

  test('Should show price in Naira on mobile', async ({ page }) => {
    const { cards } = plpPage.plpSelectors(page)
    await expect(cards.price).toContainText('₦')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 TOMANNI SMOKE
// ─────────────────────────────────────────────────────────────────────────────

test.describe('PLP smoke — Desktop', { tag: ['@tomanni-smoke', '@plp', '@desktop'] }, () => {
  test('Should render PLP with product grid on desktop', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await plpPage.navigate(page, baseURL!)
    await plpPage.assertGridVisible(page)
  })
})

test.describe('PLP smoke — Mobile', { tag: ['@tomanni-smoke', '@plp', '@mobile'] }, () => {
  test('Should render PLP with product grid on mobile', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await plpPage.navigate(page, baseURL!)
    const { cards } = plpPage.plpSelectors(page)
    await expect(cards.all.first()).toBeVisible()
    await expect(cards.price).toContainText('₦')
  })
})
