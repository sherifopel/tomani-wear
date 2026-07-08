import { test }           from '../../fixtures/fixtures'
import * as checkoutPage  from '../../page-objects/checkout.page'
import * as util          from '../../helpers/utils'

// ─────────────────────────────────────────────────────────────────────────────
// 💳 PAYSTACK PAYMENT FLOW
//
// The Paystack popup opens a cross-origin iframe — not automatable directly.
// Instead we use two mocks that are standard practice for payment testing:
//   1. page.route() mocks /api/orders so no real DB write happens
//   2. window.__paystackSuccess (exposed by CheckoutForm in non-prod) triggers
//      the onSuccess callback directly, bypassing the iframe entirely
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Checkout — Paystack payment flow', { tag: ['@checkout', '@payment'] }, () => {

  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await checkoutPage.seedCart(page)
    await checkoutPage.mockOrdersApi(page)
    await checkoutPage.navigate(page, baseURL!)
    await checkoutPage.waitForForm(page)
  })

  test('Should land on order confirmation after successful payment', async ({ page }) => {
    await checkoutPage.fillForm(page, checkoutPage.testUser())
    await checkoutPage.triggerPaystackSuccess(page)
    await checkoutPage.assertOrderConfirmed(page)
  })

  test('Should pass customer details to /api/orders when payment succeeds', async ({ page }) => {
    const user = checkoutPage.testUser()
    let capturedBody: Record<string, unknown> | null = null

    await page.route('**/api/orders', async (route) => {
      capturedBody = JSON.parse(route.request().postData() ?? '{}')
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ orderNumber: 'TW-TEST-002' }) })
    })

    await checkoutPage.fillForm(page, user)
    await checkoutPage.triggerPaystackSuccess(page)
    await checkoutPage.assertOrderConfirmed(page)

    test.expect(capturedBody).not.toBeNull()
    test.expect((capturedBody as unknown as { customerName: string }).customerName).toBe(user.fullName)
    test.expect((capturedBody as unknown as { customerEmail: string }).customerEmail).toBe(user.email)
  })
})
