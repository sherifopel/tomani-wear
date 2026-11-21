import { Page, expect } from '@playwright/test'
import { Log } from 'logr-kit'

// =============================================================================
// SELECTOR FACTORY
// =============================================================================

export const notFoundSelectors = (page: Page) => ({

  page:       page.locator('[data-testid="not-found-page"]'),
  heading:    page.locator('[data-testid="not-found-heading"]'),
  message:    page.locator('[data-testid="not-found-message"]'),
  breadcrumb: page.locator('[data-testid="not-found-breadcrumb"]'),
  homeCta:    page.locator('[data-testid="not-found-home-cta"]'),
  shopCta:    page.locator('[data-testid="not-found-shop-cta"]'),
  navLogo:    page.locator('[data-testid="nav-logo-link"]'),
  footer:     page.locator('[data-testid="footer"]'),

})

export const BROKEN_URL = '/this-page-does-not-exist-at-all'

// =============================================================================
// ACTIONS
// =============================================================================

export const navigate = async (page: Page, baseURL: string) => {
  Log.navigate(`${baseURL}${BROKEN_URL}`)
  await page.goto(`${baseURL}${BROKEN_URL}`, { waitUntil: 'domcontentloaded' })
}

export const clickHomeCta = async (page: Page) => {
  const { homeCta } = notFoundSelectors(page)
  Log.info('clicking the Back to Home CTA')
  await expect(homeCta).toBeVisible()
  await homeCta.click()
  Log.ok('Back to Home CTA clicked')
}

export const clickShopCta = async (page: Page) => {
  const { shopCta } = notFoundSelectors(page)
  Log.info('clicking the Shop All CTA')
  await expect(shopCta).toBeVisible()
  await shopCta.click()
  Log.ok('Shop All CTA clicked')
}

// =============================================================================
// ASSERTIONS
// =============================================================================

export const assertPageContent = async (page: Page) => {
  const { page: notFound, heading, message } = notFoundSelectors(page)
  await expect(notFound).toBeVisible()
  await expect(heading).toBeVisible()
  await expect(message).toBeVisible()
  Log.ok('404 page content visible')
}

export const assertNavbarVisible = async (page: Page) => {
  const { navLogo } = notFoundSelectors(page)
  await expect(navLogo).toBeVisible()
  Log.ok('navbar visible on 404 page')
}

export const assertFooterVisible = async (page: Page) => {
  const { footer } = notFoundSelectors(page)
  await expect(footer).toBeVisible()
  Log.ok('footer visible on 404 page')
}

export const assertBreadcrumbVisible = async (page: Page) => {
  const { breadcrumb } = notFoundSelectors(page)
  await expect(breadcrumb).toBeVisible()
  Log.ok('breadcrumb visible on 404 page')
}

export const assertNavigatedHome = async (page: Page) => {
  await expect(page).toHaveURL(/\/$/)
  Log.ok('Back to Home CTA navigated to /')
}

export const assertNavigatedToShop = async (page: Page) => {
  await expect(page).toHaveURL(/\/products$/)
  Log.ok('Shop All CTA navigated to /products')
}

export const assertSmoke = async (page: Page) => {
  const { navLogo, heading, footer } = notFoundSelectors(page)
  await expect(navLogo).toBeVisible()
  await expect(heading).toBeVisible()
  await expect(footer).toBeVisible()
  Log.ok('404 smoke passed')
}
