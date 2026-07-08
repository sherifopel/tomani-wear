import { test }      from '../../fixtures/fixtures'
import * as cartPage  from '../../page-objects/cart.page'
import * as pdpPage   from '../../page-objects/pdp.page'
import * as util      from '../../helpers/utils'

// prettier-ignore
test.describe('Cart — empty state', { tag: ['@tomanni', '@cart', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await page.goto(baseURL!, { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => localStorage.removeItem('tomani-cart'))
    await cartPage.navigate(page, baseURL!)
  })

  test('Should show empty cart message when no items are in the cart', async ({ page }) => {
    await cartPage.assertEmptyState(page)
  })

  test('Should show a "Start Shopping" link that goes to /products', async ({ page }) => {
    await cartPage.assertStartShoppingLink(page)
  })
})

// prettier-ignore
test.describe('Cart — size validation', { tag: ['@tomanni', '@cart', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await page.goto(baseURL!, { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => localStorage.removeItem('tomani-cart'))
  })

  test('Should show size error when Add to Cart is clicked without selecting a size', async ({ page, baseURL }) => {
    await pdpPage.navigate(page, baseURL!, 'skeleton-hoodie')
    await pdpPage.assertSoldOut(page)
  })
})

// prettier-ignore
test.describe('Cart — empty state — Mobile', { tag: ['@tomanni', '@cart', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await page.goto(baseURL!, { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => localStorage.removeItem('tomani-cart'))
    await cartPage.navigate(page, baseURL!)
  })

  test('Should show empty cart message on mobile', async ({ page }) => {
    await cartPage.assertEmptyState(page)
  })
})

// prettier-ignore
test.describe('Cart smoke', { tag: ['@tomanni-smoke', '@cart'] }, () => {
  test('Should render the cart page and show empty state', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await page.goto(baseURL!, { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => localStorage.removeItem('tomani-cart'))
    await cartPage.navigate(page, baseURL!)
    await cartPage.assertEmptyState(page)
    await cartPage.assertStartShoppingLink(page)
  })
})
