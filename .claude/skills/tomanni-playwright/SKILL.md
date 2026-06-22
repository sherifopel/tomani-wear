---
name: tomanni-playwright
description: >
  Writes Playwright TypeScript tests for the Tomani Wear Next.js project following
  Sherif's strict conventions — strict PO/spec separation, data-testid selectors only,
  nested selector groups, box dividers between sections, GWT scenarios mapped to
  individual test() blocks, @tomanni tags, and a mandatory smoke section at the bottom
  of every spec file.
  Use this skill whenever Sherif asks to write, generate, or scaffold Playwright tests,
  e2e tests, spec files, page objects, or acceptance criteria tests for Tomani Wear.
  Also trigger when a GitHub issue has GWT acceptance criteria and Sherif says "write
  the tests" or "wire up the spec" or similar.
---

# Tomanni Playwright Test Writer

You are writing Playwright TypeScript tests for **Tomani Wear** — a Next.js ecommerce
project. Follow these conventions exactly: no shortcuts, no deviations.

---

## The Golden Rule: Strict PO / Spec Separation

**Spec files** are orchestration only — they call PO methods, nothing else.
**Page Objects** are where all Playwright knowledge lives.

### What NEVER belongs in a spec file
- `page.locator(...)`, `page.getByText(...)`, `page.getByRole(...)`, `page.getByTestId(...)` — all locators go in the PO
- `expect(...)` — all assertions go in PO `assertX` functions
- `page.goto(url)` — always wrapped in a PO `navigate` method
- `page.waitForTimeout(...)` — banned entirely, never use it

### Banned wait strategies
- **`page.waitForLoadState('networkidle')`** — never use this. The carousel autoplay and other async UI features keep the network busy, so networkidle never fires and the test times out.
- **`page.waitForTimeout(...)`** — never use arbitrary sleeps.

### Correct wait strategy in navigate functions
```ts
export const navigate = async (page: Page, baseURL: string) => {
  await page.goto(baseURL + '/')
  await page.waitForLoadState('domcontentloaded')
}
```
`domcontentloaded` fires as soon as the HTML is parsed — fast and reliable. If you need to confirm a specific element is ready before acting, use `locator.waitFor({ state: 'visible' })` in the PO.

---

## Spec File Structure

```ts
import { test, expect } from '../../fixtures'
import * as featurePage from '../../pages/feature.page'
import * as util from '../../utils/utils'

// prettier-ignore
test.describe('TW-N Feature Name — Desktop', { tag: ['@tomanni', '@TW-N', '@feature', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await featurePage.navigate(page, baseURL!)
  })

  test('Should show the hero section with heading and CTA', async ({ page }) => {
    await featurePage.assertHeroVisible(page)
    await featurePage.assertHeroCTAVisible(page)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 TOMANNI SMOKE
// ─────────────────────────────────────────────────────────────────────────────

// prettier-ignore
test.describe('TW-N Feature Name Smoke — Desktop', { tag: ['@tomanni-smoke', '@TW-N', '@feature', '@desktop'] }, () => {
  test('Should render feature end-to-end', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await featurePage.navigate(page, baseURL!)
    await featurePage.assertHeroVisible(page)
    await featurePage.assertHeroCTAVisible(page)
  })
})
```

### Tags — required on every `test.describe`

| Tag | Purpose |
|---|---|
| `@tomanni` | Regression suite — always first |
| `@tomanni-smoke` | PR gate suite — use instead of `@tomanni` on smoke describes |
| `@TW-N` | GitHub issue number (e.g. `@TW-12`) |
| `@hero` / `@nav` / `@cart` / `@pdp` / `@checkout` / `@featured` | Feature area |
| `@desktop` or `@mobile` | Viewport |

### Smoke section rules
- Every spec file must have a smoke section at the very bottom
- Separator: `// ─────────────────────────────────────────────────────────────────────────────`  
  then `// 🚀 TOMANNI SMOKE` then the same separator line
- 1 smoke test per viewport
- Smoke test chains ALL acceptance criteria end-to-end in a single `test()` block
- Call existing named PO functions directly — do NOT create a wrapper `assertXxxSmoke` PO function just to aggregate them

### Formatting rules
- `// prettier-ignore` above every `test.describe`
- `test.describe` on a single line
- `test` declarations on a single line
- Test titles always start with `Should`
- Import order: fixtures first, then page objects alphabetically, then utils

---

## Page Object Structure

Always in this order — selectors, actions, assertions. Box dividers separate each section.

```ts
import { Page, expect } from '@playwright/test'

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  LOCATORS                                                                  ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const featureSelectors = (page: Page) => ({

  hero: {
    section:     page.locator('[data-testid="home-hero-section"]'),
    heading:     page.locator('[data-testid="home-hero-heading"]'),
    subtitle:    page.locator('[data-testid="home-hero-subtitle"]'),
    description: page.locator('[data-testid="home-hero-description"]'),
    ctaButton:   page.locator('[data-testid="home-hero-cta-button"]'),
  },

  featured: {
    section: page.locator('[data-testid="home-featured-products"]'),
  },

})

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ACTIONS                                                                   ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const navigate = async (page: Page, baseURL: string) => {
  await page.goto(baseURL + '/')
  await page.waitForLoadState('domcontentloaded')
}

export const clickHeroCTA = async (page: Page) => {
  const { hero } = featureSelectors(page)   // ← always destructure the group
  await hero.ctaButton.click()
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ASSERTIONS                                                                ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const assertHeroVisible = async (page: Page) => {
  const { hero } = featureSelectors(page)
  await expect(hero.section).toBeVisible()
  await expect(hero.heading).toBeVisible()
}
```

### Naming conventions
- Selector factory: one per file, named `featureSelectors` (e.g. `heroSelectors`, `headerSelectors`, `cartSelectors`)
- Groups inside the factory: logical sub-areas (e.g. `navBar`, `mobileMenu`, `mobileLinks`)
- Actions: `clickX`, `openX`, `closeX`, `navigate`, `selectX`
- Assertions: `assertX`
- **Always destructure the group, never assign the whole object:**
  ```ts
  const { hero } = homeSelectors(page)         // ✅ correct
  const { mobileMenu } = headerSelectors(page) // ✅ correct
  const selectors = homeSelectors(page)        // ✗ wrong — too broad
  const m = mobileMenuSelectors(page)          // ✗ wrong — single-letter var, banned
  ```

### Locator strategy
- `[data-testid="..."]` always — never `getByText`, `getByRole`, `getByLabel`
- Straight ASCII quotes only — no curly quotes
- Never write a locator for a testid that doesn't exist in the source — add it to the JSX first

### When to use nested groups
- Use nested groups when the PO covers multiple distinct UI areas (e.g. nav bar + mobile menu)
- For single-focus POs (e.g. cart page), a flat structure is fine — all selectors at the top level

---

## Viewport handling

Use `setDeviceMode` from `e2e/utils/utils.ts` — never set raw viewport sizes in specs:

```ts
import * as util from '../../utils/utils'

// In beforeEach or inline in smoke tests:
await util.setDeviceMode(page, 'desktop')  // 1440×1080
await util.setDeviceMode(page, 'mobile')   // 375×667 (iPhone SE)
await util.setDeviceMode(page, 'tablet')   // 768×1024
```

---

## Known data-testids

See `references/testids.md` for the full registry. Never write a locator for a testid that doesn't exist in the source — add it to the JSX first.

```
Nav:    nav-header, nav-main-row, nav-logo-link, nav-announcement-bar, nav-links,
        nav-search-button, nav-account-button, nav-cart-button, nav-cart-count

Mobile: mobile-menu-open-button, mobile-menu, mobile-menu-close-button,
        mobile-menu-logo, mobile-menu-search-button, mobile-menu-account-button,
        mobile-menu-cart-button,
        mobile-menu-link-new-in, mobile-menu-link-men, mobile-menu-link-women,
        mobile-menu-link-accessories, mobile-menu-link-collections, mobile-menu-link-sale

Hero:   home-hero-section, home-hero-subtitle, home-hero-heading,
        home-hero-description, home-hero-cta-button,
        home-carousel-prev-button, home-carousel-next-button

Featured: home-featured-products, home-product-name-1, home-product-price-1

Cart:   cart-page, cart-empty, cart-start-shopping, cart-items, cart-item-name,
        cart-item-price, cart-item-quantity, cart-remove-item, cart-total, cart-checkout

PDP:    pdp-page, pdp-breadcrumb, pdp-main-image, pdp-name, pdp-price-row,
        pdp-price, pdp-compare-price, pdp-sale-badge, pdp-description,
        pdp-size-selector, pdp-add-to-cart, pdp-size-{size}
```

---

## File locations

```
e2e/
├── fixtures.ts             ← import test/expect from here, never directly from @playwright/test
├── tsconfig.json
├── utils/
│   └── utils.ts            ← setDeviceMode, VIEWPORTS
├── pages/                  ← page objects go here (one per feature area)
│   ├── home.page.ts
│   ├── header.page.ts
│   ├── cart.page.ts
│   └── pdp.page.ts
└── specs/                  ← organised by feature folder
    ├── homepage/
    │   ├── header.section/
    │   │   └── header.spec.ts
    │   └── hero.section/
    │       └── hero.spec.ts
    ├── cart/
    │   └── cart.spec.ts
    └── pdp/
        └── product-detail.spec.ts
```

---

## GWT → test() mapping

- **Given** → `test.beforeEach` with `setDeviceMode` + `navigate`
- **When** → PO action calls inside the test body
- **Then** → PO `assertX` calls
- Smoke test at the bottom chains them all

---

## Before writing anything

1. Identify the GitHub issue number → `@TW-N` tag
2. Map each GWT to a `test()` block
3. Check data-testids — flag any missing ones and add them to JSX first
4. Write the PO first, then the spec
5. Always include the smoke section at the bottom
