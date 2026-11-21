import { test } from '../../src/fixtures'
import * as util from '../../helpers/utils'

// =============================================================================
// DESKTOP REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Checkout — Desktop', { tag: ['@checkout', '@desktop'] }, () => {
  test('Should redirect to /cart when the cart is empty', async ({ page, baseURL, checkout }) => {
    await util.setDeviceMode(page, 'desktop')
    await checkout.navigate(page, baseURL!)
    await checkout.assertRedirectToCart(page)
  })

  // prettier-ignore
  test.describe('with a seeded cart', () => {
    test.beforeEach(async ({ page, baseURL, checkout }) => {
      await util.setDeviceMode(page, 'desktop')
      await checkout.seedCart(page)
      await checkout.navigate(page, baseURL!)
      await checkout.waitForForm(page)
    })

    test('Should show the checkout page with form fields', async ({ page, checkout }) => {
      await checkout.assertCheckoutPageVisible(page)
    })

    test('Should display all contact and delivery fields', async ({ page, checkout }) => {
      await checkout.assertFormVisible(page)
    })

    test('Should show the order summary section', async ({ page, checkout }) => {
      await checkout.assertSummaryVisible(page)
    })

    test('Should show the cart item in the order summary', async ({ page, checkout }) => {
      await checkout.assertCartItemVisible(page)
    })

    test('Should show the pay button', async ({ page, checkout }) => {
      await checkout.assertPayButtonVisible(page)
    })

    test('Should show the guest delivery fee', async ({ page, checkout }) => {
      await checkout.assertGuestDeliveryFee(page)
    })

    test('Order total should include the guest delivery fee', async ({ page, checkout }) => {
      await checkout.assertTotalAmount(page, '₦62,500')
    })

    test('Should show required field errors when submitting an empty form', async ({ page, checkout }) => {
      await checkout.submitForm(page)
      await checkout.assertAllFieldErrorsVisible(page)
    })

    test('Should show an email error for an invalid email address', async ({ page, checkout }) => {
      await checkout.fillForm(page, { ...checkout.testUser(), email: 'not-an-email' })
      await checkout.submitForm(page)
      await checkout.assertEmailErrorVisible(page)
    })

    test('Should clear a field error once the field is filled in', async ({ page, checkout }) => {
      await checkout.submitForm(page)
      await checkout.assertFullNameErrorVisible(page)
      await checkout.fillForm(page, { fullName: checkout.testUser().fullName })
      await checkout.assertFullNameErrorCleared(page)
    })
  })
})

// =============================================================================
// MOBILE REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Checkout — Mobile', { tag: ['@checkout', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL, checkout }) => {
    await util.setDeviceMode(page, 'mobile')
    await checkout.seedCart(page)
    await checkout.navigate(page, baseURL!)
    await checkout.waitForMobileForm(page)
  })

  test('Should show the sticky mobile pay bar', async ({ page, checkout }) => {
    await checkout.assertMobileStickyBar(page)
  })

  test('Should show validation errors on mobile when submitting empty', async ({ page, checkout }) => {
    await checkout.submitMobileForm(page)
    await checkout.assertMobileEmailAndNameErrorsVisible(page)
  })
})

// =============================================================================
// SMOKE COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Checkout — Smoke — Desktop', { tag: ['@checkout', '@desktop', '@smoke'] }, () => {
  test('Should render the checkout form with all fields and summary', async ({ page, baseURL, checkout }) => {
    await util.setDeviceMode(page, 'desktop')
    await checkout.seedCart(page)
    await checkout.navigate(page, baseURL!)
    await checkout.waitForForm(page)
    await checkout.assertCheckoutSmoke(page)
  })
})

// prettier-ignore
test.describe('Checkout — Smoke — Mobile', { tag: ['@checkout', '@mobile', '@smoke'] }, () => {
  test('Should render the checkout form with the mobile pay bar', async ({ page, baseURL, checkout }) => {
    await util.setDeviceMode(page, 'mobile')
    await checkout.seedCart(page)
    await checkout.navigate(page, baseURL!)
    await checkout.waitForMobileForm(page)
    await checkout.assertMobileStickyBar(page)
    await checkout.assertGuestDeliveryFee(page)
  })
})
