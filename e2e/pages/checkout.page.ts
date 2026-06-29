import { Page, expect } from '@playwright/test'
import { Log } from 'logr-kit'

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

export const navigate = async (page: Page, baseURL: string) => {
  Log.navigate(`${baseURL}/checkout`)
  await page.goto(`${baseURL}/checkout`, { waitUntil: 'domcontentloaded' })
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
