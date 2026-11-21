import { test } from '../../src/fixtures'
import * as util from '../../helpers/utils'

// =============================================================================
// DESKTOP REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('PDP — Desktop', { tag: ['@pdp', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL, pdp }) => {
    await util.setDeviceMode(page, 'desktop')
    await pdp.navigate(page, baseURL!, 'tmn-royal-crest-hoodie')
  })

  test('Should display the product name', async ({ page, pdp }) => {
    await pdp.assertNameVisible(page)
  })

  test('Should display the product price in Naira', async ({ page, pdp }) => {
    await pdp.assertPriceInNaira(page)
  })

  test('Should display a product image', async ({ page, pdp }) => {
    await pdp.assertImageVisible(page)
  })

  // Skipped until Tomiwa adds product descriptions in Sanity Studio (tomanni-wear.sanity.studio)
  test.skip('Should display the product description', async ({ page, pdp }) => {
    await pdp.assertDescriptionVisible(page)
  })

  test('Should show the breadcrumb trail with Home / Products / product name', async ({ page, pdp }) => {
    await pdp.assertBreadcrumbVisible(page)
  })

  test('Should show a 404 page when the product slug does not exist', async ({ page, baseURL, pdp }) => {
    const response = await pdp.navigateToUnknownSlug(page, baseURL!)
    pdp.assertNotFoundStatus(response)
  })

  test('Should show "Sold Out" and disable the button when product is not in stock', async ({ page, pdp }) => {
    // Needs a product Tomiwa has marked out of stock — update slug when one exists
    test.skip(true, 'No product is currently marked out of stock')
    await pdp.assertSoldOut(page)
  })
})

// =============================================================================
// MOBILE REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('PDP — Mobile', { tag: ['@pdp', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL, pdp }) => {
    await util.setDeviceMode(page, 'mobile')
    await pdp.navigate(page, baseURL!, 'tmn-royal-crest-hoodie')
  })

  test('Should display the product name', async ({ page, pdp }) => {
    await pdp.assertNameVisible(page)
  })

  test('Should display the product price in Naira', async ({ page, pdp }) => {
    await pdp.assertPriceInNaira(page)
  })

  test('Should display a product image', async ({ page, pdp }) => {
    await pdp.assertImageVisible(page)
  })
})

// =============================================================================
// SMOKE COVERAGE
// =============================================================================

// prettier-ignore
test.describe('PDP — Smoke — Desktop', { tag: ['@pdp', '@desktop', '@smoke'] }, () => {
  test('Should render PDP with name, price, image and description', async ({ page, baseURL, pdp }) => {
    await util.setDeviceMode(page, 'desktop')
    await pdp.navigate(page, baseURL!, 'tmn-royal-crest-hoodie')
    await pdp.assertCoreDetailsVisible(page)
  })
})

// prettier-ignore
test.describe('PDP — Smoke — Mobile', { tag: ['@pdp', '@mobile', '@smoke'] }, () => {
  test('Should render PDP with name, price and image on mobile', async ({ page, baseURL, pdp }) => {
    await util.setDeviceMode(page, 'mobile')
    await pdp.navigate(page, baseURL!, 'tmn-royal-crest-hoodie')
    await pdp.assertMobileSmoke(page)
  })
})
