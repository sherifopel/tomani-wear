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

export const assertPageVisible = async (page: Page) => {
  const { page: plp } = plpSelectors(page)
  await expect(plp).toBeVisible()
  Log.ok('PLP page visible')
}

export const assertFirstCardVisible = async (page: Page) => {
  const { cards } = plpSelectors(page)
  await expect(cards.all.first()).toBeVisible()
  Log.ok('first product card visible')
}

export const assertCardNameVisible = async (page: Page) => {
  const { cards } = plpSelectors(page)
  await expect(cards.name).toBeVisible()
  await expect(cards.name).not.toBeEmpty()
  Log.ok('product name visible')
}

export const assertCardPriceInNaira = async (page: Page) => {
  const { cards } = plpSelectors(page)
  await expect(cards.price).toBeVisible()
  await expect(cards.price).toContainText('₦')
  Log.ok('price in Naira visible')
}

export const assertCardImageVisible = async (page: Page) => {
  const { cards } = plpSelectors(page)
  await expect(cards.image).toBeVisible()
  Log.ok('product image visible')
}

export const assertCountVisible = async (page: Page) => {
  const { count } = plpSelectors(page)
  await expect(count).toBeVisible()
  await expect(count).not.toBeEmpty()
  Log.ok('product count visible')
}

export const assertNavigatesToPdp = async (page: Page, baseURL: string) => {
  const { cards } = plpSelectors(page)
  await cards.all.first().click()
  await expect(page).not.toHaveURL(`${baseURL}/products`)
  await expect(page.locator('[data-testid="pdp-page"]')).toBeVisible()
  Log.ok('navigated from PLP to PDP')
}

export const assertCategoryGrid = async (page: Page) => {
  const { page: plp, cards } = plpSelectors(page)
  await expect(plp).toBeVisible()
  await expect(cards.all.first()).toBeVisible()
  Log.ok('category grid visible')
}

export const assertEmptyState = async (page: Page) => {
  const { empty, emptyCta } = plpSelectors(page)
  await expect(empty).toBeVisible()
  await expect(emptyCta).toBeVisible()
  Log.ok('empty state visible')
}

export const assertMobileSmoke = async (page: Page) => {
  const { cards } = plpSelectors(page)
  await expect(cards.all.first()).toBeVisible()
  await expect(cards.price).toContainText('₦')
  Log.ok('mobile PLP smoke passed')
}
