import { Page, expect } from '@playwright/test'
import { Log } from 'logr-kit'

// =============================================================================
// SELECTOR FACTORY
// =============================================================================

export const homeSelectors = (page: Page) => ({

  hero: {
    section:     page.locator('[data-testid="home-hero-section"]').first(),
    subtitle:    page.locator('[data-testid="home-hero-subtitle"]').first(),
    heading:     page.locator('[data-testid="home-hero-heading"]').first(),
    description: page.locator('[data-testid="home-hero-description"]').first(),
    ctaButton:   page.locator('[data-testid="home-hero-cta-button"]').first(),
    prevButton:  page.locator('[data-testid="home-carousel-prev-button"]'),
    nextButton:  page.locator('[data-testid="home-carousel-next-button"]'),
  },

  featured: {
    section:           page.locator('[data-testid="home-featured-products"]').first(),
    firstProductName:  page.locator('[data-testid="home-product-name-1"]').first(),
    firstProductPrice: page.locator('[data-testid="home-product-price-1"]').first(),
  },

  navBar: {
    mainRow:         page.locator('[data-testid="nav-main-row"]'),
    logo:            page.locator('[data-testid="nav-logo-link"]'),
    searchButton:    page.locator('[data-testid="nav-search-button"]'),
    accountButton:   page.locator('[data-testid="nav-account-button"]'),
    cartButton:      page.locator('[data-testid="nav-cart-button"]'),   // desktop drawer button
    cartLink:        page.locator('[data-testid="nav-cart-link"]'),     // mobile link to /cart
    announcementBar: page.locator('[data-testid="nav-announcement-bar"]'),
  },

  mobileMenu: {
    openButton:  page.locator('[data-testid="mobile-menu-open-button"]'),
    overlay:     page.locator('[data-testid="mobile-menu"]'),
    closeButton: page.locator('[data-testid="mobile-menu-close-button"]'),
  },

  mobileLinks: {
    newIn:       page.locator('[data-testid="mobile-menu-link-new-in"]'),
    men:         page.locator('[data-testid="mobile-menu-link-men"]'),
    women:       page.locator('[data-testid="mobile-menu-link-women"]'),
    accessories: page.locator('[data-testid="mobile-menu-link-accessories"]'),
    collections: page.locator('[data-testid="mobile-menu-link-collections"]'),
    sale:        page.locator('[data-testid="mobile-menu-link-sale"]'),
  },

  desktopNav: {
    men:   page.locator('[data-testid="nav-men-link"]'),
    women: page.locator('[data-testid="nav-women-link"]'),
  },

})

// =============================================================================
// ACTIONS
// =============================================================================

export const navigate = async (page: Page, baseURL: string) => {
  Log.navigate(baseURL + '/')
  await page.goto(baseURL + '/', { waitUntil: 'domcontentloaded' })
}

export const clickHeroCTA = async (page: Page) => {
  const { hero } = homeSelectors(page)
  Log.info('clicking the hero CTA')
  await expect(hero.ctaButton).toBeVisible()
  await hero.ctaButton.click()
  Log.ok('hero CTA clicked')
}

export const clickNextSlide = async (page: Page) => {
  const { hero } = homeSelectors(page)
  Log.info('clicking next carousel slide')
  await expect(hero.nextButton).toBeVisible()
  await hero.nextButton.click()
  Log.ok('advanced to next slide')
}

export const clickPrevSlide = async (page: Page) => {
  const { hero } = homeSelectors(page)
  Log.info('clicking previous carousel slide')
  await expect(hero.prevButton).toBeVisible()
  await hero.prevButton.click()
  Log.ok('went back to previous slide')
}

export const openMobileMenu = async (page: Page) => {
  const { mobileMenu } = homeSelectors(page)
  Log.info('opening the mobile menu')
  await expect(mobileMenu.openButton).toBeVisible()
  await mobileMenu.openButton.click()
  await expect(mobileMenu.overlay).toBeVisible()
  Log.ok('mobile menu open')
}

export const closeMobileMenu = async (page: Page) => {
  const { mobileMenu } = homeSelectors(page)
  Log.info('closing the mobile menu')
  await expect(mobileMenu.closeButton).toBeVisible()
  await mobileMenu.closeButton.click()
  await expect(mobileMenu.overlay).not.toBeVisible()
  Log.ok('mobile menu closed')
}

// Every top-level nav item's dropdown lives in the DOM at once (just hidden
// via group-hover CSS), so a page-wide "[data-testid^='nav-sub-']" selector
// would always match whichever item comes first in the DOM — not necessarily
// the one currently open. Scope to the trigger's own wrapper (its parent
// ".group/navitem" div, which is the dropdown's only container) instead.
const dropdownSubLinks = (trigger: ReturnType<typeof homeSelectors>['desktopNav']['men']) =>
  trigger.locator('xpath=..').locator('[data-testid^="nav-sub-"]')

export const openDesktopDropdown = async (page: Page, item: 'men' | 'women') => {
  const { desktopNav } = homeSelectors(page)
  const trigger = desktopNav[item]
  Log.info(`opening the ${item} nav dropdown`)
  await trigger.hover()
  // The dropdown fades in with a short transition — wait for the first
  // sub-link in THIS dropdown to actually be visible rather than racing
  // the CSS transition or matching a different (still-hidden) dropdown.
  await expect(dropdownSubLinks(trigger).first()).toBeVisible()
  Log.ok(`${item} dropdown open`)
}

// =============================================================================
// ASSERTIONS
// =============================================================================

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
  const expected = await page.evaluate(() => {
    const cw = document.documentElement.clientWidth
    const testDiv = document.createElement('div')
    testDiv.style.cssText = 'height:100svh;position:absolute;visibility:hidden'
    document.body.appendChild(testDiv)
    const svh = testDiv.getBoundingClientRect().height
    document.body.removeChild(testDiv)

    if (cw < 768) {
      // Mobile: always fills the visible screen (globals.css "div.home-section-banner"
      // under the max-width:767px rule) — no header-height subtraction. This used to
      // subtract --header-height; the CSS was deliberately changed to always fill the
      // screen on mobile (see its comment) and this test was never updated to match,
      // undetected because it had never actually run against a live server before.
      return Math.round(svh)
    } else {
      // Tablet+: height = var(--h, 80vh) — read the actual vh% from the element's inline style
      const banner = document.querySelector('[data-testid="home-hero-section"]') as HTMLElement | null
      const hVar = banner
        ? getComputedStyle(banner).getPropertyValue('--h').trim()
        : '80vh'
      const vhPct = parseFloat(hVar) || 80
      return Math.round(vhPct * svh / 100)
    }
  })
  // Allow ±5px tolerance for subpixel rounding across browsers
  expect(box?.height).toBeGreaterThanOrEqual(expected - 5)
  expect(box?.height).toBeLessThanOrEqual(expected + 5)
  Log.ok(`hero height ${box?.height}px ≈ ${expected}px`)
}

export const assertNavActionsVisible = async (page: Page) => {
  Log.section('Nav bar actions')
  const { navBar } = homeSelectors(page)
  await expect(navBar.searchButton).toBeVisible()
  Log.ok('search button')
  await expect(navBar.accountButton).toBeVisible()
  Log.ok('account button')
  // One of cartLink (mobile) or cartButton (desktop) is visible depending on viewport
  const cartVisible = navBar.cartLink.or(navBar.cartButton).filter({ visible: true })
  await expect(cartVisible).toBeVisible()
  Log.ok('cart button/link')
}

export const assertMobileHeaderActionsVisible = async (page: Page) => {
  await assertNavActionsVisible(page)
}

export const assertMobileMenuContents = async (page: Page) => {
  Log.section('Mobile header remains visible with menu open')
  const { mobileMenu, navBar } = homeSelectors(page)
  await expect(mobileMenu.closeButton).toBeVisible()
  Log.ok('close button')
  await expect(navBar.logo).toBeVisible()
  Log.ok('logo')
  await expect(navBar.searchButton).toBeVisible()
  Log.ok('search button')
  await expect(navBar.accountButton).toBeVisible()
  Log.ok('account button')
  await expect(navBar.cartLink).toBeVisible()
  Log.ok('cart link (mobile)')
}

export const assertMobileMenuDoesNotCoverHeader = async (page: Page) => {
  Log.section('Mobile menu does not cover header')
  const { mobileMenu, navBar } = homeSelectors(page)
  await expect(mobileMenu.overlay).toBeVisible()

  const elementsToCheck = [navBar.mainRow]
  // Announcement bar is optional (can be disabled in Sanity settings)
  if (await navBar.announcementBar.isVisible({ timeout: 2000 }).catch(() => false)) {
    elementsToCheck.unshift(navBar.announcementBar)
  }

  for (const locator of elementsToCheck) {
    const box = await locator.boundingBox()
    expect(box).not.toBeNull()

    const isMenuOnTop = await page.evaluate(({ x, y }) => {
      const topElement = document.elementFromPoint(x, y)
      return Boolean(topElement?.closest('[data-testid="mobile-menu"]'))
    }, {
      x: box!.x + box!.width / 2,
      y: box!.y + box!.height / 2,
    })

    expect(isMenuOnTop).toBe(false)
    Log.ok('header stays above ' + (await locator.getAttribute('data-testid')))
  }

  const menuBox = await mobileMenu.overlay.boundingBox()
  const headerBox = await navBar.mainRow.boundingBox()
  expect(menuBox).not.toBeNull()
  expect(headerBox).not.toBeNull()
  expect(menuBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height - 1)
}

export const assertMobileNavLinksVisible = async (page: Page) => {
  Log.section('Mobile nav links')
  const { mobileLinks } = homeSelectors(page)

  const links = [
    { locator: mobileLinks.newIn,       label: 'New In' },
    { locator: mobileLinks.men,         label: 'Men' },
    { locator: mobileLinks.women,       label: 'Women' },
    { locator: mobileLinks.accessories, label: 'Accessories' },
    { locator: mobileLinks.collections, label: 'Collections' },
    { locator: mobileLinks.sale,        label: 'Sale' },
  ]

  for (const { locator, label } of links) {
    await expect(locator).toBeVisible()

    // Verify link text is not white — catches the transparent-header CSS
    // cascade bug where color:white on the header leaks into the menu panel.
    const color = await locator.evaluate(el =>
      window.getComputedStyle(el).color
    )
    expect(color, `${label} link must not be white`).not.toBe('rgb(255, 255, 255)')

    Log.ok(label)
  }
}

export const assertDesktopDropdownLinksVisible = async (page: Page, item: 'men' | 'women') => {
  const { desktopNav } = homeSelectors(page)
  const trigger = desktopNav[item]
  const label = item === 'men' ? 'Men' : 'Women'
  Log.section(`Desktop dropdown — ${label}`)
  const subLinks = dropdownSubLinks(trigger)
  const count = await subLinks.count()
  expect(count, `${label} dropdown should list at least one category`).toBeGreaterThan(0)

  for (let i = 0; i < count; i++) {
    const link = subLinks.nth(i)
    await expect(link).toBeVisible()

    const text = (await link.textContent())?.trim() ?? ''
    expect(text, `dropdown item ${i} under ${label} must have visible text`).not.toBe('')

    // Verify link text is not white — catches the transparent-header CSS
    // cascade bug where color:white on the header leaks into this flyout
    // panel too (same class of bug already fixed for the mobile menu above).
    const color = await link.evaluate(el => window.getComputedStyle(el).color)
    expect(color, `"${text}" under ${label} must not be white-on-white`).not.toBe('rgb(255, 255, 255)')

    Log.ok(`${label} → ${text}`)
  }
}

export const assertMenuClosesOnMenClick = async (page: Page) => {
  const { mobileLinks, mobileMenu } = homeSelectors(page)
  await mobileLinks.men.click()
  await expect(mobileMenu.overlay).not.toBeVisible()
  Log.ok('menu closed after men link click')
}

export const assertMenLinkNavigates = async (page: Page) => {
  const { mobileLinks } = homeSelectors(page)
  await mobileLinks.men.click()
  await expect(page).toHaveURL(/\/products\?category=men$/)
  await expect(page.locator('[data-testid="plp-page"]')).toBeVisible()
  Log.ok('men link navigates to /products?category=men')
}

export const assertWomenLinkNavigates = async (page: Page) => {
  const { mobileLinks } = homeSelectors(page)
  await mobileLinks.women.click()
  await expect(page).toHaveURL(/\/products\?category=women$/)
  await expect(page.locator('[data-testid="plp-page"]')).toBeVisible()
  Log.ok('women link navigates to /products?category=women')
}
