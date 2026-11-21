import { test } from '../../src/fixtures'
import * as util from '../../helpers/utils'

// =============================================================================
// DESKTOP REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Home Header — Desktop', { tag: ['@home', '@header', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL, home }) => {
    await util.setDeviceMode(page, 'desktop')
    await home.navigate(page, baseURL!)
  })

  test('Should display search, account and cart actions', async ({ page, home }) => {
    await home.assertMobileHeaderActionsVisible(page)
  })

  // Regression test for the transparent-header CSS leak: the header starts
  // transparent (white text) over the hero, and that white-text rule was
  // bleeding into the "Men"/"Women" dropdown flyouts, which sit on their own
  // white background — making the category labels invisible (white-on-white).
  test('Men dropdown categories should be legible over the transparent hero header', async ({ page, home }) => {
    await home.openDesktopDropdown(page, 'men')
    await home.assertDesktopDropdownLinksVisible(page, 'men')
  })

  test('Women dropdown categories should be legible over the transparent hero header', async ({ page, home }) => {
    await home.openDesktopDropdown(page, 'women')
    await home.assertDesktopDropdownLinksVisible(page, 'women')
  })
})

// =============================================================================
// MOBILE REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Home Header — Mobile', { tag: ['@home', '@header', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL, home }) => {
    await util.setDeviceMode(page, 'mobile')
    await home.navigate(page, baseURL!)
  })

  test('Should display search, account and cart actions', async ({ page, home }) => {
    await home.assertMobileHeaderActionsVisible(page)
  })

  test('Should open the mobile menu when the hamburger is tapped', async ({ page, home }) => {
    await home.openMobileMenu(page)
    await home.assertMobileMenuDoesNotCoverHeader(page)
  })

  test('Should keep close button, logo, search, account and cart visible while menu is open', async ({ page, home }) => {
    await home.openMobileMenu(page)
    await home.assertMobileMenuContents(page)
  })

  test('Should close the menu when the close button is tapped', async ({ page, home }) => {
    await home.openMobileMenu(page)
    await home.closeMobileMenu(page)
  })

  test('Should show all nav links inside the menu', async ({ page, home }) => {
    await home.openMobileMenu(page)
    await home.assertMobileNavLinksVisible(page)
  })

  test('Should close the menu when a nav link is tapped', async ({ page, home }) => {
    await home.openMobileMenu(page)
    await home.assertMenuClosesOnMenClick(page)
  })

  test('Men link should navigate to /products?category=men — not a 404', async ({ page, home }) => {
    await home.openMobileMenu(page)
    await home.assertMenLinkNavigates(page)
  })

  test('Women link should navigate to /products?category=women — not a 404', async ({ page, home }) => {
    await home.openMobileMenu(page)
    await home.assertWomenLinkNavigates(page)
  })
})

// =============================================================================
// SMOKE COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Home Header — Smoke — Desktop', { tag: ['@home', '@header', '@desktop', '@smoke'] }, () => {
  test('Should show header actions and open a working nav dropdown', async ({ page, baseURL, home }) => {
    await util.setDeviceMode(page, 'desktop')
    await home.navigate(page, baseURL!)
    await home.assertMobileHeaderActionsVisible(page)
    await home.openDesktopDropdown(page, 'men')
    await home.assertDesktopDropdownLinksVisible(page, 'men')
  })
})

// prettier-ignore
test.describe('Home Header — Smoke — Mobile', { tag: ['@home', '@header', '@mobile', '@smoke'] }, () => {
  test('Should show header actions and open and close the mobile menu', async ({ page, baseURL, home }) => {
    await util.setDeviceMode(page, 'mobile')
    await home.navigate(page, baseURL!)
    await home.assertMobileHeaderActionsVisible(page)
    await home.openMobileMenu(page)
    await home.assertMobileMenuContents(page)
    await home.closeMobileMenu(page)
  })
})
