import { test, expect } from '../../../fixtures'
import * as homePage from '../../../pages/home.page'
import * as headerPage from '../../../pages/header.page'
import * as util from '../../../utils/utils'

// prettier-ignore
test.describe('Homepage header — Desktop', { tag: ['@tomanni', '@homepage', '@header', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await homePage.navigate(page, baseURL!)
  })

  test('Should display search, account and cart actions', async ({ page }) => {
    await headerPage.assertMobileHeaderActionsVisible(page)
  })
})

// prettier-ignore
test.describe('Homepage header — Mobile', { tag: ['@tomanni', '@homepage', '@header', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await homePage.navigate(page, baseURL!)
  })

  test('Should display search, account and cart actions', async ({ page }) => {
    await headerPage.assertMobileHeaderActionsVisible(page)
  })
})

// prettier-ignore
test.describe('Homepage mobile menu', { tag: ['@tomanni', '@homepage', '@header', '@mobile', '@nav'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await homePage.navigate(page, baseURL!)
  })

  test('Should open the mobile menu when the hamburger is tapped', async ({ page }) => {
    await headerPage.openMobileMenu(page)
    await headerPage.assertMobileMenuCoversHeader(page)
  })

  test('Should show close button, logo, search, account and cart inside the menu', async ({ page }) => {
    await headerPage.openMobileMenu(page)
    await headerPage.assertMobileMenuContents(page)
  })

  test('Should close the menu when the close button is tapped', async ({ page }) => {
    await headerPage.openMobileMenu(page)
    await headerPage.closeMobileMenu(page)
  })

  test('Should show all nav links inside the menu', async ({ page }) => {
    await headerPage.openMobileMenu(page)
    await headerPage.assertMobileNavLinksVisible(page)
  })

  test('Should close the menu when a nav link is tapped', async ({ page }) => {
    await headerPage.openMobileMenu(page)
    const { mobileLinks, mobileMenu } = headerPage.headerSelectors(page)
    await mobileLinks.men.click()
    await expect(mobileMenu.overlay).not.toBeVisible()
  })
})
