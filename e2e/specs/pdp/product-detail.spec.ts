import { test }     from '../../fixtures/fixtures'
import * as pdpPage  from '../../page-objects/pdp.page'
import * as util     from '../../helpers/utils'

// prettier-ignore
test.describe('PDP — core details', { tag: ['@tomanni', '@pdp', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await pdpPage.navigate(page, baseURL!, 'tmn-royal-crest-hoodie')
  })

  test('Should display the product name',                                   async ({ page }) => { await pdpPage.assertNameVisible(page) })
  test('Should display the product price in Naira',                         async ({ page }) => { await pdpPage.assertPriceInNaira(page) })
  test('Should display a product image',                                    async ({ page }) => { await pdpPage.assertImageVisible(page) })
  test('Should display the product description',                            async ({ page }) => { await pdpPage.assertDescriptionVisible(page) })
  test('Should show the breadcrumb trail with Home / Products / product name', async ({ page }) => { await pdpPage.assertBreadcrumbVisible(page) })
})

// prettier-ignore
test.describe('PDP — sold-out state', { tag: ['@tomanni', '@pdp', '@desktop'] }, () => {
  test.skip() // Needs a product Tomiwa has marked out of stock — update slug when one exists

  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await pdpPage.navigate(page, baseURL!, 'tmn-royal-crest-hoodie')
  })

  test('Should show "Sold Out" and disable the button when product is not in stock', async ({ page }) => {
    await pdpPage.assertSoldOut(page)
  })
})

// prettier-ignore
test.describe('PDP — core details — Mobile', { tag: ['@tomanni', '@pdp', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await pdpPage.navigate(page, baseURL!, 'tmn-royal-crest-hoodie')
  })

  test('Should display the product name',         async ({ page }) => { await pdpPage.assertNameVisible(page) })
  test('Should display the product price in Naira', async ({ page }) => { await pdpPage.assertPriceInNaira(page) })
  test('Should display a product image',          async ({ page }) => { await pdpPage.assertImageVisible(page) })
})

// prettier-ignore
test.describe('PDP — 404 for unknown slug', { tag: ['@tomanni', '@pdp'] }, () => {
  test('Should show a 404 page when the product slug does not exist', async ({ page, baseURL }) => {
    await pdpPage.assertNotFoundStatus(page, baseURL!)
  })
})

// prettier-ignore
test.describe('PDP smoke — Desktop', { tag: ['@tomanni-smoke', '@pdp', '@desktop'] }, () => {
  test('Should render PDP with name, price, image and description', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await pdpPage.navigate(page, baseURL!, 'tmn-royal-crest-hoodie')
    await pdpPage.assertCoreDetailsVisible(page)
  })
})

// prettier-ignore
test.describe('PDP smoke — Mobile', { tag: ['@tomanni-smoke', '@pdp', '@mobile'] }, () => {
  test('Should render PDP with name, price and image on mobile', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await pdpPage.navigate(page, baseURL!, 'tmn-royal-crest-hoodie')
    await pdpPage.assertMobileSmoke(page)
  })
})
