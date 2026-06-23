import { Page, expect } from '@playwright/test'
import { Log } from 'logr-kit'

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  LOCATORS                                                                  ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const pdpSelectors = (page: Page) => ({
  page:         page.locator('[data-testid="pdp-page"]'),
  breadcrumb:   page.locator('[data-testid="pdp-breadcrumb"]'),
  image:        page.locator('[data-testid="pdp-main-image"]'),
  name:         page.locator('[data-testid="pdp-name"]'),
  priceRow:     page.locator('[data-testid="pdp-price-row"]'),
  price:        page.locator('[data-testid="pdp-price"]'),
  comparePrice: page.locator('[data-testid="pdp-compare-price"]'),
  saleBadge:    page.locator('[data-testid="pdp-sale-badge"]'),
  description:  page.locator('[data-testid="pdp-description"]'),
  sizeSelector: page.locator('[data-testid="pdp-size-selector"]'),
  addToCart:    page.locator('[data-testid="pdp-add-to-cart"]'),
  sizeButton:   (size: string) => page.locator(`[data-testid="pdp-size-${size}"]`),
})

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ACTIONS                                                                   ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const navigate = async (page: Page, baseURL: string, slug: string) => {
  Log.navigate(`${baseURL}/products/${slug}`)
  await page.goto(`${baseURL}/products/${slug}`, { waitUntil: 'domcontentloaded' })
}

export const assertCoreDetailsVisible = async (page: Page) => {
  Log.section('PDP — core details')
  const selectors = pdpSelectors(page)
  await expect(selectors.name).toBeVisible()
  Log.ok('name')
  await expect(selectors.price).toBeVisible()
  Log.ok('price')
  await expect(selectors.image).toBeVisible()
  Log.ok('image')
  await expect(selectors.description).toBeVisible()
  Log.ok('description')
}

export const assertSizesVisible = async (page: Page, sizes: string[]) => {
  Log.section('PDP — sizes')
  const selectors = pdpSelectors(page)
  await expect(selectors.sizeSelector).toBeVisible()
  Log.ok('size selector')
  for (const size of sizes) {
    await expect(selectors.sizeButton(size)).toBeVisible()
    Log.ok(`size ${size}`)
  }
}

export const selectSize = async (page: Page, size: string) => {
  const selectors = pdpSelectors(page)
  await selectors.sizeButton(size).click()
  await expect(selectors.sizeButton(size)).toHaveClass(/bg-black/)
  Log.info(`selected size: ${size}`)
}
