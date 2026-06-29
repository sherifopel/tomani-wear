import { Page, expect } from '@playwright/test'
import { Log } from 'logr-kit'

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  LOCATORS                                                                  ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const plpSelectors = (page: Page) => ({
  page:    page.locator('[data-testid="plp-page"]'),
  header:  page.locator('[data-testid="plp-header"]'),
  count:   page.locator('[data-testid="plp-count"]'),
  grid:    page.locator('[data-testid="plp-grid"]'),
  empty:   page.locator('[data-testid="plp-empty"]'),
  emptyCta: page.locator('[data-testid="plp-empty-cta"]'),

  cards: {
    all:      page.locator('[data-testid="plp-product-card"]'),
    name:     page.locator('[data-testid="plp-product-name"]').first(),
    price:    page.locator('[data-testid="plp-product-price"]').first(),
    image:    page.locator('[data-testid="plp-product-image"]').first(),
    link:     (slug: string) => page.locator(`[data-testid="plp-product-link-${slug}"]`),
  },
})

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ACTIONS                                                                   ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const navigate = async (page: Page, baseURL: string, category?: string) => {
  const path = category ? `/products?category=${category}` : '/products'
  Log.navigate(`${baseURL}${path}`)
  await page.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded' })
}

export const assertGridVisible = async (page: Page) => {
  Log.section('PLP — product grid')
  const { grid, cards } = plpSelectors(page)
  await expect(grid).toBeVisible()
  Log.ok('grid')
  await expect(cards.all.first()).toBeVisible()
  Log.ok('at least one product card')
  await expect(cards.name).toBeVisible()
  Log.ok('product name')
  await expect(cards.price).toContainText('₦')
  Log.ok('product price in Naira')
}
