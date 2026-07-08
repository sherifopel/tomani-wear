import { test, expect } from '../../fixtures/fixtures'
import * as accountPage  from '../../page-objects/account.page'
import * as util         from '../../helpers/utils'

// ─────────────────────────────────────────────────────────────────────────────
// UNAUTHENTICATED — these run without a real session
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Order history — unauthenticated redirect', { tag: ['@tomanni', '@account', '@orders'] }, () => {

  test('Orders list redirects to /sign-in when not logged in', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await accountPage.navigateToOrders(page, baseURL!)
    await accountPage.assertOrdersRedirect(page)
  })

  test('Orders list includes callbackUrl pointing back to /account/orders', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await accountPage.navigateToOrders(page, baseURL!)
    await expect(page).toHaveURL(/callbackUrl=.*account.*orders/)
  })

  test('Order detail redirects to /sign-in when not logged in', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await accountPage.navigateToOrderDetail(page, baseURL!, 'fake-order-id-123')
    await accountPage.assertOrderDetailRedirect(page)
  })

  test('Mobile — orders list redirects to /sign-in', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await accountPage.navigateToOrders(page, baseURL!)
    await expect(page).toHaveURL(/\/sign-in/)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// AUTHENTICATED — skipped until auth storageState is configured (TW-38)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Order history — authenticated', { tag: ['@tomanni', '@account', '@orders'] }, () => {

  test.skip('Orders page renders heading and list', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await accountPage.navigateToOrders(page, baseURL!)
    const { page: ordersPage, heading } = accountPage.ordersSelectors(page)
    await expect(ordersPage).toBeVisible()
    await expect(heading).toBeVisible()
  })

  test.skip('Empty state shows when user has no orders', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await accountPage.navigateToOrders(page, baseURL!)
    const { empty } = accountPage.ordersSelectors(page)
    await expect(empty).toBeVisible()
  })

  test.skip('Order detail page renders order number, status and items', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await accountPage.navigateToOrders(page, baseURL!)
    const { items } = accountPage.ordersSelectors(page)
    await items.first().click()
    const { heading, status, total } = accountPage.orderDetailSelectors(page)
    await expect(heading).toBeVisible()
    await expect(status).toBeVisible()
    await expect(total).toBeVisible()
  })

  test.skip('Back link returns to order list', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await accountPage.navigateToOrders(page, baseURL!)
    const { items } = accountPage.ordersSelectors(page)
    await items.first().click()
    const { back } = accountPage.orderDetailSelectors(page)
    await back.click()
    await expect(page).toHaveURL(/\/account\/orders$/)
  })
})
