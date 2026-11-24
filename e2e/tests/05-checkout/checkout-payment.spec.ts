import { test } from '../../src/fixtures'
import * as util from '../../helpers/utils'

// The Paystack popup opens a cross-origin iframe — not automatable directly.
// Instead we use two mocks that are standard practice for payment testing:
//   1. page.route() mocks /api/orders so no real DB write happens
//   2. window.__paystackSuccess (exposed by CheckoutForm in non-prod) triggers
//      the onSuccess callback directly, bypassing the iframe entirely

// =============================================================================
// DESKTOP REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Checkout Payment — Desktop', { tag: ['@checkout', '@payment', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL, checkout }) => {
    await util.setDeviceMode(page, 'desktop')
    await checkout.seedCart(page)
    await checkout.mockOrdersApi(page)
    await checkout.navigate(page, baseURL!)
    await checkout.waitForForm(page)
  })

  test('Should land on order confirmation after successful payment', async ({ page, checkout }) => {
    await checkout.fillForm(page, checkout.testUser())
    await checkout.triggerPaystackSuccess(page)
    await checkout.assertOrderConfirmed(page)
  })

  test('Should pass customer details to /api/orders when payment succeeds', async ({ page, baseURL, checkout }) => {
    const user = checkout.testUser()
    let capturedBody: Record<string, unknown> | null = null

    await checkout.seedCart(page)
    await checkout.mockOrdersApi(page, 'TW-TEST-002', (body) => { capturedBody = body as Record<string, unknown> })
    await checkout.navigate(page, baseURL!)
    await checkout.waitForForm(page)

    await checkout.fillForm(page, user)
    await checkout.triggerPaystackSuccess(page)
    await checkout.assertOrderConfirmed(page)

    checkout.assertOrderCustomerDetails(capturedBody, user)
  })
})

// =============================================================================
// MOBILE REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Checkout Payment — Mobile', { tag: ['@checkout', '@payment', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL, checkout }) => {
    await util.setDeviceMode(page, 'mobile')
    await checkout.seedCart(page)
    await checkout.mockOrdersApi(page)
    await checkout.navigate(page, baseURL!)
    await checkout.waitForMobileForm(page)
  })

  test('Should land on order confirmation after successful payment', async ({ page, checkout }) => {
    await checkout.fillForm(page, checkout.testUser())
    await checkout.triggerPaystackSuccess(page)
    await checkout.assertOrderConfirmed(page)
  })

  test('Should pass customer details to /api/orders when payment succeeds', async ({ page, baseURL, checkout }) => {
    const user = checkout.testUser()
    let capturedBody: Record<string, unknown> | null = null

    await checkout.seedCart(page)
    await checkout.mockOrdersApi(page, 'TW-TEST-002', (body) => { capturedBody = body as Record<string, unknown> })
    await checkout.navigate(page, baseURL!)
    await checkout.waitForMobileForm(page)

    await checkout.fillForm(page, user)
    await checkout.triggerPaystackSuccess(page)
    await checkout.assertOrderConfirmed(page)

    checkout.assertOrderCustomerDetails(capturedBody, user)
  })
})

// =============================================================================
// SMOKE COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Checkout Payment — Smoke — Desktop', { tag: ['@checkout', '@payment', '@desktop', '@smoke'] }, () => {
  test('Should complete payment and land on order confirmation', async ({ page, baseURL, checkout }) => {
    await util.setDeviceMode(page, 'desktop')
    await checkout.seedCart(page)
    await checkout.mockOrdersApi(page)
    await checkout.navigate(page, baseURL!)
    await checkout.waitForForm(page)
    await checkout.fillForm(page, checkout.testUser())
    await checkout.triggerPaystackSuccess(page)
    await checkout.assertOrderConfirmed(page)
  })
})

// prettier-ignore
test.describe('Checkout Payment — Smoke — Mobile', { tag: ['@checkout', '@payment', '@mobile', '@smoke'] }, () => {
  test('Should complete payment and land on order confirmation', async ({ page, baseURL, checkout }) => {
    await util.setDeviceMode(page, 'mobile')
    await checkout.seedCart(page)
    await checkout.mockOrdersApi(page)
    await checkout.navigate(page, baseURL!)
    await checkout.waitForMobileForm(page)
    await checkout.fillForm(page, checkout.testUser())
    await checkout.triggerPaystackSuccess(page)
    await checkout.assertOrderConfirmed(page)
  })
})
