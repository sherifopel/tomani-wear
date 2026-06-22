import { Page, expect } from '@playwright/test'

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  LOCATORS                                                                  ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const pdpSelectors = (page: Page) => ({
  page:         page.locator('[data-testid="pdp-page"]'),
  breadcrumb:   page.locator('[data-testid="pdp-breadcrumb"]'),
  image:        page.locator('[data-testid="pdp-image"]'),
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
  await page.goto(`${baseURL}/products/${slug}`, { waitUntil: 'domcontentloaded' })
}

export const assertCoreDetailsVisible = async (page: Page) => {
  const s = pdpSelectors(page)
  await expect(s.name).toBeVisible()
  await expect(s.price).toBeVisible()
  await expect(s.image).toBeVisible()
  await expect(s.description).toBeVisible()
}

export const assertSizesVisible = async (page: Page, sizes: string[]) => {
  const s = pdpSelectors(page)
  await expect(s.sizeSelector).toBeVisible()
  for (const size of sizes) {
    await expect(s.sizeButton(size)).toBeVisible()
  }
}

export const selectSize = async (page: Page, size: string) => {
  const s = pdpSelectors(page)
  await s.sizeButton(size).click()
  await expect(s.sizeButton(size)).toHaveClass(/bg-black/)
}
