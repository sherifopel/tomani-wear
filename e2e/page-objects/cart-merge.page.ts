import { Page, expect } from '@playwright/test'
import { Log } from 'logr-kit'
import type { Route } from '@playwright/test'

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  TEST DATA                                                                 ║
// ╚════════════════════════════════════════════════════════════════════════════╝

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

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  MOCK ROUTES                                                               ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const mockAuthSession = async (page: Page) => {
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
  Log.info('mocked auth session — user authenticated')
}

export const mockMergeApi = async (
  page: Page,
  mergedItems: object[],
  onRequest?: (body: unknown) => void
) => {
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
  Log.info('mocked /api/cart/merge endpoint')
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ACTIONS                                                                   ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const seedGuestCart = async (page: Page, items = [guestCartItem()]) => {
  await page.addInitScript((cartItems) => {
    localStorage.setItem('tomani-cart', JSON.stringify(cartItems))
  }, items)
  Log.info(`seeded guest cart with ${items.length} item(s)`)
}

export const navigate = async (page: Page, baseURL: string) => {
  Log.navigate(baseURL)
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' })
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ASSERTIONS                                                                ║
// ╚════════════════════════════════════════════════════════════════════════════╝

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
  const badge = page.locator('[data-testid="nav-cart-count"]')
  await expect(badge).toBeVisible()
  await expect(badge).toHaveText(String(expected))
  Log.ok(`cart badge shows ${expected}`)
}

export const assertLocalStorageCart = async (page: Page, expectedLength: number) => {
  const items = await page.evaluate(() => {
    const raw = localStorage.getItem('tomani-cart')
    return raw ? JSON.parse(raw) : []
  })
  expect(items).toHaveLength(expectedLength)
  Log.ok(`localStorage has ${expectedLength} cart item(s)`)
}

export const assertMergedQuantity = async (page: Page, productId: string, expectedQty: number) => {
  const items = await page.evaluate(() => {
    const raw = localStorage.getItem('tomani-cart')
    return raw ? JSON.parse(raw) : []
  })
  const item = items.find((i: { productId: string }) => i.productId === productId)
  expect(item).toBeDefined()
  expect(item.quantity).toBe(expectedQty)
  Log.ok(`${productId} quantity is ${expectedQty}`)
}
