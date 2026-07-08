import { Page, expect } from '@playwright/test'
import { Log } from 'logr-kit'

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  LOCATORS                                                                  ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const accountSelectors = (page: Page) => ({
  // ── Profile header ──────────────────────────────────────────────────────────
  header: {
    root:           page.locator('[data-testid="account-profile-header"]'),
    avatar:         page.locator('[data-testid="account-avatar"]'),
    avatarInitials: page.locator('[data-testid="account-avatar-initials"]'),
    heading:        page.locator('[data-testid="account-heading"]'),
  },

  // ── Nav cards ───────────────────────────────────────────────────────────────
  cards: {
    orders:    page.locator('[data-testid="account-card-orders"]'),
    addresses: page.locator('[data-testid="account-card-addresses"]'),
    profile:   page.locator('[data-testid="account-card-profile"]'),
  },

  // ── Sign out ─────────────────────────────────────────────────────────────────
  signOutButton: page.locator('[data-testid="account-sign-out-button"]'),
})

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ACTIONS                                                                   ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const navigate = async (page: Page, baseURL: string) => {
  Log.navigate(`${baseURL}/account`)
  await page.goto(`${baseURL}/account`, { waitUntil: 'domcontentloaded' })
}

export const navigateToOrders = async (page: Page, baseURL: string) => {
  Log.navigate(`${baseURL}/account/orders`)
  await page.goto(`${baseURL}/account/orders`, { waitUntil: 'domcontentloaded' })
}

export const navigateToOrderDetail = async (page: Page, baseURL: string, orderId: string) => {
  Log.navigate(`${baseURL}/account/orders/${orderId}`)
  await page.goto(`${baseURL}/account/orders/${orderId}`, { waitUntil: 'domcontentloaded' })
}

export const assertProfileVisible = async (page: Page) => {
  Log.section('Account — profile header')
  const { header } = accountSelectors(page)
  await expect(header.root).toBeVisible();    Log.ok('profile header')
  await expect(header.heading).toBeVisible(); Log.ok('name heading')
}

export const assertCardsVisible = async (page: Page) => {
  Log.section('Account — nav cards')
  const { cards } = accountSelectors(page)
  await expect(cards.orders).toBeVisible();    Log.ok('orders card')
  await expect(cards.addresses).toBeVisible(); Log.ok('addresses card')
  await expect(cards.profile).toBeVisible();   Log.ok('profile card')
}

export const assertOrdersCardNavigates = async (page: Page) => {
  const { cards } = accountSelectors(page)
  await cards.orders.click()
  await expect(page).toHaveURL(/\/account\/orders/)
  Log.ok('orders card navigates to /account/orders')
}

export const assertSignOutVisible = async (page: Page) => {
  const { signOutButton } = accountSelectors(page)
  await expect(signOutButton).toBeVisible()
  Log.ok('sign out button visible')
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ORDER HISTORY SELECTORS + ASSERTIONS                                      ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const ordersSelectors = (page: Page) => ({
  page:       page.locator('[data-testid="orders-page"]'),
  heading:    page.locator('[data-testid="orders-heading"]'),
  list:       page.locator('[data-testid="orders-list"]'),
  items:      page.locator('[data-testid="orders-list-item"]'),
  empty:      page.locator('[data-testid="orders-empty"]'),
})

export const orderDetailSelectors = (page: Page) => ({
  page:       page.locator('[data-testid="order-detail-page"]'),
  heading:    page.locator('[data-testid="order-detail-heading"]'),
  status:     page.locator('[data-testid="order-detail-status"]'),
  items:      page.locator('[data-testid="order-detail-item"]'),
  total:      page.locator('[data-testid="order-detail-total"]'),
  address:    page.locator('[data-testid="order-detail-address"]'),
  back:       page.locator('[data-testid="order-detail-back"]'),
})

export const assertOrdersRedirect = async (page: Page) => {
  await expect(page).toHaveURL(/\/sign-in/)
  await expect(page).toHaveURL(/callbackUrl=.*orders/)
  Log.ok('redirected to sign-in with orders callbackUrl')
}

export const assertOrderDetailRedirect = async (page: Page) => {
  await expect(page).toHaveURL(/\/sign-in/)
  Log.ok('redirected to sign-in from order detail')
}
