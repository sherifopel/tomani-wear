import { Page, expect } from '@playwright/test'
import { Log } from 'logr-kit'

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  LOCATORS                                                                  ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const cartSelectors = (page: Page) => ({
  page:            page.locator('[data-testid="cart-page"]'),
  empty:           page.locator('[data-testid="cart-empty"]'),
  startShopping:   page.locator('[data-testid="cart-start-shopping"]'),
  items:           page.locator('[data-testid="cart-item"]'),
  itemName:        page.locator('[data-testid="cart-item-name"]'),
  itemSize:        page.locator('[data-testid="cart-item-size"]'),
  itemQty:         page.locator('[data-testid="cart-item-qty"]'),
  itemRemove:      page.locator('[data-testid="cart-item-remove"]'),
  qtyDecrement:    page.locator('[data-testid="cart-quantity-decrement"]'),
  qtyIncrement:    page.locator('[data-testid="cart-quantity-increment"]'),
  subtotal:        page.locator('[data-testid="cart-subtotal"]'),
  checkoutButton:  page.locator('[data-testid="cart-checkout-button"]'),
  navCartCount:    page.locator('[data-testid="nav-cart-count"]'),
})

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ACTIONS                                                                   ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const navigate = async (page: Page, baseURL: string) => {
  Log.navigate(`${baseURL}/cart`)
  await page.goto(`${baseURL}/cart`, { waitUntil: 'domcontentloaded' })
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ASSERTIONS                                                                ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const assertEmptyState = async (page: Page) => {
  const { empty } = cartSelectors(page)
  await expect(empty).toBeVisible()
  Log.ok('empty cart state visible')
}

export const assertStartShoppingLink = async (page: Page) => {
  const { startShopping } = cartSelectors(page)
  await expect(startShopping).toBeVisible()
  await expect(startShopping).toHaveAttribute('href', '/products')
  Log.ok('start shopping link visible with correct href')
}

/** Navigate to a PDP, select the first available size, and click Add to Cart */
export const addProductToCart = async (page: Page, baseURL: string, slug: string) => {
  Log.navigate(`${baseURL}/products/${slug}`)
  await page.goto(`${baseURL}/products/${slug}`, { waitUntil: 'domcontentloaded' })
  const firstSize = page.locator('[data-testid^="pdp-size-"]').first()
  await firstSize.click()
  Log.info('selected first available size')
  await page.locator('[data-testid="pdp-add-to-cart"]').click()
  await expect(page.locator('[data-testid="pdp-add-to-cart"]')).toContainText(/added/i, { timeout: 3000 })
  Log.ok('product added to cart')
}
