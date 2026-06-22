import { Page, expect } from '@playwright/test'

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  LOCATORS                                                                  ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const headerSelectors = (page: Page) => ({

  navBar: {
    searchButton:    page.locator('[data-testid="nav-search-button"]'),
    accountButton:   page.locator('[data-testid="nav-account-button"]'),
    cartButton:      page.locator('[data-testid="nav-cart-button"]'),
    announcementBar: page.locator('[data-testid="nav-announcement-bar"]'),
  },

  mobileMenu: {
    openButton:    page.locator('[data-testid="mobile-menu-open-button"]'),
    overlay:       page.locator('[data-testid="mobile-menu"]'),
    closeButton:   page.locator('[data-testid="mobile-menu-close-button"]'),
    logo:          page.locator('[data-testid="mobile-menu-logo"]'),
    searchButton:  page.locator('[data-testid="mobile-menu-search-button"]'),
    accountButton: page.locator('[data-testid="mobile-menu-account-button"]'),
    cartButton:    page.locator('[data-testid="mobile-menu-cart-button"]'),
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
  await page.setViewportSize({ width: 390, height: 844 })
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
  await page.setViewportSize({ width: 390, height: 844 })
  const { navBar } = headerSelectors(page)
  await expect(navBar.searchButton).toBeVisible()
  await expect(navBar.accountButton).toBeVisible()
  await expect(navBar.cartButton).toBeVisible()
}

export const assertMobileMenuContents = async (page: Page) => {
  const { mobileMenu } = headerSelectors(page)
  await expect(mobileMenu.closeButton).toBeVisible()
  await expect(mobileMenu.logo).toBeVisible()
  await expect(mobileMenu.searchButton).toBeVisible()
  await expect(mobileMenu.accountButton).toBeVisible()
  await expect(mobileMenu.cartButton).toBeVisible()
}

export const assertMobileNavLinksVisible = async (page: Page) => {
  const { mobileLinks } = headerSelectors(page)
  await expect(mobileLinks.newIn).toBeVisible()
  await expect(mobileLinks.men).toBeVisible()
  await expect(mobileLinks.women).toBeVisible()
  await expect(mobileLinks.accessories).toBeVisible()
  await expect(mobileLinks.collections).toBeVisible()
  await expect(mobileLinks.sale).toBeVisible()
}
