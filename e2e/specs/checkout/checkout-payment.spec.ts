/**
 * Checkout payment flow — headed debug spec
 *
 * Seeds the cart, fills the form, then pauses so you can
 * manually trigger the Paystack popup and verify the confirmation page.
 *
 * Run with:
 *   pnpm playwright test checkout-payment --headed --project="Desktop Chrome"
 */

import { test, expect } from '../../fixtures'
import * as checkoutPage from '../../pages/checkout.page'
import * as util from '../../utils/utils'

const CART_ITEM = {
  productId: 'test-product-001',
  name:      'Test Hoodie',
  size:      'M',
  quantity:  1,
  price:     55000,
  image:     '',
  colorName: '',
}

test('Checkout — fill form and pause before payment', async ({ page, baseURL }) => {
  await util.setDeviceMode(page, 'desktop')

  // Seed the cart via localStorage before navigating
  await page.addInitScript((item) => {
    localStorage.setItem('tomani-cart', JSON.stringify([item]))
  }, CART_ITEM)

  await checkoutPage.navigate(page, baseURL!)

  // Confirm we landed on checkout (not redirected to /cart)
  await expect(page).toHaveURL(/\/checkout/)

  // Fill the form
  await checkoutPage.fillForm(page, {
    fullName: 'Sherif Opelo',
    email:    'sherif.test@tw.com',
    phone:    '+234 800 000 0000',
    address:  '12 Ibadun Way',
    city:     'Lagos',
    state:    'Lagos State',
  })

  // ── PAUSE HERE ────────────────────────────────────────────────────────────
  // The form is filled. Click "Pay" in the browser to trigger Paystack.
  // Use test card: 4084 0840 8408 4081 · 12/30 · CVV 408 · PIN 0000 · OTP 123456
  // Or just click "Success" in the Paystack test modal.
  await page.pause()

  // After you complete payment, the test continues and checks the confirmation page
  await expect(page).toHaveURL(/\/order-confirmation/, { timeout: 30000 })
  await expect(page.locator('[data-testid="order-confirmation-heading"]')).toBeVisible()
})
