import { test } from '../../src/fixtures'
import * as util from '../../helpers/utils'

// =============================================================================
// DESKTOP REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Order History — Desktop', { tag: ['@account', '@orders', '@desktop'] }, () => {
  test.beforeEach(async ({ page }) => {
    await util.setDeviceMode(page, 'desktop')
  })

  test('Orders list redirects to /sign-in when not logged in', async ({ page, baseURL, account }) => {
    await account.navigateToOrders(page, baseURL!)
    await account.assertOrdersRedirect(page)
  })

  test('Orders list includes callbackUrl pointing back to /account/orders', async ({ page, baseURL, account }) => {
    await account.navigateToOrders(page, baseURL!)
    await account.assertOrdersCallbackUrl(page)
  })

  test('Order detail redirects to /sign-in when not logged in', async ({ page, baseURL, account }) => {
    await account.navigateToOrderDetail(page, baseURL!, 'fake-order-id-123')
    await account.assertOrderDetailRedirect(page)
  })

  // Skipped until auth storageState setup is configured (see TW-38)
  test.skip('Orders page renders heading and list', async ({ page, baseURL, account }) => {
    await account.navigateToOrders(page, baseURL!)
    await account.assertOrdersPageVisible(page)
  })

  test.skip('Empty state shows when user has no orders', async ({ page, baseURL, account }) => {
    await account.navigateToOrders(page, baseURL!)
    await account.assertOrdersEmptyState(page)
  })

  test.skip('Order detail page renders order number, status and items', async ({ page, baseURL, account }) => {
    await account.navigateToOrders(page, baseURL!)
    await account.clickFirstOrderItem(page)
    await account.assertOrderDetailVisible(page)
  })

  test.skip('Back link returns to order list', async ({ page, baseURL, account }) => {
    await account.navigateToOrders(page, baseURL!)
    await account.clickFirstOrderItem(page)
    await account.clickOrderDetailBack(page)
    await account.assertBackNavigatesToOrdersList(page)
  })
})

// =============================================================================
// MOBILE REGRESSION COVERAGE
// =============================================================================

// Only the unauthenticated-redirect check has a Mobile variant today. The four
// authenticated-view tests above are all skipped pending TW-38 (no real order
// content to render yet) — duplicating skip-only placeholders for mobile before
// there's real content to look at would just be declared-count padding, not
// coverage. Design the Mobile authenticated set once TW-38 unblocks the
// Desktop ones and there's an actual UI to verify against.

// prettier-ignore
test.describe('Order History — Mobile', { tag: ['@account', '@orders', '@mobile'] }, () => {
  test('Mobile — orders list redirects to /sign-in', async ({ page, baseURL, account }) => {
    await util.setDeviceMode(page, 'mobile')
    await account.navigateToOrders(page, baseURL!)
    await account.assertRedirectedToSignIn(page)
  })
})

// =============================================================================
// SMOKE COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Order History — Smoke — Desktop', { tag: ['@account', '@orders', '@desktop', '@smoke'] }, () => {
  test('Should redirect unauthenticated visitors away from order history', async ({ page, baseURL, account }) => {
    await util.setDeviceMode(page, 'desktop')
    await account.navigateToOrders(page, baseURL!)
    await account.assertOrdersRedirect(page)
  })
})

// prettier-ignore
test.describe('Order History — Smoke — Mobile', { tag: ['@account', '@orders', '@mobile', '@smoke'] }, () => {
  test('Should redirect unauthenticated visitors away from order history', async ({ page, baseURL, account }) => {
    await util.setDeviceMode(page, 'mobile')
    await account.navigateToOrders(page, baseURL!)
    await account.assertRedirectedToSignIn(page)
  })
})
