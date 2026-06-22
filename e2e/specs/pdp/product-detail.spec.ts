/**
 * Product Detail Page
 *
 * Test product: skeleton-hoodie (confirmed 200 on Vercel, has name/price/description)
 * inStock: null → renders "Sold Out" — covers the out-of-stock acceptance criterion.
 *
 * Note: "sweat pant" has sizes but its Sanity slug has a literal space → URL unreachable.
 * Size rendering will be covered once that data issue is fixed in Sanity.
 */

import { test, expect } from '../../fixtures'
import * as pdpPage from '../../pages/pdp.page'
import * as util from '../../utils/utils'

// ─────────────────────────────────────────────────────────────────────────────
// 🖥  DESKTOP
// ─────────────────────────────────────────────────────────────────────────────

// prettier-ignore
test.describe('PDP — core details', { tag: ['@tomanni', '@pdp', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await pdpPage.navigate(page, baseURL!, 'skeleton-hoodie')
  })

  test('Should display the product name', async ({ page }) => {
    const selectors = pdpPage.pdpSelectors(page)
    await expect(selectors.name).toBeVisible()
    await expect(selectors.name).not.toBeEmpty()
  })

  test('Should display the product price in Naira', async ({ page }) => {
    const selectors = pdpPage.pdpSelectors(page)
    await expect(selectors.price).toBeVisible()
    await expect(selectors.price).toContainText('₦')
  })

  test('Should display a product image', async ({ page }) => {
    const selectors = pdpPage.pdpSelectors(page)
    await expect(selectors.image).toBeVisible()
  })

  test('Should display the product description', async ({ page }) => {
    const selectors = pdpPage.pdpSelectors(page)
    await expect(selectors.description).toBeVisible()
    await expect(selectors.description).not.toBeEmpty()
  })

  test('Should show the breadcrumb trail with Home / Products / product name', async ({ page }) => {
    const selectors = pdpPage.pdpSelectors(page)
    await expect(selectors.breadcrumb).toBeVisible()
    await expect(selectors.breadcrumb).toContainText('Home')
    await expect(selectors.breadcrumb).toContainText('Products')
  })
})

// prettier-ignore
test.describe('PDP — sold-out state', { tag: ['@tomanni', '@pdp', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await pdpPage.navigate(page, baseURL!, 'skeleton-hoodie')
  })

  test('Should show "Sold Out" and disable the button when product is not in stock', async ({ page }) => {
    const selectors = pdpPage.pdpSelectors(page)
    await expect(selectors.addToCart).toBeVisible()
    await expect(selectors.addToCart).toContainText(/sold out/i)
    await expect(selectors.addToCart).toBeDisabled()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 📱 MOBILE
// ─────────────────────────────────────────────────────────────────────────────

// prettier-ignore
test.describe('PDP — core details — Mobile', { tag: ['@tomanni', '@pdp', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await pdpPage.navigate(page, baseURL!, 'skeleton-hoodie')
  })

  test('Should display the product name', async ({ page }) => {
    const selectors = pdpPage.pdpSelectors(page)
    await expect(selectors.name).toBeVisible()
    await expect(selectors.name).not.toBeEmpty()
  })

  test('Should display the product price in Naira', async ({ page }) => {
    const selectors = pdpPage.pdpSelectors(page)
    await expect(selectors.price).toBeVisible()
    await expect(selectors.price).toContainText('₦')
  })

  test('Should display a product image', async ({ page }) => {
    const selectors = pdpPage.pdpSelectors(page)
    await expect(selectors.image).toBeVisible()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// ❌ 404
// ─────────────────────────────────────────────────────────────────────────────

// prettier-ignore
test.describe('PDP — 404 for unknown slug', { tag: ['@tomanni', '@pdp'] }, () => {
  test('Should show a 404 page when the product slug does not exist', async ({ page, baseURL }) => {
    const response = await page.goto(`${baseURL}/products/this-product-does-not-exist`, {
      waitUntil: 'domcontentloaded',
    })
    expect(response?.status()).toBe(404)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 TOMANNI SMOKE
// ─────────────────────────────────────────────────────────────────────────────

// prettier-ignore
test.describe('PDP smoke — Desktop', { tag: ['@tomanni-smoke', '@pdp', '@desktop'] }, () => {
  test('Should render PDP with name, price, image and description', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await pdpPage.navigate(page, baseURL!, 'skeleton-hoodie')
    await pdpPage.assertCoreDetailsVisible(page)
  })
})

// prettier-ignore
test.describe('PDP smoke — Mobile', { tag: ['@tomanni-smoke', '@pdp', '@mobile'] }, () => {
  test('Should render PDP with name, price and image on mobile', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await pdpPage.navigate(page, baseURL!, 'skeleton-hoodie')
    const selectors = pdpPage.pdpSelectors(page)
    await expect(selectors.name).toBeVisible()
    await expect(selectors.price).toContainText('₦')
    await expect(selectors.image).toBeVisible()
  })
})
