import { test }     from '../../fixtures/fixtures'
import * as plpPage  from '../../page-objects/plp.page'
import * as util     from '../../helpers/utils'

test.describe('PLP — product grid', { tag: ['@tomanni', '@plp', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await plpPage.navigate(page, baseURL!)
  })

  test('Should load the products page',                   async ({ page }) => { await plpPage.assertPageVisible(page) })
  test('Should display at least one product card',        async ({ page }) => { await plpPage.assertFirstCardVisible(page) })
  test('Should show a product name on each card',         async ({ page }) => { await plpPage.assertCardNameVisible(page) })
  test('Should show a price in Naira on each card',       async ({ page }) => { await plpPage.assertCardPriceInNaira(page) })
  test('Should show a product image on each card',        async ({ page }) => { await plpPage.assertCardImageVisible(page) })
  test('Should show a product count',                     async ({ page }) => { await plpPage.assertCountVisible(page) })
})

test.describe('PLP — navigation', { tag: ['@tomanni', '@plp', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await plpPage.navigate(page, baseURL!)
  })

  test('Should navigate to the PDP when a product card is clicked', async ({ page, baseURL }) => {
    await plpPage.assertNavigatesToPdp(page, baseURL!)
  })
})

test.describe('PLP — category filtering', { tag: ['@tomanni', '@plp', '@desktop'] }, () => {
  test('Should show men products when ?category=men is set', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await plpPage.navigate(page, baseURL!, 'men')
    await plpPage.assertCategoryGrid(page)
  })

  test('Should show empty state for a category with no products', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await plpPage.navigate(page, baseURL!, 'this-category-does-not-exist')
    await plpPage.assertEmptyState(page)
  })
})

test.describe('PLP — mobile', { tag: ['@tomanni', '@plp', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await plpPage.navigate(page, baseURL!)
  })

  test('Should display product cards on mobile',   async ({ page }) => { await plpPage.assertFirstCardVisible(page) })
  test('Should show price in Naira on mobile',     async ({ page }) => { await plpPage.assertCardPriceInNaira(page) })
})

test.describe('PLP smoke — Desktop', { tag: ['@tomanni-smoke', '@plp', '@desktop'] }, () => {
  test('Should render PLP with product grid on desktop', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await plpPage.navigate(page, baseURL!)
    await plpPage.assertGridVisible(page)
  })
})

test.describe('PLP smoke — Mobile', { tag: ['@tomanni-smoke', '@plp', '@mobile'] }, () => {
  test('Should render PLP with product grid on mobile', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await plpPage.navigate(page, baseURL!)
    await plpPage.assertMobileSmoke(page)
  })
})
