import { test }        from '../../../fixtures/fixtures'
import * as homePage   from '../../../page-objects/home.page'
import * as headerPage from '../../../page-objects/header.page'
import * as util       from '../../../helpers/utils'

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
test.describe('Homepage desktop dropdown', { tag: ['@tomanni', '@homepage', '@header', '@desktop', '@nav'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    // Hover-triggered dropdown is a desktop-only interaction (the nav itself
    // is CSS-hidden below the md breakpoint). No project emulates touch since
    // the terraform step-7 config change (browsers only, no devices[...]), so
    // the touch-device skip this used to need no longer applies — removed
    // 2026-11-20.
    await util.setDeviceMode(page, 'desktop')
    await homePage.navigate(page, baseURL!)
  })

  // Regression test for the transparent-header CSS leak: the header starts
  // transparent (white text) over the hero, and that white-text rule was
  // bleeding into the "Men"/"Women" dropdown flyouts, which sit on their own
  // white background — making the category labels invisible (white-on-white).
  test('Men dropdown categories should be legible over the transparent hero header', async ({ page }) => {
    const { desktopNav } = headerPage.headerSelectors(page)
    await headerPage.openDesktopDropdown(page, desktopNav.men)
    await headerPage.assertDesktopDropdownLinksVisible(desktopNav.men, 'Men')
  })

  test('Women dropdown categories should be legible over the transparent hero header', async ({ page }) => {
    const { desktopNav } = headerPage.headerSelectors(page)
    await headerPage.openDesktopDropdown(page, desktopNav.women)
    await headerPage.assertDesktopDropdownLinksVisible(desktopNav.women, 'Women')
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
    await headerPage.assertMenuClosesOnMenClick(page)
  })

  test('Men link should navigate to /products?category=men — not a 404', async ({ page, baseURL }) => {
    await headerPage.openMobileMenu(page)
    await headerPage.assertMenLinkNavigates(page, baseURL!)
  })

  test('Women link should navigate to /products?category=women — not a 404', async ({ page, baseURL }) => {
    await headerPage.openMobileMenu(page)
    await headerPage.assertWomenLinkNavigates(page, baseURL!)
  })
})
