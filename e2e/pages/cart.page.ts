import { Page, expect } from '@playwright/test'

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
  await page.goto(`${baseURL}/cart`, { waitUntil: 'domcontentloaded' })
}

/** Navigate to a PDP, select the first available size, and click Add to Cart */
export const addProductToCart = async (page: Page, baseURL: string, slug: string) => {
  await page.goto(`${baseURL}/products/${slug}`, { waitUntil: 'domcontentloaded' })
  // Click the first available size button
  const firstSize = page.locator('[data-testid^="pdp-size-"]').first()
  await firstSize.click()
  await page.locator('[data-testid="pdp-add-to-cart"]').click()
  // Wait for the "✓ Added" feedback so we know the dispatch happened
  await expect(page.locator('[data-testid="pdp-add-to-cart"]')).toContainText(/added/i, { timeout: 3000 })
}
