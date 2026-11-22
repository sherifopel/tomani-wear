import { Page, expect } from '@playwright/test'
import { Log } from 'logr-kit'

// =============================================================================
// SELECTOR FACTORY
// =============================================================================

export function notFoundSelectors(page: Page) {
  return {

    page:       page.locator('[data-testid="not-found-page"]'),
    heading:    page.locator('[data-testid="not-found-heading"]'),
    message:    page.locator('[data-testid="not-found-message"]'),
    breadcrumb: page.locator('[data-testid="not-found-breadcrumb"]'),
    homeCta:    page.locator('[data-testid="not-found-home-cta"]'),
    shopCta:    page.locator('[data-testid="not-found-shop-cta"]'),
    navLogo:    page.locator('[data-testid="nav-logo-link"]'),
    footer:     page.locator('[data-testid="footer"]'),

  }
}

export const BROKEN_URL = '/this-page-does-not-exist-at-all'

// =============================================================================
// ACTIONS
// =============================================================================

export async function navigate(page: Page, baseURL: string) {
  Log.navigate(`${baseURL}${BROKEN_URL}`)
  await page.goto(`${baseURL}${BROKEN_URL}`, { waitUntil: 'domcontentloaded' })
}

export async function clickHomeCta(page: Page) {
  const { homeCta } = notFoundSelectors(page)
  Log.info('clicking the Back to Home CTA')
  await expect(homeCta).toBeVisible()
  await homeCta.click()
  Log.ok('Back to Home CTA clicked')
}

export async function clickShopCta(page: Page) {
  const { shopCta } = notFoundSelectors(page)
  Log.info('clicking the Shop All CTA')
  await expect(shopCta).toBeVisible()
  await shopCta.click()
  Log.ok('Shop All CTA clicked')
}

// =============================================================================
// ASSERTIONS
// =============================================================================

export async function assertPageContent(page: Page) {
  const { page: notFound, heading, message } = notFoundSelectors(page)
  await expect(notFound).toBeVisible()
  await expect(heading).toBeVisible()
  await expect(message).toBeVisible()
  Log.ok('404 page content visible')
}

export async function assertNavbarVisible(page: Page) {
  const { navLogo } = notFoundSelectors(page)
  await expect(navLogo).toBeVisible()
  Log.ok('navbar visible on 404 page')
}

export async function assertFooterVisible(page: Page) {
  const { footer } = notFoundSelectors(page)
  await expect(footer).toBeVisible()
  Log.ok('footer visible on 404 page')
}

export async function assertBreadcrumbVisible(page: Page) {
  const { breadcrumb } = notFoundSelectors(page)
  await expect(breadcrumb).toBeVisible()
  Log.ok('breadcrumb visible on 404 page')
}

export async function assertNavigatedHome(page: Page) {
  await expect(page).toHaveURL(/\/$/)
  Log.ok('Back to Home CTA navigated to /')
}

export async function assertNavigatedToShop(page: Page) {
  await expect(page).toHaveURL(/\/products$/)
  Log.ok('Shop All CTA navigated to /products')
}

export async function assertSmoke(page: Page) {
  const { navLogo, heading, footer } = notFoundSelectors(page)
  await expect(navLogo).toBeVisible()
  await expect(heading).toBeVisible()
  await expect(footer).toBeVisible()
  Log.ok('404 smoke passed')
}
