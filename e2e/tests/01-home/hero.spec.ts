import { test } from '../../src/fixtures'
import * as util from '../../helpers/utils'

// =============================================================================
// DESKTOP REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Home Hero — Desktop', { tag: ['@home', '@hero', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL, home }) => {
    await util.setDeviceMode(page, 'desktop')
    await home.navigate(page, baseURL!)
  })

  test('Should display the hero section with heading, subtitle and description', async ({ page, home }) => {
    await home.assertHeroVisible(page)
    await home.assertHeroDescriptionVisible(page)
  })

  test('Should display a Shop Now CTA button', async ({ page, home }) => {
    await home.assertHeroCTAVisible(page)
  })

  test('Should display the featured products section below the hero', async ({ page, home }) => {
    await home.assertFeaturedProductsVisible(page)
  })

  test('Should use aspect-ratio height (1505/600) on desktop', async ({ page, home }) => {
    await home.assertHeroHeightForViewport(page, { width: 1280, height: 900 })
  })
})

// =============================================================================
// MOBILE REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Home Hero — Mobile', { tag: ['@home', '@hero', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL, home }) => {
    await util.setDeviceMode(page, 'mobile')
    await home.navigate(page, baseURL!)
  })

  test('Should display the hero section with heading, subtitle and description', async ({ page, home }) => {
    await home.assertHeroVisible(page)
    await home.assertHeroDescriptionVisible(page)
  })

  test('Should display a Shop Now CTA button', async ({ page, home }) => {
    await home.assertHeroCTAVisible(page)
  })

  test('Should display the featured products section below the hero', async ({ page, home }) => {
    await home.assertFeaturedProductsVisible(page)
  })

  test('Should fill the full viewport height on mobile', async ({ page, home }) => {
    await home.assertHeroHeightForViewport(page, { width: 375, height: 667 })
  })

  test('Should fill the full viewport height on tablet', async ({ page, home }) => {
    await home.assertHeroHeightForViewport(page, { width: 768, height: 900 })
  })
})

// =============================================================================
// SMOKE COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Home Hero — Smoke — Desktop', { tag: ['@home', '@hero', '@desktop', '@smoke'] }, () => {
  test('Should render homepage with hero, CTA and featured products', async ({ page, baseURL, home }) => {
    await util.setDeviceMode(page, 'desktop')
    await home.navigate(page, baseURL!)
    await home.assertHeroVisible(page)
    await home.assertHeroCTAVisible(page)
    await home.assertFeaturedProductsVisible(page)
  })
})

// prettier-ignore
test.describe('Home Hero — Smoke — Mobile', { tag: ['@home', '@hero', '@mobile', '@smoke'] }, () => {
  test('Should render homepage with hero, CTA and featured products', async ({ page, baseURL, home }) => {
    await util.setDeviceMode(page, 'mobile')
    await home.navigate(page, baseURL!)
    await home.assertHeroVisible(page)
    await home.assertHeroCTAVisible(page)
    await home.assertFeaturedProductsVisible(page)
  })
})
