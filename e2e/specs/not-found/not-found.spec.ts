import { test }           from '../../fixtures/fixtures'
import * as notFoundPage  from '../../page-objects/not-found.page'
import * as util          from '../../helpers/utils'

test.describe('404 page — desktop', { tag: ['@tomanni', '@not-found', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await notFoundPage.navigate(page, baseURL!)
  })

  test('Should show the 404 page content', async ({ page }) => {
    await notFoundPage.assertPageContent(page)
  })

  test('Should show the navbar with logo', async ({ page }) => {
    await notFoundPage.assertNavbarVisible(page)
  })

  test('Should show the footer', async ({ page }) => {
    await notFoundPage.assertFooterVisible(page)
  })

  test('Should show the breadcrumb', async ({ page }) => {
    await notFoundPage.assertBreadcrumbVisible(page)
  })

  test('Back to Home CTA should link to /', async ({ page, baseURL }) => {
    await notFoundPage.assertHomeCtaNavigates(page, baseURL!)
  })

  test('Shop All CTA should link to /products', async ({ page, baseURL }) => {
    await notFoundPage.assertShopCtaNavigates(page, baseURL!)
  })
})

test.describe('404 page — mobile', { tag: ['@tomanni', '@not-found', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await notFoundPage.navigate(page, baseURL!)
  })

  test('Should show navbar and footer on mobile', async ({ page }) => {
    await notFoundPage.assertNavbarVisible(page)
    await notFoundPage.assertFooterVisible(page)
  })

  test('Should show the 404 heading on mobile', async ({ page }) => {
    await notFoundPage.assertPageContent(page)
  })
})

test.describe('404 smoke', { tag: ['@tomanni-smoke', '@not-found'] }, () => {
  test('Should show navbar, 404 content and footer on an unknown URL', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await notFoundPage.navigate(page, baseURL!)
    await notFoundPage.assertSmoke(page)
  })
})
