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

  test('Should open the mobile menu when the hamburger is tapped',async ({ page }) => {
    await headerPage.openMobileMenu(page)
    await headerPage.assertMobileMenuDoesNotCoverHeader(page)
  })

  test('Should keep close button, logo, search, account and cart visible while menu is open', async ({ page }) => {
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

  // Regression: mobile menu previously used /men, /women etc. which 404'd.
  // These tests lock in the correct /products?category= hrefs permanently.
  test('Men link should navigate to /products?category=men — not a 404', async ({ page, baseURL }) => {
    await headerPage.openMobileMenu(page)
    const { mobileLinks } = headerPage.headerSelectors(page)
    await mobileLinks.men.click()
    await expect(page).toHaveURL(`${baseURL}/products?category=men`)
    await expect(page.locator('[data-testid="plp-page"]')).toBeVisible()
  })

  test('Women link should navigate to /products?category=women — not a 404', async ({ page, baseURL }) => {
    await headerPage.openMobileMenu(page)
    const { mobileLinks } = headerPage.headerSelectors(page)
    await mobileLinks.women.click()
    await expect(page).toHaveURL(`${baseURL}/products?category=women`)
    await expect(page.locator('[data-testid="plp-page"]')).toBeVisible()
  })
})
