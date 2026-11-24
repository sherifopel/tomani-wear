import { test } from '../../src/fixtures'
import * as util from '../../helpers/utils'

// =============================================================================
// DESKTOP REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Cart — Desktop', { tag: ['@cart', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL, cart }) => {
    await util.setDeviceMode(page, 'desktop')
    await cart.clearCart(page, baseURL!)
    await cart.navigate(page, baseURL!)
  })

  test('Should show empty cart message when no items are in the cart', async ({ page, cart }) => {
    await cart.assertEmptyState(page)
  })

  test('Should show a "Start Shopping" link that goes to /products', async ({ page, cart }) => {
    await cart.assertStartShoppingLink(page)
  })

  test('Should show size error when Add to Cart is clicked without selecting a size', async ({ page, baseURL, pdp }) => {
    // Skipped until Tomiwa adds sizes to products in Sanity Studio — size error only triggers when pdp-size-selector is rendered
    test.skip(true, 'No product currently has sizes configured in Sanity')
    await pdp.navigate(page, baseURL!, 'tmn-royal-crest-hoodie')
    await pdp.clickAddToCart(page)
    await pdp.assertSizeError(page)
  })
})

// =============================================================================
// MOBILE REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Cart — Mobile', { tag: ['@cart', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL, cart }) => {
    await util.setDeviceMode(page, 'mobile')
    await cart.clearCart(page, baseURL!)
    await cart.navigate(page, baseURL!)
  })

  test('Should show empty cart message on mobile', async ({ page, cart }) => {
    await cart.assertEmptyState(page)
  })
})

// =============================================================================
// SMOKE COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Cart — Smoke — Desktop', { tag: ['@cart', '@desktop', '@smoke'] }, () => {
  test('Should render the cart page and show empty state', async ({ page, baseURL, cart }) => {
    await util.setDeviceMode(page, 'desktop')
    await cart.clearCart(page, baseURL!)
    await cart.navigate(page, baseURL!)
    await cart.assertEmptyState(page)
    await cart.assertStartShoppingLink(page)
  })
})

// prettier-ignore
test.describe('Cart — Smoke — Mobile', { tag: ['@cart', '@mobile', '@smoke'] }, () => {
  test('Should render the cart page and show empty state', async ({ page, baseURL, cart }) => {
    await util.setDeviceMode(page, 'mobile')
    await cart.clearCart(page, baseURL!)
    await cart.navigate(page, baseURL!)
    await cart.assertEmptyState(page)
    await cart.assertStartShoppingLink(page)
  })
})
