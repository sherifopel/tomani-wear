import { Page, expect } from '@playwright/test'
import { Log } from 'logr-kit'

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  LOCATORS                                                                  ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const homeSelectors = (page: Page) => {
  return {
    hero: {
      section:     page.locator('[data-testid="home-hero-section"]'),
      subtitle:    page.locator('[data-testid="home-hero-subtitle"]').first(),
      heading:     page.locator('[data-testid="home-hero-heading"]').first(),
      description: page.locator('[data-testid="home-hero-description"]').first(),
      ctaButton:   page.locator('[data-testid="home-hero-cta-button"]').first(),
      prevButton:  page.locator('[data-testid="home-carousel-prev-button"]'),
      nextButton:  page.locator('[data-testid="home-carousel-next-button"]'),
    },

    featured: {
      section:           page.locator('[data-testid="home-featured-products"]'),
      firstProductName:  page.locator('[data-testid="home-product-name-1"]'),
      firstProductPrice: page.locator('[data-testid="home-product-price-1"]'),
    },
  }
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ACTIONS                                                                   ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const navigate = async (page: Page, baseURL: string) => {
  Log.navigate(baseURL + '/')
  await page.goto(baseURL + '/')
  await page.waitForLoadState('domcontentloaded')
}

export const clickHeroCTA = async (page: Page) => {
  const { hero } = homeSelectors(page)
  await hero.ctaButton.click()
}

export const clickNextSlide = async (page: Page) => {
  const { hero } = homeSelectors(page)
  await hero.nextButton.click()
}

export const clickPrevSlide = async (page: Page) => {
  const { hero } = homeSelectors(page)
  await hero.prevButton.click()
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ASSERTIONS                                                                ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const assertHeroVisible = async (page: Page) => {
  Log.section('Hero — visible')
  const { hero } = homeSelectors(page)
  await expect(hero.section).toBeVisible()
  Log.ok('hero section')
  await expect(hero.heading).toBeVisible()
  Log.ok('heading')
  await expect(hero.subtitle).toBeVisible()
  Log.ok('subtitle')
}

export const assertHeroCTAVisible = async (page: Page) => {
  Log.section('Hero — CTA')
  const { hero } = homeSelectors(page)
  await expect(hero.ctaButton).toBeVisible()
  await expect(hero.ctaButton).toHaveText('Shop Now')
  Log.ok('Shop Now CTA')
}

export const assertHeroDescriptionVisible = async (page: Page) => {
  Log.section('Hero — description')
  const { hero } = homeSelectors(page)
  await expect(hero.description).toBeVisible()
  Log.ok('description')
}

export const assertFeaturedProductsVisible = async (page: Page) => {
  Log.section('Featured products')
  const { featured } = homeSelectors(page)
  await expect(featured.section).toBeVisible()
  Log.ok('section')
  await expect(featured.firstProductName).toBeVisible()
  Log.ok('first product name')
  await expect(featured.firstProductPrice).toBeVisible()
  Log.ok('first product price')
}

export const assertHeroHeightForViewport = async (
  page: Page,
  viewport: { width: number; height: number },
) => {
  await page.setViewportSize(viewport)
  await page.reload()
  await page.waitForLoadState('domcontentloaded')
  const { hero } = homeSelectors(page)
  const box = await hero.section.boundingBox()
  const expected = await page.evaluate((vw) => {
    // lg breakpoint (1024px+): hero uses aspect-ratio 1505/600, not svh
    if (vw >= 1024) return Math.round(vw * 600 / 1505)
    // mobile/tablet: hero = 100svh - header-height (set dynamically by StickyHeader)
    const headerH = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '84'
    )
    const testDiv = document.createElement('div')
    testDiv.style.cssText = 'height:100svh;position:absolute;visibility:hidden'
    document.body.appendChild(testDiv)
    const svh = testDiv.getBoundingClientRect().height
    document.body.removeChild(testDiv)
    return Math.round(svh - headerH)
  }, viewport.width)
  // Allow ±5px tolerance for subpixel rounding across browsers
  expect(box?.height).toBeGreaterThanOrEqual(expected - 5)
  expect(box?.height).toBeLessThanOrEqual(expected + 5)
  Log.ok(`hero height ${box?.height}px ≈ ${expected}px`)
}
