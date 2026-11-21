---
name: tomanni-playwright
description: >
  Writes Playwright TypeScript tests for the Tomanni Wear Next.js project following the
  Terraform Vault reference standard: numbered journey folders, one page object per
  journey with a selector factory, three-line banners, four describes per spec
  (Desktop, Mobile, Smoke Desktop, Smoke Mobile), fixture-injected page objects, and
  Log.info/Log.ok on every action and assertion.
  Use this skill whenever Sherif asks to write, generate, or scaffold Playwright tests,
  e2e tests, spec files, page objects, or acceptance criteria tests for Tomanni Wear.
  Also trigger when a GitHub issue has GWT acceptance criteria and Sherif says "write
  the tests" or "wire up the spec" or similar.
---

# Tomanni Playwright Test Writer

Conventions for **Tomanni Wear**, a Next.js ecommerce project. Follow them exactly.

**This file is canonical inside this repo.** It mirrors the reference standard in the
Terraform Vault (`Knowledge/Skills/Roll out the reference structure`). Decided
2026-11-19: Tomanni Wear adopts that reference, replacing the earlier box-divider
convention. Migration progress lives in the vault at
`Projects/Tomanni Wear/Tomanni Wear terraform plan`. Where this file and the vault
disagree, this file wins and the difference is recorded in the plan.

## The golden rule: strict page object / spec separation

Specs orchestrate. Page objects hold every piece of Playwright knowledge.

### Never in a spec
- `page.locator(...)`, `page.getByRole(...)`, `page.getByTestId(...)` or any locator
- `expect(...)`: assertions live in page object `assert...` functions
- `page.goto(url)`: always wrapped in a page object `navigate`
- `page.waitForTimeout(...)`: banned outright
- a direct page object import: see **Fixtures** below

### Banned wait strategies
- **`waitForLoadState('networkidle')`**: never. Carousel autoplay and other async UI keep
  the network busy, so networkidle never fires and the test times out.
- **`waitForTimeout(...)`**: never an arbitrary sleep.

Navigate like this:

```ts
export const navigate = async (page: Page, baseURL: string) => {
  Log.navigate(baseURL)
  await page.goto(baseURL + '/', { waitUntil: 'domcontentloaded' })
}
```

When a specific element must be ready before acting, use an awaited `expect()` readiness
assertion on that same locator inside the page object. Never branch on `isVisible()` or
`isHidden()` to establish readiness.

## Dividers: two tiers

**Tier 1**, main sections, column 0, 80 characters, all caps, one title between two bars:

```ts
// =============================================================================
// SELECTOR FACTORY
// =============================================================================
```

**Tier 2**, numbered subdividers inside a describe, class or object, 4-space indent,
84 characters:

```ts
    // -----------------------------------------------------------------------------
    // 1. PRICES AND QUANTITIES
    // -----------------------------------------------------------------------------
```

Numbering restarts inside each describe or class. Titles are short nouns
("PRICES AND QUANTITIES"), never sentences. Never use a divider as a comment about code;
if a section needs explaining, rename the section.

> Changed 2026-11-19: the old box dividers are replaced by the tier 1 banner above. If
> Sherif prefers the boxes once he has seen the result, that becomes a recorded deviation
> in the plan, not a silent revert.

## Page object structure

One file per journey area. **Never split into `.selectors.ts`, `.actions.ts` and
`.assertions.ts`.** Three sections, in this order.

1. **`SELECTOR FACTORY`**: one exported `<feature>Selectors(page)` returning nested groups
   by page area. Do not annotate its return type. Define each locator directly in its
   property on one line: no intermediate variables, no per-index helper properties, and
   nothing eagerly evaluated (`.all()`, `.count()`, text reads). Factories return lazy
   locators.
2. **`ACTIONS`**: standalone exported async functions named for a user interaction.
   Destructure the relevant group, assert readiness on the same locator, then interact.
   Start with `Log.info()` and finish with `Log.ok()`.
3. **`ASSERTIONS`**: standalone exported `assert...` functions. Reuse the factory and
   verify outcomes. No clicks, fills or other interactions. Finish with `Log.ok()`; no
   starting `Log.info()` is required.

```ts
import { Page, expect } from '@playwright/test'
import { Log } from 'logr-kit'

// =============================================================================
// SELECTOR FACTORY
// =============================================================================

export const homeSelectors = (page: Page) => ({

  hero: {
    section:   page.locator('[data-testid="home-hero-section"]'),
    heading:   page.locator('[data-testid="home-hero-heading"]'),
    ctaButton: page.locator('[data-testid="home-hero-cta-button"]'),
  },

  featured: {
    section: page.locator('[data-testid="home-featured-products"]'),
  },

})

// =============================================================================
// ACTIONS
// =============================================================================

export const clickHeroCTA = async (page: Page) => {
  const { hero } = homeSelectors(page)
  Log.info('clicking the hero CTA')
  await expect(hero.ctaButton).toBeVisible()
  await hero.ctaButton.click()
  Log.ok('hero CTA clicked')
}

// =============================================================================
// ASSERTIONS
// =============================================================================

export const assertHeroVisible = async (page: Page) => {
  const { hero } = homeSelectors(page)
  await expect(hero.section).toBeVisible()
  await expect(hero.heading).toBeVisible()
  Log.ok('hero is visible')
}
```

### Naming
- Factory: `<feature>Selectors`, one per file (`homeSelectors`, `headerSelectors`).
- Actions: `clickX`, `openX`, `closeX`, `selectX`, `navigate`.
- Assertions: `assertX`.
- **Always destructure the group**, never the whole object, and never a single-letter
  variable:

```ts
const { hero } = homeSelectors(page)          // correct
const selectors = homeSelectors(page)         // wrong, too broad
const m = headerSelectors(page)               // wrong, single letter
```

### Collections and shared behaviour
Define the container and scope the item collection to it, then pick with `.nth(index)`
inside an action or assertion. Never add a factory property per index, and never do the
indexing in a spec.

Shared component behaviour has one owner: compose its existing functions rather than
duplicating them across page objects. Multi-page journeys live in `JourneyFlows.ts`,
which holds no selectors of its own.

## Locator strategy

Prefer, in this order:
1. `[data-testid="..."]`
2. roles, labels, text
3. CSS, with a written justification

Verify every selector against the component source. Never write a locator for a testid
that does not exist in the JSX; add it there first. Straight ASCII quotes only. Do not
blindly combine desktop and mobile alternatives, and never use `.first()` to hide an
ambiguous locator.

## Logging

**Never `console.log`.** Use `Log` from `logr-kit` (`github:sherifopel/pw-log`), which this
repo already depends on. A bare `console.log`, `console.info` or `console.error` in a spec
or page object is a review failure.

| Where | Rule |
|---|---|
| Action | opens with `Log.info()`, closes with `Log.ok()` |
| Assertion | closes with `Log.ok()`; no opening log is required |
| `navigate` | `Log.navigate(url)` before the `goto` |

`Log.section()` is available for grouping related output and is fine to use.

Check **placement, not counts**. An action that logs only at the end is not compliant, and
neither is one that closes with `Log.info()` instead of `Log.ok()`.

```ts
// correct: opens with info, closes with ok
export const clickAddToCart = async (page: Page) => {
  const { addToCart } = pdpSelectors(page)
  Log.info('clicking Add to Cart')
  await expect(addToCart).toBeVisible()
  await addToCart.click()
  Log.ok('Add to Cart clicked')
}
```

```ts
// wrong: one log, at the end, at the opening level
export const clickAddToCart = async (page: Page) => {
  const { addToCart } = pdpSelectors(page)
  await addToCart.click()
  Log.info('clicked Add to Cart')
}
```

> Migration note: 9 of the 11 page objects already log, 137 calls in total, so the habit is
> there. The pattern is inverted in most actions: they close with `Log.info()` rather than
> opening with it, and often have no closing `Log.ok()`. Across the suite there are 101
> `Log.ok` against only 8 `Log.info`. `accessibility.page.ts` and `smoke.page.ts` have no
> logging at all. Correcting this is plan step 16.

## Spec structure

File: `tests/NN-<folder>/<feature>.spec.ts`. The first import is `test` from the fixtures
file. Four top-level describes, in this order, each under a tier 1 banner (the emoji are
part of the banner):

| # | Banner | Describe title |
|---|---|---|
| 1 | `DESKTOP REGRESSION COVERAGE` | `<Feature> - Desktop` |
| 2 | `MOBILE REGRESSION COVERAGE` | `<Feature> - Mobile` |
| 3 | `SMOKE COVERAGE` | `<Feature> - Smoke - Desktop` |
| 4 | the same banner's second describe | `<Feature> - Smoke - Mobile` |

The Mobile describe's `beforeEach` calls `setDeviceMode(page, 'mobile')` before
navigation.

### Formatting rules
- `// prettier-ignore` directly above every `test.describe`
- `test.describe` on a single line
- each `test` declaration, including its fixture parameters and the opening brace, on a
  single line; the body stays multiline
- each import declaration on a single line
- test titles start with "Should" and describe behaviour only
- no `test.step`, no `page.pause`, no `.only`, and no comments except a hidden constraint

### Smoke
Condense the feature's scenarios into as few meaningful tests as practical per viewport,
usually one. Chain the existing page object calls in the test body and add no aggregating
wrapper. Never copy a regression test as the smoke. Every regression test marked critical
must be reached by smoke, or carry a stated reason. Smoke is the deploy gate: keep it
fast, stable and read-only on production. Whenever a critical regression test is added or
changed, extend smoke for both viewports in the same change.

### Exceptions
The accessibility folder has Desktop and Mobile only. A one-shot preflight in
`00-global/` has no viewport split.

## Fixtures: how a spec reaches a page object

Specs reach page objects and runtime helpers **through injected fixtures**, never through
a direct module import. Data and type imports may stay direct.

```ts
// correct
test('Should show the hero section', async ({ page, home }) => {
  await home.assertHeroVisible(page)
})
```

```ts
// wrong: direct module import
import * as homePage from '../../page-objects/home.page'
```

Every page object gets an export in `e2e/src/index.ts` and a fixture of the same name in
`e2e/src/fixtures.ts`.

> Migration note: specs import page object modules directly today. Converting them is
> plan steps 11 and 14.

## Tags

Tags choose **where a describe runs**. They never mark a single test. Fixed order:

1. Folder tag: `@home`, `@plp`, `@pdp`, `@cart`, `@checkout`, `@account`,
   `@accessibility`, `@global`
2. Feature tag, when the folder holds several: `@navigation`, `@hero`
3. Viewport: `@desktop` or `@mobile`
4. Environment: `@prod`, `@preview`
5. `@smoke` on smoke describes
6. Markers last: `@TW-N`, the GitHub issue. Nothing selects on it; it exists so every
   spec traces to its requirement. This is a recorded deviation from the reference.

Never put a tag in a test title or on an individual test. Do not invent marker tags that
nothing selects on.

A test that writes on production skips itself from its first line:

```ts
test('Should place an order', async ({ page, isProd }) => {
  test.skip(isProd, 'Writes an order; production is read-only.')
})
```

> Migration note: specs use `@tomanni` and `@tomanni-smoke` today. `@tomanni-smoke`
> becomes `@smoke`, and `@tomanni` is dropped because it tags everything and selects
> nothing. That rename must land in the same change as the `package.json` scripts,
> `.github/workflows/smoke.yml` and the reporter sections in `playwright.config.ts`, or
> the smoke gate will silently select nothing.

## Viewports

Use `setDeviceMode` from `e2e/helpers/utils.ts`. Never set a raw viewport in a spec.

```ts
await util.setDeviceMode(page, 'desktop')  // 1440 x 1080
await util.setDeviceMode(page, 'mobile')   // 375 x 667, iPhone SE
await util.setDeviceMode(page, 'tablet')   // 768 x 1024
```

## File locations

Current (2026-11-21, after plan step 12):

```
e2e/
  src/
    fixtures.ts              every spec imports `test` from here
    index.ts                 page object barrel
  helpers/utils.ts            setDeviceMode, navigateTo
  page-objects/*.page.ts
  tests/
    00-global/                real: environment-health.spec.ts
    01-home/ .. 08-accessibility/   empty, .gitkeep only — see tests/NUMBERING.md
    <feature>/                 the old, still-live flat folders (homepage/, plp/, pdp/,
                                cart/, checkout/, account/, not-found/, accessibility/,
                                smoke/) — not yet moved into the numbered folders above
```

Target, plan steps 12 to 18:

```
e2e/
  tests/
    00-global/
    01-home/                home, header, footer, search
    02-plp/
    03-pdp/
    05-cart/
    06-checkout/
    07-account/
    NN-accessibility/
  pages/                    flat, numbered, one per journey area
    01-HomePage.ts
    JourneyFlows.ts         multi-page journeys, no selectors
  helpers/  data/  types/  reporters/  scripts/
  src/                      fixtures.ts, index.ts
```

A journey keeps its number in every project. A journey this project does not have leaves
its number unused, and nothing is renumbered.

## Known data-testids

Never write a locator for a testid that does not exist in the source. Add it to the JSX
first.

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
        pdp-size-selector, pdp-add-to-cart, pdp-size-SIZE
```

## Given/When/Then to test mapping

- **Given** goes in `test.beforeEach`, with `setDeviceMode` and `navigate`
- **When** is a page object action call in the test body
- **Then** is a page object `assert...` call
- Smoke chains them into one journey per viewport

## Before writing anything

1. Identify the GitHub issue number for the `@TW-N` marker
2. Map each Given/When/Then to a `test()` block
3. Check the data-testids and add any missing ones to the JSX first
4. Write the page object first, then the spec
5. Include both smoke describes
