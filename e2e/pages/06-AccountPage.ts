import { Page, expect } from '@playwright/test'
import { Log } from 'logr-kit'

// =============================================================================
// SELECTOR FACTORY
// =============================================================================

export const accountSelectors = (page: Page) => ({

  header: {
    root:           page.locator('[data-testid="account-profile-header"]'),
    avatar:         page.locator('[data-testid="account-avatar"]'),
    avatarInitials: page.locator('[data-testid="account-avatar-initials"]'),
    heading:        page.locator('[data-testid="account-heading"]'),
  },

  cards: {
    orders:    page.locator('[data-testid="account-card-orders"]'),
    addresses: page.locator('[data-testid="account-card-addresses"]'),
    profile:   page.locator('[data-testid="account-card-profile"]'),
  },

  signOutButton: page.locator('[data-testid="account-sign-out-button"]'),

  orders: {
    page:    page.locator('[data-testid="orders-page"]'),
    heading: page.locator('[data-testid="orders-heading"]'),
    list:    page.locator('[data-testid="orders-list"]'),
    items:   page.locator('[data-testid="orders-list-item"]'),
    empty:   page.locator('[data-testid="orders-empty"]'),
  },

  orderDetail: {
    page:    page.locator('[data-testid="order-detail-page"]'),
    heading: page.locator('[data-testid="order-detail-heading"]'),
    status:  page.locator('[data-testid="order-detail-status"]'),
    items:   page.locator('[data-testid="order-detail-item"]'),
    total:   page.locator('[data-testid="order-detail-total"]'),
    address: page.locator('[data-testid="order-detail-address"]'),
    back:    page.locator('[data-testid="order-detail-back"]'),
  },

})

// =============================================================================
// ACTIONS
// =============================================================================

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

export const clickOrdersCard = async (page: Page) => {
  const { cards } = accountSelectors(page)
  Log.info('clicking the orders nav card')
  await expect(cards.orders).toBeVisible()
  await cards.orders.click()
  Log.ok('orders card clicked')
}

export const clickFirstOrderItem = async (page: Page) => {
  const { orders } = accountSelectors(page)
  Log.info('clicking the first order in the list')
  await expect(orders.items.first()).toBeVisible()
  await orders.items.first().click()
  Log.ok('first order clicked')
}

export const clickOrderDetailBack = async (page: Page) => {
  const { orderDetail } = accountSelectors(page)
  Log.info('clicking the order detail back link')
  await expect(orderDetail.back).toBeVisible()
  await orderDetail.back.click()
  Log.ok('back link clicked')
}

// =============================================================================
// ASSERTIONS
// =============================================================================

export const assertProfileVisible = async (page: Page) => {
  Log.section('Account — profile header')
  const { header } = accountSelectors(page)
  await expect(header.root).toBeVisible();
  Log.ok('profile header')
  await expect(header.heading).toBeVisible();
  Log.ok('name heading')
}

export const assertCardsVisible = async (page: Page) => {
  Log.section('Account — nav cards')
  const { cards } = accountSelectors(page)
  await expect(cards.orders).toBeVisible();    Log.ok('orders card')
  await expect(cards.addresses).toBeVisible(); Log.ok('addresses card')
  await expect(cards.profile).toBeVisible();   Log.ok('profile card')
}

export const assertOrdersCardNavigatesToOrders = async (page: Page) => {
  await expect(page).toHaveURL(/\/account\/orders/)
  Log.ok('orders card navigates to /account/orders')
}

export const assertSignOutVisible = async (page: Page) => {
  const { signOutButton } = accountSelectors(page)
  await expect(signOutButton).toBeVisible()
  Log.ok('sign out button visible')
}

export const assertRedirectedToSignIn = async (page: Page) => {
  await expect(page).toHaveURL(/\/sign-in/)
  Log.ok('redirected to sign-in')
}

export const assertCallbackUrlPointsToAccount = async (page: Page) => {
  await expect(page).toHaveURL(/callbackUrl=.*account/)
  Log.ok('callbackUrl points back to /account')
}

export const assertOrdersRedirect = async (page: Page) => {
  await expect(page).toHaveURL(/\/sign-in/)
  await expect(page).toHaveURL(/callbackUrl=.*orders/)
  Log.ok('redirected to sign-in with orders callbackUrl')
}

export const assertOrdersCallbackUrl = async (page: Page) => {
  await expect(page).toHaveURL(/callbackUrl=.*account.*orders/)
  Log.ok('callbackUrl points back to /account/orders')
}

export const assertOrderDetailRedirect = async (page: Page) => {
  await expect(page).toHaveURL(/\/sign-in/)
  Log.ok('redirected to sign-in from order detail')
}

export const assertOrdersPageVisible = async (page: Page) => {
  Log.section('Orders — page')
  const { orders } = accountSelectors(page)
  await expect(orders.page).toBeVisible();    Log.ok('orders page')
  await expect(orders.heading).toBeVisible(); Log.ok('orders heading')
  await expect(orders.list).toBeVisible();    Log.ok('orders list')
}

export const assertOrdersEmptyState = async (page: Page) => {
  const { orders } = accountSelectors(page)
  await expect(orders.empty).toBeVisible()
  Log.ok('orders empty state visible')
}

export const assertOrderDetailVisible = async (page: Page) => {
  Log.section('Order detail — page')
  const { orderDetail } = accountSelectors(page)
  await expect(orderDetail.heading).toBeVisible(); Log.ok('order detail heading')
  await expect(orderDetail.status).toBeVisible();  Log.ok('order status')
  await expect(orderDetail.total).toBeVisible();   Log.ok('order total')
}

export const assertBackNavigatesToOrdersList = async (page: Page) => {
  await expect(page).toHaveURL(/\/account\/orders$/)
  Log.ok('back link returned to the orders list')
}
