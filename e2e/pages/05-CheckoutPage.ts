import { Page, expect } from '@playwright/test'
import { Log }          from 'logr-kit'
import { CART_ITEM }    from '../fixtures/cart.fixtures'

// =============================================================================
// TEST DATA
// =============================================================================

export function testUser() {
  return {
    fullName: `Test User ${Date.now()}`,
    email:    `test.${Date.now()}@tw-test.com`,
    phone:    '+234 800 000 0000',
    address:  '12 Ibadun Way',
    city:     'Lagos',
    state:    'Lagos State',
  }
}

// =============================================================================
// SELECTOR FACTORY
// =============================================================================

export function checkoutSelectors(page: Page) {
  return {

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

    confirmation: {
      heading: page.locator('[data-testid="order-confirmation-heading"]'),
    },

  }
}

// =============================================================================
// ACTIONS
// =============================================================================

export async function seedCart(page: Page) {
  Log.info('seeding the cart before checkout')
  await page.addInitScript((item) => {
    localStorage.setItem('tomani-cart', JSON.stringify([item]))
  }, CART_ITEM)
  Log.ok('cart seeded')
}

export async function navigate(page: Page, baseURL: string) {
  Log.navigate(`${baseURL}/checkout`)
  await page.goto(`${baseURL}/checkout`, { waitUntil: 'domcontentloaded' })
}

export async function waitForForm(page: Page) {
  await page.waitForSelector('[data-testid="checkout-full-name"]')
}

export async function waitForMobileForm(page: Page) {
  await page.waitForSelector('[data-testid="checkout-pay-button-mobile"]')
}

export async function fillForm(page: Page, overrides: Partial<{
  fullName: string
  email:    string
  phone:    string
  address:  string
  city:     string
  state:    string
}> = {}) {
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

export async function submitForm(page: Page) {
  const { payButton } = checkoutSelectors(page)
  Log.info('submitting the checkout form (desktop pay button)')
  await payButton.click()
  Log.ok('checkout form submitted')
}

export async function submitMobileForm(page: Page) {
  const { payButtonMobile } = checkoutSelectors(page)
  Log.info('submitting the checkout form (mobile pay bar)')
  await payButtonMobile.click()
  Log.ok('checkout form submitted')
}

// =============================================================================
// PAYSTACK MOCK (bypasses cross-origin iframe via window hook)
// =============================================================================

export async function mockOrdersApi(
  page: Page,
  orderNumber = 'TW-TEST-001',
  onRequest?: (body: unknown) => void,
) {
  Log.info('mocking /api/orders')
  await page.route('**/api/orders', async (route) => {
    if (onRequest) {
      const body = JSON.parse(route.request().postData() ?? '{}')
      onRequest(body)
    }
    await route.fulfill({
      status:      200,
      contentType: 'application/json',
      body:        JSON.stringify({ orderNumber }),
    })
  })
  Log.ok(`/api/orders mocked → orderNumber: ${orderNumber}`)
}

export async function triggerPaystackSuccess(page: Page, ref = `TW-TEST-${Date.now()}`) {
  Log.info(`triggering Paystack success with ref: ${ref}`)
  // CheckoutForm exposes window.__paystackSuccess for non-production testing.
  // We wait for the hook to be registered (it mounts after React hydration).
  await page.waitForFunction(
    () => typeof (window as Window & { __paystackSuccess?: unknown }).__paystackSuccess === 'function',
    { timeout: 10_000 }
  )
  await page.evaluate(
    (r) => (window as unknown as Window & { __paystackSuccess: (ref: string) => void }).__paystackSuccess(r),
    ref
  )
  Log.ok(`triggered Paystack success with ref: ${ref}`)
}

// =============================================================================
// ASSERTIONS
// =============================================================================

export async function assertRedirectToCart(page: Page) {
  await expect(page).toHaveURL(/\/cart$/)
  Log.ok('redirected to /cart')
}

export async function assertCheckoutPageVisible(page: Page) {
  const { page: checkoutPageEl } = checkoutSelectors(page)
  await expect(checkoutPageEl).toBeVisible()
  Log.ok('checkout page visible')
}

export async function assertFormVisible(page: Page) {
  Log.section('Checkout — form fields visible')
  const { form } = checkoutSelectors(page)
  await expect(form.fullName).toBeVisible(); Log.ok('full name field')
  await expect(form.email).toBeVisible();    Log.ok('email field')
  await expect(form.phone).toBeVisible();    Log.ok('phone field')
  await expect(form.address).toBeVisible();  Log.ok('address field')
  await expect(form.city).toBeVisible();     Log.ok('city field')
  await expect(form.state).toBeVisible();    Log.ok('state field')
}

export async function assertSummaryVisible(page: Page) {
  const { summary } = checkoutSelectors(page)
  await expect(summary.section).toBeVisible()
  await expect(summary.subtotal).toBeVisible()
  await expect(summary.total).toBeVisible()
  Log.ok('order summary visible')
}

export async function assertCartItemVisible(page: Page) {
  const { summary } = checkoutSelectors(page)
  await expect(summary.items.first()).toBeVisible()
  Log.ok('cart item in summary visible')
}

export async function assertPayButtonVisible(page: Page) {
  const { payButton } = checkoutSelectors(page)
  await expect(payButton).toBeVisible()
  await expect(payButton).toContainText('Pay')
  Log.ok('pay button visible')
}

export async function assertGuestDeliveryFee(page: Page) {
  const { summary } = checkoutSelectors(page)
  await expect(summary.delivery).toContainText('₦7,500')
  Log.ok('guest delivery fee shown as ₦7,500')
}

export async function assertTotalAmount(page: Page, expected: string) {
  const { summary } = checkoutSelectors(page)
  await expect(summary.total).toContainText(expected)
  Log.ok(`total shows ${expected}`)
}

export async function assertAllFieldErrorsVisible(page: Page) {
  const { errors } = checkoutSelectors(page)
  await expect(errors.fullName).toBeVisible()
  await expect(errors.email).toBeVisible()
  await expect(errors.phone).toBeVisible()
  await expect(errors.address).toBeVisible()
  await expect(errors.city).toBeVisible()
  await expect(errors.state).toBeVisible()
  Log.ok('all required field errors shown')
}

export async function assertEmailErrorVisible(page: Page) {
  const { errors } = checkoutSelectors(page)
  await expect(errors.email).toBeVisible()
  Log.ok('email validation error shown')
}

export async function assertFullNameErrorVisible(page: Page) {
  const { errors } = checkoutSelectors(page)
  await expect(errors.fullName).toBeVisible()
  Log.ok('full name error shown')
}

export async function assertFullNameErrorCleared(page: Page) {
  const { errors } = checkoutSelectors(page)
  await expect(errors.fullName).not.toBeVisible()
  Log.ok('full name error cleared')
}

export async function assertMobileStickyBar(page: Page) {
  const { mobileBar, payButtonMobile } = checkoutSelectors(page)
  await expect(mobileBar).toBeVisible()
  await expect(payButtonMobile).toBeVisible()
  await expect(payButtonMobile).toContainText('Pay')
  Log.ok('mobile sticky bar visible')
}

export async function assertMobileEmailAndNameErrorsVisible(page: Page) {
  const { errors } = checkoutSelectors(page)
  await expect(errors.fullName).toBeVisible()
  await expect(errors.email).toBeVisible()
  Log.ok('mobile validation errors shown')
}

export async function assertCheckoutSmoke(page: Page) {
  await assertFormVisible(page)
  await assertGuestDeliveryFee(page)
  await assertTotalAmount(page, '₦62,500')
  await assertPayButtonVisible(page)
  Log.ok('checkout smoke passed')
}

export async function assertOrderConfirmed(page: Page) {
  Log.section('Order confirmation — assert landing')
  await expect(page).toHaveURL(/\/order-confirmation/, { timeout: 60_000 })
  const { confirmation } = checkoutSelectors(page)
  await expect(confirmation.heading).toBeVisible(); Log.ok('order confirmation heading visible')
}

export function assertOrderCustomerDetails(
  capturedBody: Record<string, unknown> | null,
  user: { fullName: string; email: string },
) {
  expect(capturedBody).not.toBeNull()
  expect((capturedBody as unknown as { customerName: string }).customerName).toBe(user.fullName)
  expect((capturedBody as unknown as { customerEmail: string }).customerEmail).toBe(user.email)
  Log.ok('order API received the correct customer details')
}
