import { Page, expect } from '@playwright/test'
import { Log } from 'logr-kit'

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  LOCATORS                                                                  ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const homeSelectors = (page: Page) => {
  // The carousel renders all slides simultaneously — scope to slide 1
  // so locators don't match the same testid across all 3 slides at once.
  const firstSlide = page.locator('[data-testid="home-hero-section"] > div > div').first()

  return {
    hero: {
      section:     page.locator('[data-testid="home-hero-section"]'),
      subtitle:    firstSlide.locator('[data-testid="home-hero-subtitle"]'),
      heading:     firstSlide.locator('[data-testid="home-hero-heading"]'),
      description: firstSlide.locator('[data-testid="home-hero-description"]'),
      ctaButton:   firstSlide.locator('[data-testid="home-hero-cta-button"]'),
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
  expectedHeight: number
) => {
  await page.setViewportSize(viewport)
  await page.reload()
  await page.waitForLoadState('domcontentloaded')
  const { hero } = homeSelectors(page)
  const box = await hero.section.boundingBox()
  // Allow ±5px tolerance for subpixel rounding across browsers
  expect(box?.height).toBeGreaterThanOrEqual(expectedHeight - 5)
  expect(box?.height).toBeLessThanOrEqual(expectedHeight + 5)
}
