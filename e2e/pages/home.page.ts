import { Page, expect } from '@playwright/test'

// ─── 1. SELECTOR FACTORY ──────────────────────────────────────────────────────
export const heroSelectors = (page: Page) => {
  // The carousel renders all slides in the DOM simultaneously.
  // Scope to the first slide so selectors don't match all 3 at once.
  const firstSlide = page.locator('[data-testid="home-hero-section"] > div > div').first()
  return {
    section:     page.locator('[data-testid="home-hero-section"]'),
    subtitle:    firstSlide.locator('[data-testid="home-hero-subtitle"]'),
    heading:     firstSlide.locator('[data-testid="home-hero-heading"]'),
    description: firstSlide.locator('[data-testid="home-hero-description"]'),
    ctaButton:   firstSlide.locator('[data-testid="home-hero-cta-button"]'),
    prevButton:  page.locator('[data-testid="home-carousel-prev-button"]'),
    nextButton:  page.locator('[data-testid="home-carousel-next-button"]'),
  }
}

export const featuredSelectors = (page: Page) => ({
  section: page.locator('[data-testid="home-featured-products"]'),
})

export const navSelectors = (page: Page) => ({
  searchButton: page.locator('[data-testid="nav-search-button"]'),
  accountButton: page.locator('[data-testid="nav-account-button"]'),
  cartButton: page.locator('[data-testid="nav-cart-button"]'),
})

// ─── 2. ACTION FUNCTIONS ──────────────────────────────────────────────────────
export const navigate = async (page: Page, baseURL: string) => {
  await page.goto(baseURL + '/')
  await page.waitForLoadState('domcontentloaded')
}

export const clickHeroCTA = async (page: Page) => {
  const selectors = heroSelectors(page)
  await selectors.ctaButton.click()
}

export const clickNextSlide = async (page: Page) => {
  const selectors = heroSelectors(page)
  await selectors.nextButton.click()
}

export const clickPrevSlide = async (page: Page) => {
  const selectors = heroSelectors(page)
  await selectors.prevButton.click()
}

// ─── 3. ASSERTION FUNCTIONS ───────────────────────────────────────────────────
export const assertHeroVisible = async (page: Page) => {
  const selectors = heroSelectors(page)
  await expect(selectors.section).toBeVisible()
  await expect(selectors.heading).toBeVisible()
  await expect(selectors.subtitle).toBeVisible()
}

export const assertHeroCTAVisible = async (page: Page) => {
  const selectors = heroSelectors(page)
  await expect(selectors.ctaButton).toBeVisible()
  await expect(selectors.ctaButton).toHaveText('Shop Now')
}

export const assertHeroDescriptionVisible = async (page: Page) => {
  const selectors = heroSelectors(page)
  await expect(selectors.description).toBeVisible()
}

export const assertFeaturedProductsVisible = async (page: Page) => {
  const selectors = featuredSelectors(page)
  await expect(selectors.section).toBeVisible()
}

export const assertMobileHeaderActionsVisible = async (page: Page) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const selectors = navSelectors(page)
  await expect(selectors.searchButton).toBeVisible()
  await expect(selectors.accountButton).toBeVisible()
  await expect(selectors.cartButton).toBeVisible()
}

export const assertHeroHeightForViewport = async (
  page: Page,
  viewport: { width: number; height: number },
  expectedHeight: number
) => {
  await page.setViewportSize(viewport)
  await page.reload()
  await page.waitForLoadState('domcontentloaded')

  const box = await heroSelectors(page).section.boundingBox()
  expect(box?.height).toBeCloseTo(expectedHeight, 1)
}
