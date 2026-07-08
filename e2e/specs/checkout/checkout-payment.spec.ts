import { test }           from '../../fixtures/fixtures'
import * as checkoutPage  from '../../page-objects/checkout.page'
import * as util          from '../../helpers/utils'

// ─────────────────────────────────────────────────────────────────────────────
// 💳 PAYSTACK END-TO-END PAYMENT
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Checkout — Paystack payment flow', { tag: ['@checkout', '@payment'] }, () => {
  test.setTimeout(120_000)

  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await checkoutPage.seedCart(page)
    await checkoutPage.navigate(page, baseURL!)
    await checkoutPage.waitForForm(page)
  })

  test('Should complete card payment and land on order confirmation', async ({ page }) => {
    await checkoutPage.fillForm(page, checkoutPage.testUser())
    await checkoutPage.submitForm(page)
    await checkoutPage.completePaystackCardPayment(page)
    await checkoutPage.assertOrderConfirmed(page)
  })
})
