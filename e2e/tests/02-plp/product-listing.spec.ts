import { test } from '../../src/fixtures'
import * as util from '../../helpers/utils'

// =============================================================================
// DESKTOP REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('PLP — Desktop', { tag: ['@plp', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL, plp }) => {
    await util.setDeviceMode(page, 'desktop')
    await plp.navigate(page, baseURL!)
  })

  test('Should load the products page', async ({ page, plp }) => {
    await plp.assertPageVisible(page)
  })

  test('Should display at least one product card', async ({ page, plp }) => {
    await plp.assertFirstCardVisible(page)
  })

  test('Should show a product name on each card', async ({ page, plp }) => {
    await plp.assertCardNameVisible(page)
  })

  test('Should show a price in Naira on each card', async ({ page, plp }) => {
    await plp.assertCardPriceInNaira(page)
  })

  test('Should show a product image on each card', async ({ page, plp }) => {
    await plp.assertCardImageVisible(page)
  })

  test('Should show a product count', async ({ page, plp }) => {
    // No product-count UI exists in the PLP component today — checked
    // src/app/(store)/products/page.tsx, no "count" text or plp-count testid
    // anywhere. Either removed in a past redesign or never built. Not adding
    // the feature as a side effect of a test-structure migration; flagging
    // for Sherif to decide whether to build it or drop this test for good.
    test.skip(true, 'plp-count does not exist in the PLP component — no product-count UI currently exists')
    await plp.assertCountVisible(page)
  })

  test('Should navigate to the PDP when a product card is clicked', async ({ page, baseURL, plp }) => {
    await plp.clickFirstProductCard(page)
    await plp.assertNavigatedToPdp(page, baseURL!)
  })

  test('Should show men products when ?category=men is set', async ({ page, baseURL, plp }) => {
    await plp.navigate(page, baseURL!, 'men')
    await plp.assertCategoryGrid(page)
  })

  test('Should show empty state for a category with no products', async ({ page, baseURL, plp }) => {
    await plp.navigate(page, baseURL!, 'this-category-does-not-exist')
    await plp.assertEmptyState(page)
  })
})

// =============================================================================
// MOBILE REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('PLP — Mobile', { tag: ['@plp', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL, plp }) => {
    await util.setDeviceMode(page, 'mobile')
    await plp.navigate(page, baseURL!)
  })

  test('Should display product cards on mobile', async ({ page, plp }) => {
    await plp.assertFirstCardVisible(page)
  })

  test('Should show price in Naira on mobile', async ({ page, plp }) => {
    await plp.assertCardPriceInNaira(page)
  })
})

// =============================================================================
// SMOKE COVERAGE
// =============================================================================

// prettier-ignore
test.describe('PLP — Smoke — Desktop', { tag: ['@plp', '@desktop', '@smoke'] }, () => {
  test('Should render PLP with product grid on desktop', async ({ page, baseURL, plp }) => {
    await util.setDeviceMode(page, 'desktop')
    await plp.navigate(page, baseURL!)
    await plp.assertGridVisible(page)
  })
})

// prettier-ignore
test.describe('PLP — Smoke — Mobile', { tag: ['@plp', '@mobile', '@smoke'] }, () => {
  test('Should render PLP with product grid on mobile', async ({ page, baseURL, plp }) => {
    await util.setDeviceMode(page, 'mobile')
    await plp.navigate(page, baseURL!)
    await plp.assertMobileSmoke(page)
  })
})
