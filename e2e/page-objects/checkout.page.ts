import { Page, expect } from '@playwright/test'
import { Log }          from 'logr-kit'
import { CART_ITEM }    from '../fixtures/cart.fixtures'

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  LOCATORS                                                                  ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const checkoutSelectors = (page: Page) => ({
  page:       page.locator('[data-testid="checkout-page"]'),
  breadcrumb: page.locator('[data-testid="checkout-breadcrumb"]'),

  form: {
    fullName: page.locator('[data-testid="checkout-full-name"]'),
    email:    page.locator('[data-testid="checkout-email"]'),
    phone:    page.locator('[data-testid="checkout-phone"]'),
    address:  page.locator('[data-testid="checkout-address"]'),
    city:     page.locator('[data-testid="checkout-city"]'),
    state:    page.locator('[data-testid="checkout-state"]'),
    country:  page.locator('[data-testid="checkout-country"]'),
  },

  errors: {
    fullName: page.locator('[data-testid="checkout-error-fullName"]'),
    email:    page.locator('[data-testid="checkout-error-email"]'),
    phone:    page.locator('[data-testid="checkout-error-phone"]'),
    address:  page.locator('[data-testid="checkout-error-address"]'),
    city:     page.locator('[data-testid="checkout-error-city"]'),
    state:    page.locator('[data-testid="checkout-error-state"]'),
  },

  summary: {
    section:  page.locator('[data-testid="checkout-section-summary"]'),
    items:    page.locator('[data-testid="checkout-item"]'),
    subtotal: page.locator('[data-testid="checkout-subtotal"]'),
    delivery: page.locator('[data-testid="checkout-delivery"]'),
    total:    page.locator('[data-testid="checkout-total"]'),
  },

  payButton:       page.locator('[data-testid="checkout-pay-button"]'),
  payButtonMobile: page.locator('[data-testid="checkout-pay-button-mobile"]'),
  mobileBar:       page.locator('[data-testid="checkout-mobile-bar"]'),
})

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ACTIONS                                                                   ║
// ╚════════════════════════════════════════════════════════════════════════════╝

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  TEST DATA                                                                 ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const testUser = () => ({
  fullName: `Test User ${Date.now()}`,
  email:    `test.${Date.now()}@tw-test.com`,
  phone:    '+234 800 000 0000',
  address:  '12 Ibadun Way',
  city:     'Lagos',
  state:    'Lagos State',
})

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ACTIONS                                                                   ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const seedCart = async (page: Page) => {
  await page.addInitScript((item) => {
    localStorage.setItem('tomani-cart', JSON.stringify([item]))
  }, CART_ITEM)
}

export const navigate = async (page: Page, baseURL: string) => {
  Log.navigate(`${baseURL}/checkout`)
  await page.goto(`${baseURL}/checkout`, { waitUntil: 'domcontentloaded' })
}

export const waitForForm = async (page: Page) => {
  await page.waitForSelector('[data-testid="checkout-full-name"]')
}

export const waitForMobileForm = async (page: Page) => {
  await page.waitForSelector('[data-testid="checkout-pay-button-mobile"]')
}

export const assertRedirectToCart = async (page: Page, baseURL: string) => {
  await expect(page).toHaveURL(`${baseURL}/cart`)
  Log.ok('redirected to /cart')
}

export const fillForm = async (page: Page, overrides: Partial<{
  fullName: string
  email:    string
  phone:    string
  address:  string
  city:     string
  state:    string
}> = {}) => {
  const defaults = {
    fullName: 'Tomiwa Adeyemi',
    email:    'tomiwa@test.com',
    phone:    '+234 800 000 0000',
    address:  '12 Lagos-Ibadan Expressway',
    city:     'Lagos',
    state:    'Lagos State',
  }
  const data = { ...defaults, ...overrides }
  const { form } = checkoutSelectors(page)

  Log.section('Checkout — fill form')
  await form.fullName.fill(data.fullName); Log.ok('full name')
  await form.email.fill(data.email);       Log.ok('email')
  await form.phone.fill(data.phone);       Log.ok('phone')
  await form.address.fill(data.address);   Log.ok('address')
  await form.city.fill(data.city);         Log.ok('city')
  await form.state.fill(data.state);       Log.ok('state')
}

export const submitForm = async (page: Page) => {
  const { payButton } = checkoutSelectors(page)
  await payButton.click()
  Log.info('submitted checkout form')
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  PAYSTACK MOCK (bypasses cross-origin iframe via window hook)              ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const mockOrdersApi = async (page: Page, orderNumber = 'TW-TEST-001') => {
  await page.route('**/api/orders', (route) =>
    route.fulfill({
      status:      200,
      contentType: 'application/json',
      body:        JSON.stringify({ orderNumber }),
    })
  )
  Log.info(`mocked /api/orders → orderNumber: ${orderNumber}`)
}

export const triggerPaystackSuccess = async (page: Page, ref = `TW-TEST-${Date.now()}`) => {
  // CheckoutForm exposes window.__paystackSuccess for non-production testing.
  // We wait for the hook to be registered (it mounts after React hydration).
  await page.waitForFunction(
    () => typeof (window as Window & { __paystackSuccess?: unknown }).__paystackSuccess === 'function',
    { timeout: 10_000 }
  )
  await page.evaluate(
    (r) => (window as Window & { __paystackSuccess: (ref: string) => void }).__paystackSuccess(r),
    ref
  )
  Log.ok(`triggered Paystack success with ref: ${ref}`)
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ORDER CONFIRMATION                                                        ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const orderConfirmationSelectors = (page: Page) => ({
  heading: page.locator('[data-testid="order-confirmation-heading"]'),
})

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ASSERTIONS                                                                ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const assertCheckoutPageVisible = async (page: Page) => {
  const { page: checkoutPageEl } = checkoutSelectors(page)
  await expect(checkoutPageEl).toBeVisible()
  Log.ok('checkout page visible')
}

export const assertSummaryVisible = async (page: Page) => {
  const { summary } = checkoutSelectors(page)
  await expect(summary.section).toBeVisible()
  await expect(summary.subtotal).toBeVisible()
  await expect(summary.total).toBeVisible()
  Log.ok('order summary visible')
}

export const assertCartItemVisible = async (page: Page) => {
  const { summary } = checkoutSelectors(page)
  await expect(summary.items.first()).toBeVisible()
  Log.ok('cart item in summary visible')
}

export const assertPayButtonVisible = async (page: Page) => {
  const { payButton } = checkoutSelectors(page)
  await expect(payButton).toBeVisible()
  await expect(payButton).toContainText('Pay')
  Log.ok('pay button visible')
}

export const assertDeliveryFree = async (page: Page) => {
  const { summary } = checkoutSelectors(page)
  await expect(summary.delivery).toContainText('Free')
  Log.ok('delivery shown as Free')
}

export const assertTotalAmount = async (page: Page, expected: string) => {
  const { summary } = checkoutSelectors(page)
  await expect(summary.total).toContainText(expected)
  Log.ok(`total shows ${expected}`)
}

export const assertEmptyFormErrors = async (page: Page) => {
  const { payButton, errors } = checkoutSelectors(page)
  await payButton.click()
  await expect(errors.fullName).toBeVisible()
  await expect(errors.email).toBeVisible()
  await expect(errors.phone).toBeVisible()
  await expect(errors.address).toBeVisible()
  await expect(errors.city).toBeVisible()
  await expect(errors.state).toBeVisible()
  Log.ok('all required field errors shown')
}

export const assertEmailValidationError = async (page: Page) => {
  const user = testUser()
  await fillForm(page, { ...user, email: 'not-an-email' })
  const { payButton, errors } = checkoutSelectors(page)
  await payButton.click()
  await expect(errors.email).toBeVisible()
  Log.ok('email validation error shown')
}

export const assertErrorClearsAfterFill = async (page: Page) => {
  const { form, payButton, errors } = checkoutSelectors(page)
  await payButton.click()
  await expect(errors.fullName).toBeVisible()
  await form.fullName.fill(testUser().fullName)
  await expect(errors.fullName).not.toBeVisible()
  Log.ok('error cleared after field filled')
}

export const assertMobileStickyBar = async (page: Page) => {
  const { mobileBar, payButtonMobile } = checkoutSelectors(page)
  await expect(mobileBar).toBeVisible()
  await expect(payButtonMobile).toBeVisible()
  await expect(payButtonMobile).toContainText('Pay')
  Log.ok('mobile sticky bar visible')
}

export const assertMobileEmptyFormErrors = async (page: Page) => {
  const { payButtonMobile, errors } = checkoutSelectors(page)
  await payButtonMobile.click()
  await expect(errors.fullName).toBeVisible()
  await expect(errors.email).toBeVisible()
  Log.ok('mobile validation errors shown')
}

export const assertCheckoutSmoke = async (page: Page) => {
  await assertFormVisible(page)
  await assertTotalAmount(page, '₦55,000')
  await assertPayButtonVisible(page)
  Log.ok('checkout smoke passed')
}

export const assertFormVisible = async (page: Page) => {
  Log.section('Checkout — form fields visible')
  const { form } = checkoutSelectors(page)
  await expect(form.fullName).toBeVisible(); Log.ok('full name field')
  await expect(form.email).toBeVisible();    Log.ok('email field')
  await expect(form.phone).toBeVisible();    Log.ok('phone field')
  await expect(form.address).toBeVisible();  Log.ok('address field')
  await expect(form.city).toBeVisible();     Log.ok('city field')
  await expect(form.state).toBeVisible();    Log.ok('state field')
}

export const assertOrderConfirmed = async (page: Page) => {
  Log.section('Order confirmation — assert landing')
  await expect(page).toHaveURL(/\/order-confirmation/, { timeout: 60_000 })
  const { heading } = orderConfirmationSelectors(page)
  await expect(heading).toBeVisible();       Log.ok('order confirmation heading visible')
}
