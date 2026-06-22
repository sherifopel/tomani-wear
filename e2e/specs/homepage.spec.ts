import { test } from '@playwright/test'
import * as homePage from '../pages/home.page'

// prettier-ignore
test.describe('TW-4 Hero section — Desktop', { tag: ['@tomanni', '@TW-4', '@hero', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => { await homePage.navigate(page, baseURL!) })

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

test.describe('TW-5 Header — Mobile', { tag: ['@tomanni', '@TW-5', '@header', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => { await homePage.navigate(page, baseURL!) })

  test('Should display search, account and cart actions', async ({ page }) => {
    await homePage.assertMobileHeaderActionsVisible(page)
  })
})

test.describe('TW-6 Hero responsive images', { tag: ['@tomanni', '@TW-6', '@hero', '@responsive'] }, () => {
  // With aspect-ratio layout the hero height = viewport width × (height / width) of the ratio.
  // aspect-[3/4]  → mobile  390px wide → 390 × 4/3  ≈ 520px
  // aspect-[4/3]  → tablet  768px wide → 768 × 3/4  ≈ 576px
  // aspect-[1505/600] → desktop 1280px wide → 1280 × 600/1505 ≈ 510px

  test('Should use a proportional hero height on mobile (aspect 3/4)', async ({ page, baseURL }) => {
    await homePage.navigate(page, baseURL!)
    await homePage.assertHeroHeightForViewport(page, { width: 390, height: 844 }, Math.round(390 * 4 / 3))
  })

  test('Should use a proportional hero height on tablet (aspect 4/3)', async ({ page, baseURL }) => {
    await homePage.navigate(page, baseURL!)
    await homePage.assertHeroHeightForViewport(page, { width: 768, height: 900 }, Math.round(768 * 3 / 4))
  })

  test('Should use a proportional hero height on desktop (aspect 1505/600)', async ({ page, baseURL }) => {
    await homePage.navigate(page, baseURL!)
    await homePage.assertHeroHeightForViewport(page, { width: 1280, height: 900 }, Math.round(1280 * 600 / 1505))
  })
})

// ─── TOMANNI SMOKE ────────────────────────────────────────────────────────────
// prettier-ignore
test.describe('TW-4 Homepage Smoke — Desktop', { tag: ['@tomanni-smoke', '@TW-4', '@hero', '@desktop'] }, () => {
  test('Should render homepage with hero, CTA and featured products', async ({ page, baseURL }) => {
    await homePage.navigate(page, baseURL!)
    await homePage.assertHeroVisible(page)
    await homePage.assertHeroDescriptionVisible(page)
    await homePage.assertHeroCTAVisible(page)
    await homePage.assertFeaturedProductsVisible(page)
  })
})
