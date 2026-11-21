import { Page, Route, expect } from '@playwright/test'
import { Log } from 'logr-kit'

// =============================================================================
// TEST DATA
// =============================================================================

export const guestCartItem = () => ({
  productId: 'guest-hoodie-001',
  slug:      'guest-hoodie-001',
  name:      `Guest Hoodie ${Date.now()}`,
  size:      'M',
  quantity:  2,
  price:     55000,
  image:     '',
  colorName: '',
})

export const savedCartItem = () => ({
  productId: 'saved-tee-002',
  slug:      'saved-tee-002',
  name:      `Saved Tee ${Date.now()}`,
  size:      'L',
  quantity:  1,
  price:     32000,
  image:     '',
  colorName: '',
})

// =============================================================================
// SELECTOR FACTORY
// =============================================================================

export const cartSelectors = (page: Page) => ({

  page:           page.locator('[data-testid="cart-page"]'),
  empty:          page.locator('[data-testid="cart-empty"]'),
  startShopping:  page.locator('[data-testid="cart-start-shopping"]'),
  items:          page.locator('[data-testid="cart-item"]'),
  itemName:       page.locator('[data-testid="cart-item-name"]'),
  itemSize:       page.locator('[data-testid="cart-item-size"]'),
  itemQty:        page.locator('[data-testid="cart-item-qty"]'),
  itemRemove:     page.locator('[data-testid="cart-item-remove"]'),
  qtyDecrement:   page.locator('[data-testid="cart-quantity-decrement"]'),
  qtyIncrement:   page.locator('[data-testid="cart-quantity-increment"]'),
  subtotal:       page.locator('[data-testid="cart-subtotal"]'),
  checkoutButton: page.locator('[data-testid="cart-checkout-button"]'),
  navCartCount:   page.locator('[data-testid="nav-cart-count"]'),

})

// =============================================================================
// ACTIONS
// =============================================================================

export const navigate = async (page: Page, baseURL: string) => {
  Log.navigate(`${baseURL}/cart`)
  await page.goto(`${baseURL}/cart`, { waitUntil: 'domcontentloaded' })
}

// localStorage can't be touched before some page has loaded (no origin yet),
// so this visits baseURL first. Specs call this, then navigate(), rather than
// clearing storage inline.
export const clearCart = async (page: Page, baseURL: string) => {
  Log.info('clearing the cart before the test')
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => localStorage.removeItem('tomani-cart'))
  Log.ok('cart cleared')
}

export const mockAuthSession = async (page: Page) => {
  Log.info('mocking an authenticated session')
  await page.route('**/api/auth/session', (route: Route) =>
    route.fulfill({
      status:      200,
      contentType: 'application/json',
      body: JSON.stringify({
        user:    { id: 'test-user-001', name: 'Test User', email: 'test@tw-test.com' },
        expires: new Date(Date.now() + 3_600_000).toISOString(),
      }),
    })
  )
  Log.ok('auth session mocked — user authenticated')
}

export const mockMergeApi = async (
  page: Page,
  mergedItems: object[],
  onRequest?: (body: unknown) => void
) => {
  Log.info('mocking the /api/cart/merge endpoint')
  await page.route('**/api/cart/merge', async (route: Route) => {
    if (onRequest) {
      const body = JSON.parse(route.request().postData() ?? '{}')
      onRequest(body)
    }
    await route.fulfill({
      status:      200,
      contentType: 'application/json',
      body:        JSON.stringify(mergedItems),
    })
  })
  Log.ok('/api/cart/merge mocked')
}

export const seedGuestCart = async (page: Page, items = [guestCartItem()]) => {
  Log.info(`seeding the guest cart with ${items.length} item(s)`)
  await page.addInitScript((cartItems) => {
    localStorage.setItem('tomani-cart', JSON.stringify(cartItems))
  }, items)
  Log.ok('guest cart seeded')
}

// =============================================================================
// ASSERTIONS
// =============================================================================

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

export const assertMergePayloadItemCount = (payload: { items: unknown[] } | null, expectedLength: number) => {
  expect(payload).not.toBeNull()
  expect(payload?.items).toHaveLength(expectedLength)
  Log.ok(`merge payload carried ${expectedLength} item(s)`)
}

export const assertMergeApiCalled = async (page: Page) => {
  await expect(page).toHaveURL(/.+/, { timeout: 5_000 }) // let page settle
  const requests = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .filter((e) => e.name.includes('/api/cart/merge'))
      .length
  )
  expect(requests).toBeGreaterThan(0)
  Log.ok('merge API was called')
}

export const assertCartBadgeCount = async (page: Page, expected: number) => {
  const { navCartCount } = cartSelectors(page)
  await expect(navCartCount).toBeVisible()
  await expect(navCartCount).toHaveText(String(expected))
  Log.ok(`cart badge shows ${expected}`)
}

export const assertLocalStorageCart = async (page: Page, expectedLength: number) => {
  // Poll until localStorage reflects the merged state — a one-shot check races React's effect timing
  await expect.poll(
    async () => {
      const items = await page.evaluate(() => {
        const raw = localStorage.getItem('tomani-cart')
        return raw ? (JSON.parse(raw) as unknown[]) : []
      })
      return items.length
    },
    { timeout: 15_000 }
  ).toBe(expectedLength)
  Log.ok(`localStorage has ${expectedLength} cart item(s)`)
}

export const assertMergedQuantity = async (page: Page, productId: string, expectedQty: number) => {
  await expect.poll(
    async () => {
      const items = await page.evaluate(() => {
        const raw = localStorage.getItem('tomani-cart')
        return raw ? JSON.parse(raw) : []
      })
      const item = (items as { productId: string; quantity: number }[]).find(
        (i) => i.productId === productId
      )
      return item?.quantity ?? null
    },
    { timeout: 15_000 }
  ).toBe(expectedQty)
  Log.ok(`${productId} quantity is ${expectedQty}`)
}
