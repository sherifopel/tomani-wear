import { test }           from '../../fixtures/fixtures'
import * as checkoutPage  from '../../page-objects/checkout.page'
import * as util          from '../../helpers/utils'

test.describe('Checkout — empty cart redirect', { tag: ['@tomanni', '@checkout'] }, () => {
  test('Should redirect to /cart when the cart is empty', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await checkoutPage.navigate(page, baseURL!)
    await checkoutPage.assertRedirectToCart(page, baseURL!)
  })
})

test.describe('Checkout — form fields', { tag: ['@tomanni', '@checkout', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await checkoutPage.seedCart(page)
    await checkoutPage.navigate(page, baseURL!)
    await checkoutPage.waitForForm(page)
  })

  test('Should show the checkout page with form fields', async ({ page }) => {
    await checkoutPage.assertCheckoutPageVisible(page)
  })

  test('Should display all contact and delivery fields', async ({ page }) => {
    await checkoutPage.assertFormVisible(page)
  })

  test('Should show the order summary section', async ({ page }) => {
    await checkoutPage.assertSummaryVisible(page)
  })

  test('Should show the cart item in the order summary', async ({ page }) => {
    await checkoutPage.assertCartItemVisible(page)
  })

  test('Should show the pay button', async ({ page }) => {
    await checkoutPage.assertPayButtonVisible(page)
  })

  test('Should show delivery as Free', async ({ page }) => {
    await checkoutPage.assertDeliveryFree(page)
  })

  test('Order total should match the cart item price', async ({ page }) => {
    await checkoutPage.assertTotalAmount(page, '₦55,000')
  })
})

test.describe('Checkout — form validation', { tag: ['@tomanni', '@checkout', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await checkoutPage.seedCart(page)
    await checkoutPage.navigate(page, baseURL!)
    await checkoutPage.waitForForm(page)
  })

  test('Should show required field errors when submitting an empty form', async ({ page }) => {
    await checkoutPage.assertEmptyFormErrors(page)
  })

  test('Should show an email error for an invalid email address', async ({ page }) => {
    await checkoutPage.assertEmailValidationError(page)
  })

  test('Should clear a field error once the field is filled in', async ({ page }) => {
    await checkoutPage.assertErrorClearsAfterFill(page)
  })
})

test.describe('Checkout — mobile', { tag: ['@tomanni', '@checkout', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await checkoutPage.seedCart(page)
    await checkoutPage.navigate(page, baseURL!)
    await checkoutPage.waitForMobileForm(page)
  })

  test('Should show the sticky mobile pay bar', async ({ page }) => {
    await checkoutPage.assertMobileStickyBar(page)
  })

  test('Should show validation errors on mobile when submitting empty', async ({ page }) => {
    await checkoutPage.assertMobileEmptyFormErrors(page)
  })
})

test.describe('Checkout smoke', { tag: ['@tomanni-smoke', '@checkout', '@desktop'] }, () => {
  test('Should render the checkout form with all fields and summary', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await checkoutPage.seedCart(page)
    await checkoutPage.navigate(page, baseURL!)
    await checkoutPage.waitForForm(page)
    await checkoutPage.assertCheckoutSmoke(page)
  })
})
