import { test, expect } from '../fixtures'
import * as homePage from '../pages/home.page'
import * as headerPage from '../pages/header.page'
import * as util from '../utils/utils'

// ─────────────────────────────────────────────────────────────────────────────
// 🖥  DESKTOP
// ─────────────────────────────────────────────────────────────────────────────

// prettier-ignore
test.describe('TW-4 Hero section — Desktop', { tag: ['@tomanni', '@TW-4', '@hero', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await homePage.navigate(page, baseURL!)
  })

  test('Should display the hero section with heading, subtitle and description', async ({ page }) => {
    await homePage.assertHeroVisible(page)
    await homePage.assertHeroDescriptionVisible(page)
  })

  test('Should display a Shop Now CTA button', async ({ page }) => {
    await homePage.assertHeroCTAVisible(page)
  })

  test('Should display the featured products section below the hero', async ({ page }) => {
    await homePage.assertFeaturedProductsVisible(page)
  })
})

// prettier-ignore
test.describe('TW-6 Hero responsive images — Desktop', { tag: ['@tomanni', '@TW-6', '@hero', '@desktop'] }, () => {
  test('Should use aspect-ratio height (1505/600) on desktop', async ({ page, baseURL }) => {
    await homePage.navigate(page, baseURL!)
    await homePage.assertHeroHeightForViewport(page, { width: 1280, height: 900 }, Math.round(1280 * 600 / 1505))
  })
})

// prettier-ignore
test.describe('TW-5 Header — Desktop', { tag: ['@tomanni', '@TW-5', '@header', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await homePage.navigate(page, baseURL!)
  })

  test('Should display search, account and cart actions', async ({ page }) => {
    await headerPage.assertMobileHeaderActionsVisible(page)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 📱 MOBILE
// ─────────────────────────────────────────────────────────────────────────────

// prettier-ignore
test.describe('TW-4 Hero section — Mobile', { tag: ['@tomanni', '@TW-4', '@hero', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await homePage.navigate(page, baseURL!)
  })

  test('Should display the hero section with heading, subtitle and description', async ({ page }) => {
    await homePage.assertHeroVisible(page)
    await homePage.assertHeroDescriptionVisible(page)
  })

  test('Should display a Shop Now CTA button', async ({ page }) => {
    await homePage.assertHeroCTAVisible(page)
  })

  test('Should display the featured products section below the hero', async ({ page }) => {
    await homePage.assertFeaturedProductsVisible(page)
  })
})

// prettier-ignore
test.describe('TW-6 Hero responsive images — Mobile', { tag: ['@tomanni', '@TW-6', '@hero', '@mobile'] }, () => {
  test('Should fill the full viewport height on mobile', async ({ page, baseURL }) => {
    await homePage.navigate(page, baseURL!)
    await homePage.assertHeroHeightForViewport(page, { width: 375, height: 667 }, 667 - 84)
  })

  test('Should fill the full viewport height on tablet', async ({ page, baseURL }) => {
    await homePage.navigate(page, baseURL!)
    await homePage.assertHeroHeightForViewport(page, { width: 768, height: 900 }, 900 - 84)
  })
})

// prettier-ignore
test.describe('TW-5 Header — Mobile', { tag: ['@tomanni', '@TW-5', '@header', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await homePage.navigate(page, baseURL!)
  })

  test('Should display search, account and cart actions', async ({ page }) => {
    await headerPage.assertMobileHeaderActionsVisible(page)
  })
})

// prettier-ignore
test.describe('TW-7 Mobile menu', { tag: ['@tomanni', '@TW-7', '@mobile', '@nav'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await homePage.navigate(page, baseURL!)
  })

  test('Should open the mobile menu when the hamburger is tapped', async ({ page }) => {
    await headerPage.openMobileMenu(page)
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

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 TOMANNI SMOKE
// ─────────────────────────────────────────────────────────────────────────────

// prettier-ignore
test.describe('TW-4 Homepage Smoke — Desktop', { tag: ['@tomanni-smoke', '@TW-4', '@hero', '@desktop'] }, () => {
  test('Should render homepage with hero, CTA and featured products', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await homePage.navigate(page, baseURL!)
    await homePage.assertHeroVisible(page)
    await homePage.assertHeroDescriptionVisible(page)
    await homePage.assertHeroCTAVisible(page)
    await homePage.assertFeaturedProductsVisible(page)
  })
})

// prettier-ignore
test.describe('TW-4 Homepage Smoke — Mobile', { tag: ['@tomanni-smoke', '@TW-4', '@hero', '@mobile'] }, () => {
  test('Should render homepage with hero, CTA and featured products', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await homePage.navigate(page, baseURL!)
    await homePage.assertHeroVisible(page)
    await homePage.assertHeroDescriptionVisible(page)
    await homePage.assertHeroCTAVisible(page)
    await homePage.assertFeaturedProductsVisible(page)
  })
})
