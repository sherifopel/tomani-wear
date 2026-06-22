import { test } from '../../../fixtures'
import * as homePage from '../../../pages/home.page'
import * as util from '../../../utils/utils'

// ─────────────────────────────────────────────────────────────────────────────
// 🖥  DESKTOP
// ─────────────────────────────────────────────────────────────────────────────

// prettier-ignore
test.describe('Homepage hero — Desktop', { tag: ['@tomanni', '@homepage', '@hero', '@desktop'] }, () => {
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
test.describe('Homepage hero responsive images — Desktop', { tag: ['@tomanni', '@homepage', '@hero', '@desktop'] }, () => {
  test('Should use aspect-ratio height (1505/600) on desktop', async ({ page, baseURL }) => {
    await homePage.navigate(page, baseURL!)
    await homePage.assertHeroHeightForViewport(page, { width: 1280, height: 900 }, Math.round(1280 * 600 / 1505))
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 📱 MOBILE
// ─────────────────────────────────────────────────────────────────────────────

// prettier-ignore
test.describe('Homepage hero — Mobile', { tag: ['@tomanni', '@homepage', '@hero', '@mobile'] }, () => {
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
test.describe('Homepage hero responsive images — Mobile', { tag: ['@tomanni', '@homepage', '@hero', '@mobile'] }, () => {
  test('Should fill the full viewport height on mobile', async ({ page, baseURL }) => {
    await homePage.navigate(page, baseURL!)
    await homePage.assertHeroHeightForViewport(page, { width: 375, height: 667 }, 667 - 84)
  })

  test('Should fill the full viewport height on tablet', async ({ page, baseURL }) => {
    await homePage.navigate(page, baseURL!)
    await homePage.assertHeroHeightForViewport(page, { width: 768, height: 900 }, 900 - 84)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 TOMANNI SMOKE
// ─────────────────────────────────────────────────────────────────────────────

// prettier-ignore
test.describe('Homepage smoke — Desktop', { tag: ['@tomanni-smoke', '@homepage', '@hero', '@desktop'] }, () => {
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
test.describe('Homepage smoke — Mobile', { tag: ['@tomanni-smoke', '@homepage', '@hero', '@mobile'] }, () => {
  test('Should render homepage with hero, CTA and featured products', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await homePage.navigate(page, baseURL!)
    await homePage.assertHeroVisible(page)
    await homePage.assertHeroDescriptionVisible(page)
    await homePage.assertHeroCTAVisible(page)
    await homePage.assertFeaturedProductsVisible(page)
  })
})
