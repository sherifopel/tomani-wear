import { Page, expect } from '@playwright/test'
import { Log } from 'logr-kit'

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  LOCATORS                                                                  ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const notFoundSelectors = (page: Page) => ({
  page:      page.locator('[data-testid="not-found-page"]'),
  heading:   page.locator('[data-testid="not-found-heading"]'),
  message:   page.locator('[data-testid="not-found-message"]'),
  breadcrumb: page.locator('[data-testid="not-found-breadcrumb"]'),
  homeCta:   page.locator('[data-testid="not-found-home-cta"]'),
  shopCta:   page.locator('[data-testid="not-found-shop-cta"]'),
  navLogo:   page.locator('[data-testid="nav-logo-link"]'),
  footer:    page.locator('[data-testid="footer"]'),
})

export const BROKEN_URL = '/this-page-does-not-exist-at-all'

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ACTIONS                                                                   ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const navigate = async (page: Page, baseURL: string) => {
  Log.navigate(`${baseURL}${BROKEN_URL}`)
  await page.goto(`${baseURL}${BROKEN_URL}`, { waitUntil: 'domcontentloaded' })
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ASSERTIONS                                                                ║
// ╚════════════════════════════════════════════════════════════════════════════╝

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

export const assertHomeCtaNavigates = async (page: Page, baseURL: string) => {
  const { homeCta } = notFoundSelectors(page)
  await homeCta.click()
  await expect(page).toHaveURL(`${baseURL}/`)
  Log.ok('Back to Home CTA navigates to /')
}

export const assertShopCtaNavigates = async (page: Page, baseURL: string) => {
  await navigate(page, baseURL)
  const { shopCta } = notFoundSelectors(page)
  await shopCta.click()
  await expect(page).toHaveURL(`${baseURL}/products`)
  Log.ok('Shop All CTA navigates to /products')
}

export const assertSmoke = async (page: Page) => {
  const { navLogo, heading, footer } = notFoundSelectors(page)
  await expect(navLogo).toBeVisible()
  await expect(heading).toBeVisible()
  await expect(footer).toBeVisible()
  Log.ok('404 smoke passed')
}
