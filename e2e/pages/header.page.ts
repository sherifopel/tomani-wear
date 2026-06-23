import { Page, expect } from '@playwright/test'
import { Log } from 'logr-kit'

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  LOCATORS                                                                  ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const headerSelectors = (page: Page) => ({

  navBar: {
    mainRow:       page.locator('[data-testid="nav-main-row"]'),
    logo:          page.locator('[data-testid="nav-logo-link"]'),
    searchButton:    page.locator('[data-testid="nav-search-button"]'),
    accountButton:   page.locator('[data-testid="nav-account-button"]'),
    cartButton:      page.locator('[data-testid="nav-cart-button"]'),
    announcementBar: page.locator('[data-testid="nav-announcement-bar"]'),
  },

  mobileMenu: {
    openButton:    page.locator('[data-testid="mobile-menu-open-button"]'),
    overlay:       page.locator('[data-testid="mobile-menu"]'),
    closeButton:   page.locator('[data-testid="mobile-menu-close-button"]'),
  },

  mobileLinks: {
    newIn:        page.locator('[data-testid="mobile-menu-link-new-in"]'),
    men:          page.locator('[data-testid="mobile-menu-link-men"]'),
    women:        page.locator('[data-testid="mobile-menu-link-women"]'),
    accessories:  page.locator('[data-testid="mobile-menu-link-accessories"]'),
    collections:  page.locator('[data-testid="mobile-menu-link-collections"]'),
    sale:         page.locator('[data-testid="mobile-menu-link-sale"]'),
  },

})

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ACTIONS                                                                   ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const openMobileMenu = async (page: Page) => {
  await page.setViewportSize({ width: 375, height: 667 })
  const { mobileMenu } = headerSelectors(page)
  await mobileMenu.openButton.click()
  await expect(mobileMenu.overlay).toBeVisible()
}

export const closeMobileMenu = async (page: Page) => {
  const { mobileMenu } = headerSelectors(page)
  await mobileMenu.closeButton.click()
  await expect(mobileMenu.overlay).not.toBeVisible()
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ASSERTIONS                                                                ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const assertMobileHeaderActionsVisible = async (page: Page) => {
  Log.section('Nav bar actions')
  await page.setViewportSize({ width: 375, height: 667 })
  const { navBar } = headerSelectors(page)
  await expect(navBar.searchButton).toBeVisible()
  Log.ok('search button')
  await expect(navBar.accountButton).toBeVisible()
  Log.ok('account button')
  await expect(navBar.cartButton).toBeVisible()
  Log.ok('cart button')
}

export const assertMobileMenuContents = async (page: Page) => {
  Log.section('Mobile header remains visible with menu open')
  const { mobileMenu, navBar } = headerSelectors(page)
  await expect(mobileMenu.closeButton).toBeVisible()
  Log.ok('close button')
  await expect(navBar.logo).toBeVisible()
  Log.ok('logo')
  await expect(navBar.searchButton).toBeVisible()
  Log.ok('search button')
  await expect(navBar.accountButton).toBeVisible()
  Log.ok('account button')
  await expect(navBar.cartButton).toBeVisible()
  Log.ok('cart button')
}

export const assertMobileMenuDoesNotCoverHeader = async (page: Page) => {
  Log.section('Mobile menu does not cover header')
  const { mobileMenu, navBar } = headerSelectors(page)
  await expect(mobileMenu.overlay).toBeVisible()

  for (const locator of [navBar.announcementBar, navBar.mainRow]) {
    const box = await locator.boundingBox()
    expect(box).not.toBeNull()

    const isMenuOnTop = await page.evaluate(({ x, y }) => {
      const topElement = document.elementFromPoint(x, y)
      return Boolean(topElement?.closest('[data-testid="mobile-menu"]'))
    }, {
      x: box!.x + box!.width / 2,
      y: box!.y + box!.height / 2,
    })

    expect(isMenuOnTop).toBe(false)
    Log.ok('header stays above ' + (await locator.getAttribute('data-testid')))
  }

  const menuBox = await mobileMenu.overlay.boundingBox()
  const headerBox = await navBar.mainRow.boundingBox()
  expect(menuBox).not.toBeNull()
  expect(headerBox).not.toBeNull()
  expect(menuBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height - 1)
}

export const assertMobileNavLinksVisible = async (page: Page) => {
  Log.section('Mobile nav links')
  const { mobileLinks } = headerSelectors(page)
  await expect(mobileLinks.newIn).toBeVisible()
  Log.ok('New In')
  await expect(mobileLinks.men).toBeVisible()
  Log.ok('Men')
  await expect(mobileLinks.women).toBeVisible()
  Log.ok('Women')
  await expect(mobileLinks.accessories).toBeVisible()
  Log.ok('Accessories')
  await expect(mobileLinks.collections).toBeVisible()
  Log.ok('Collections')
  await expect(mobileLinks.sale).toBeVisible()
  Log.ok('Sale')
}
