import { test } from '../../src/fixtures'
import * as util from '../../helpers/utils'

// =============================================================================
// DESKTOP REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('404 Page — Desktop', { tag: ['@not-found', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL, notFound }) => {
    await util.setDeviceMode(page, 'desktop')
    await notFound.navigate(page, baseURL!)
  })

  test('Should show the 404 page content', async ({ page, notFound }) => {
    await notFound.assertPageContent(page)
  })

  test('Should show the navbar with logo', async ({ page, notFound }) => {
    await notFound.assertNavbarVisible(page)
  })

  test('Should show the footer', async ({ page, notFound }) => {
    await notFound.assertFooterVisible(page)
  })

  test('Should show the breadcrumb', async ({ page, notFound }) => {
    await notFound.assertBreadcrumbVisible(page)
  })

  test('Back to Home CTA should link to /', async ({ page, notFound }) => {
    await notFound.clickHomeCta(page)
    await notFound.assertNavigatedHome(page)
  })

  test('Shop All CTA should link to /products', async ({ page, notFound }) => {
    await notFound.clickShopCta(page)
    await notFound.assertNavigatedToShop(page)
  })
})

// =============================================================================
// MOBILE REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('404 Page — Mobile', { tag: ['@not-found', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL, notFound }) => {
    await util.setDeviceMode(page, 'mobile')
    await notFound.navigate(page, baseURL!)
  })

  test('Should show navbar and footer on mobile', async ({ page, notFound }) => {
    await notFound.assertNavbarVisible(page)
    await notFound.assertFooterVisible(page)
  })

  test('Should show the 404 heading on mobile', async ({ page, notFound }) => {
    await notFound.assertPageContent(page)
  })
})

// =============================================================================
// SMOKE COVERAGE
// =============================================================================

// prettier-ignore
test.describe('404 Page — Smoke — Desktop', { tag: ['@not-found', '@desktop', '@smoke'] }, () => {
  test('Should show navbar, 404 content and footer on an unknown URL', async ({ page, baseURL, notFound }) => {
    await util.setDeviceMode(page, 'desktop')
    await notFound.navigate(page, baseURL!)
    await notFound.assertSmoke(page)
  })
})

// prettier-ignore
test.describe('404 Page — Smoke — Mobile', { tag: ['@not-found', '@mobile', '@smoke'] }, () => {
  test('Should show navbar, 404 content and footer on an unknown URL', async ({ page, baseURL, notFound }) => {
    await util.setDeviceMode(page, 'mobile')
    await notFound.navigate(page, baseURL!)
    await notFound.assertSmoke(page)
  })
})
