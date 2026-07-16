import { Page, expect } from '@playwright/test'
import { Log } from 'logr-kit'

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  LOCATORS                                                                  ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const pdpSelectors = (page: Page) => ({
  page:         page.locator('[data-testid="pdp-page"]'),
  breadcrumb:   page.locator('[data-testid="pdp-breadcrumb"]'),
  image:        page.locator('[data-testid="pdp-main-image"]'),
  // name and price each appear twice in the DOM (mobile above image + desktop right column).
  // :visible narrows to whichever copy is shown for the current viewport.
  name:         page.locator('[data-testid="pdp-name"]:visible'),
  priceRow:     page.locator('[data-testid="pdp-price-row"]:visible'),
  price:        page.locator('[data-testid="pdp-price"]:visible'),
  comparePrice: page.locator('[data-testid="pdp-compare-price"]:visible'),
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

export const assertNameVisible = async (page: Page) => {
  const { name } = pdpSelectors(page)
  await expect(name).toBeVisible()
  await expect(name).not.toBeEmpty()
  Log.ok('product name visible')
}

export const assertPriceInNaira = async (page: Page) => {
  const { price } = pdpSelectors(page)
  await expect(price).toBeVisible()
  await expect(price).toContainText('₦')
  Log.ok('price in Naira visible')
}

export const assertImageVisible = async (page: Page) => {
  const { image } = pdpSelectors(page)
  await expect(image).toBeVisible()
  Log.ok('product image visible')
}

export const assertDescriptionVisible = async (page: Page) => {
  const { description } = pdpSelectors(page)
  await expect(description).toBeVisible()
  await expect(description).not.toBeEmpty()
  Log.ok('description visible')
}

export const assertBreadcrumbVisible = async (page: Page) => {
  const { breadcrumb } = pdpSelectors(page)
  await expect(breadcrumb).toBeVisible()
  await expect(breadcrumb).toContainText('Home')
  await expect(breadcrumb).toContainText('Products')
  Log.ok('breadcrumb visible')
}

export const clickAddToCart = async (page: Page) => {
  const { addToCart } = pdpSelectors(page)
  await addToCart.click()
  Log.info('clicked Add to Cart')
}

export const assertSizeError = async (page: Page) => {
  const sizeError = page.locator('[data-testid="pdp-size-error"]')
  await expect(sizeError).toBeVisible()
  await expect(sizeError).toContainText('Please select a size first')
  Log.ok('size error shown')
}

export const assertSoldOut = async (page: Page) => {
  const { addToCart } = pdpSelectors(page)
  await expect(addToCart).toBeVisible()
  await expect(addToCart).toContainText(/sold out/i)
  await expect(addToCart).toBeDisabled()
  Log.ok('sold out state confirmed')
}

export const assertNotFoundStatus = async (page: Page, baseURL: string) => {
  const response = await page.goto(`${baseURL}/products/this-product-does-not-exist`, { waitUntil: 'domcontentloaded' })
  expect(response?.status()).toBe(404)
  Log.ok('404 status confirmed for unknown slug')
}

export const assertMobileSmoke = async (page: Page) => {
  const { name, price, image } = pdpSelectors(page)
  await expect(name).toBeVisible()
  await expect(price).toContainText('₦')
  await expect(image).toBeVisible()
  Log.ok('mobile PDP smoke passed')
}
