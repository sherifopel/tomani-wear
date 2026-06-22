---
name: tomanni-playwright
description: >
  Writes Playwright TypeScript tests for the Tomani Wear Next.js project following
  Sherif's strict conventions — strict PO/spec separation, data-testid selectors only,
  GWT scenarios mapped to individual test() blocks, @tomanni tags, and a mandatory
  smoke section at the bottom of every spec file.
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
- Inline logic, helper functions, conditional flows — extract to PO

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
// prettier-ignore
test.describe('TW-N Feature Name — Desktop', { tag: ['@tomanni', '@TW-N', '@feature', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await featurePage.navigate(page, baseURL!);
  });

  test('Should show the hero section with heading and CTA', async ({ page }) => {
    await featurePage.assertHeroVisible(page);
    await featurePage.assertHeroCTAVisible(page);
  });
});

// ─── TOMANNI SMOKE ────────────────────────────────────────────────────────────
// prettier-ignore
test.describe('TW-N Feature Name Smoke — Desktop', { tag: ['@tomanni-smoke', '@TW-N', '@feature', '@desktop'] }, () => {
  test('Should render feature end-to-end', async ({ page, baseURL }) => {
    await featurePage.navigate(page, baseURL!);
    await featurePage.assertHeroVisible(page);
    await featurePage.assertHeroCTAVisible(page);
  });
});
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
- Separator: `// ─── TOMANNI SMOKE ────────────────────────────────────────────────────────────`
- 1 smoke test per viewport
- Smoke test chains ALL acceptance criteria end-to-end in a single `test()` block
- Call existing named PO functions directly — do NOT create a wrapper `assertXxxSmoke` PO function just to aggregate them

### Formatting rules
- `// prettier-ignore` above every `test.describe`
- `test.describe` on a single line
- `test` declarations on a single line
- Test titles always start with `Should`

---

## Page Object Structure

Always in this order — selectors, actions, assertions.

```ts
import { Page, expect } from '@playwright/test'

// ─── 1. SELECTOR FACTORY ──────────────────────────────────────────────────────
export const heroSelectors = (page: Page) => ({
  section:     page.locator('[data-testid="home-hero-section"]'),
  heading:     page.locator('[data-testid="home-hero-heading"]'),
  subtitle:    page.locator('[data-testid="home-hero-subtitle"]'),
  description: page.locator('[data-testid="home-hero-description"]'),
  ctaButton:   page.locator('[data-testid="home-hero-cta-button"]'),
})

// ─── 2. ACTION FUNCTIONS ──────────────────────────────────────────────────────
export const navigate = async (page: Page, baseURL: string) => {
  await page.goto(baseURL + '/')
  await page.waitForLoadState('domcontentloaded') // ← always domcontentloaded, never networkidle
}

export const clickHeroCTA = async (page: Page) => {
  const selectors = heroSelectors(page)
  await selectors.ctaButton.click()
}

// ─── 3. ASSERTION FUNCTIONS ───────────────────────────────────────────────────
export const assertHeroVisible = async (page: Page) => {
  const selectors = heroSelectors(page)
  await expect(selectors.section).toBeVisible()
  await expect(selectors.heading).toBeVisible()
}
```

### Naming conventions
- Selector factory: `featureSelectors` (e.g. `heroSelectors`, `navSelectors`)
- Actions: `clickX`, `openX`, `closeX`, `navigate`, `selectX`
- Assertions: `assertX`
- Selector variable: always `selectors`, never `sel` or `s`

### Locator strategy
- `[data-testid="..."]` always — never `getByText`, `getByRole`, `getByLabel`
- Straight ASCII quotes only — no curly quotes

---

## Known data-testids

See `references/testids.md` for the full registry. Never write a locator for a testid that doesn't exist in the source — add it to the JSX first.

```
Nav:    nav-header, nav-logo-link, nav-announcement-bar, nav-links,
        nav-search-button, nav-account-button, nav-cart-button, nav-cart-count

Hero:   home-hero-section, home-hero-subtitle, home-hero-heading,
        home-hero-description, home-hero-cta-button,
        home-carousel-prev-button, home-carousel-next-button

Featured: home-featured-products
```

---

## GWT → test() mapping

- **Given** → `test.beforeEach` or first lines via PO navigate
- **When** → PO action calls
- **Then** → PO `assertX` calls
- Smoke test at the bottom chains them all

---

## File locations

```
e2e/
├── tsconfig.json
├── pages/   ← page objects go here
└── specs/   ← spec files go here
```

---

## Before writing anything

1. Identify the GitHub issue number → `@TW-N` tag
2. Map each GWT to a `test()` block
3. Check data-testids — flag any missing ones
4. Write the PO first, then the spec
5. Always include the smoke section at the bottom
