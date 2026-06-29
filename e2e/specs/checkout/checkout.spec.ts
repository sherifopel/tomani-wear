/**
 * Checkout page
 *
 * These tests cover the form and validation only.
 * We do NOT trigger the Paystack popup in CI — that would require a live
 * payment key and real network calls to Paystack's servers.
 *
 * The checkout page redirects to /cart when the cart is empty.
 * To reach the form, we seed the cart via localStorage before navigating.
 */

import { test, expect } from '../../fixtures'
import * as checkoutPage from '../../pages/checkout.page'
import * as util from '../../utils/utils'

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const CART_ITEM = {
  productId: 'test-product-001',
  name:      'Test Hoodie',
  size:      'M',
  quantity:  1,
  price:     55000,
  image:     '',
  colorName: '',
}

async function seedCart(page: import('@playwright/test').Page) {
  await page.addInitScript((item) => {
    localStorage.setItem('tomani-cart', JSON.stringify([item]))
  }, CART_ITEM)
}

// ─────────────────────────────────────────────────────────────────────────────
// 🛒 EMPTY CART REDIRECT
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Checkout — empty cart redirect', { tag: ['@tomanni', '@checkout'] }, () => {
  test('Should redirect to /cart when the cart is empty', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await checkoutPage.navigate(page, baseURL!)
    await expect(page).toHaveURL(`${baseURL}/cart`)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 🖥  DESKTOP — FORM VISIBILITY
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Checkout — form fields', { tag: ['@tomanni', '@checkout', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await seedCart(page)
    await checkoutPage.navigate(page, baseURL!)
    // CheckoutForm is lazy-loaded with ssr:false — wait for the first field
    // before any assertion, otherwise tests are flaky on slow connections.
    await page.waitForSelector('[data-testid="checkout-full-name"]')
  })

  test('Should show the checkout page with form fields', async ({ page }) => {
    const { page: checkoutPageEl } = checkoutPage.checkoutSelectors(page)
    await expect(checkoutPageEl).toBeVisible()
  })

  test('Should display all contact and delivery fields', async ({ page }) => {
    await checkoutPage.assertFormVisible(page)
  })

  test('Should show the order summary section', async ({ page }) => {
    const { summary } = checkoutPage.checkoutSelectors(page)
    await expect(summary.section).toBeVisible()
    await expect(summary.subtotal).toBeVisible()
    await expect(summary.total).toBeVisible()
  })

  test('Should show the cart item in the order summary', async ({ page }) => {
    const { summary } = checkoutPage.checkoutSelectors(page)
    await expect(summary.items.first()).toBeVisible()
  })

  test('Should show the pay button', async ({ page }) => {
    const { payButton } = checkoutPage.checkoutSelectors(page)
    await expect(payButton).toBeVisible()
    await expect(payButton).toContainText('Pay')
  })

  test('Should show delivery as Free', async ({ page }) => {
    const { summary } = checkoutPage.checkoutSelectors(page)
    await expect(summary.delivery).toContainText('Free')
  })

  // Regression: total must reflect the seeded cart item price (₦55,000)
  test('Order total should match the cart item price', async ({ page }) => {
    const { summary } = checkoutPage.checkoutSelectors(page)
    await expect(summary.total).toContainText('₦55,000')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// ✅ VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Checkout — form validation', { tag: ['@tomanni', '@checkout', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await seedCart(page)
    await checkoutPage.navigate(page, baseURL!)
    await page.waitForSelector('[data-testid="checkout-full-name"]')
  })

  test('Should show required field errors when submitting an empty form', async ({ page }) => {
    const { payButton, errors } = checkoutPage.checkoutSelectors(page)
    await payButton.click()
    await expect(errors.fullName).toBeVisible()
    await expect(errors.email).toBeVisible()
    await expect(errors.phone).toBeVisible()
    await expect(errors.address).toBeVisible()
    await expect(errors.city).toBeVisible()
    await expect(errors.state).toBeVisible()
  })

  test('Should show an email error for an invalid email address', async ({ page }) => {
    const { form, payButton, errors } = checkoutPage.checkoutSelectors(page)
    await form.fullName.fill('Tomiwa Adeyemi')
    await form.email.fill('not-an-email')
    await form.phone.fill('+234 800 000 0000')
    await form.address.fill('12 Lagos-Ibadan Expressway')
    await form.city.fill('Lagos')
    await form.state.fill('Lagos State')
    await payButton.click()
    await expect(errors.email).toBeVisible()
  })

  test('Should clear a field error once the field is filled in', async ({ page }) => {
    const { form, payButton, errors } = checkoutPage.checkoutSelectors(page)
    await payButton.click()
    await expect(errors.fullName).toBeVisible()
    await form.fullName.fill('Tomiwa Adeyemi')
    await expect(errors.fullName).not.toBeVisible()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 📱 MOBILE
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Checkout — mobile', { tag: ['@tomanni', '@checkout', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await seedCart(page)
    await checkoutPage.navigate(page, baseURL!)
    await page.waitForSelector('[data-testid="checkout-pay-button-mobile"]')
  })

  test('Should show the sticky mobile pay bar', async ({ page }) => {
    const { mobileBar, payButtonMobile } = checkoutPage.checkoutSelectors(page)
    await expect(mobileBar).toBeVisible()
    await expect(payButtonMobile).toBeVisible()
    await expect(payButtonMobile).toContainText('Pay')
  })

  test('Should show validation errors on mobile when submitting empty', async ({ page }) => {
    const { payButtonMobile, errors } = checkoutPage.checkoutSelectors(page)
    await payButtonMobile.click()
    await expect(errors.fullName).toBeVisible()
    await expect(errors.email).toBeVisible()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 TOMANNI SMOKE
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Checkout smoke', { tag: ['@tomanni-smoke', '@checkout', '@desktop'] }, () => {
  test('Should render the checkout form with all fields and summary', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await seedCart(page)
    await checkoutPage.navigate(page, baseURL!)
    await page.waitForSelector('[data-testid="checkout-full-name"]')
    await checkoutPage.assertFormVisible(page)
    const { summary, payButton } = checkoutPage.checkoutSelectors(page)
    await expect(summary.total).toContainText('₦55,000')
    await expect(payButton).toBeVisible()
  })
})
