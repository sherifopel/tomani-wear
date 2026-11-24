import { test } from '../../src/fixtures'
import * as util from '../../helpers/utils'

// Pages to audit — path + human label
const PAGES = [
  { path: '/',                         label: 'Homepage'    },
  { path: '/products?category=men',    label: 'PLP — Men'   },
  { path: '/products?category=women',  label: 'PLP — Women' },
  { path: '/cart',                     label: 'Cart'        },
  { path: '/sign-in',                  label: 'Sign In'     },
  { path: '/this-page-does-not-exist', label: '404 Page'    },
]

// Exception to the usual four-describe shape (see tomanni-playwright/SKILL.md,
// "Exceptions"): the accessibility folder has Desktop and Mobile only — one
// full WCAG scan per page, per viewport, is already the thorough-and-fast
// shape smoke exists to give everywhere else.

// =============================================================================
// DESKTOP REGRESSION COVERAGE
// =============================================================================

for (const pg of PAGES) {
  // prettier-ignore
  test.describe(`A11y: ${pg.label} — Desktop`, { tag: ['@a11y', '@desktop'] }, () => {
    test.beforeEach(async ({ page }) => {
      await util.setDeviceMode(page, 'desktop')
    })

    test(`Should have no WCAG 2.1 AA violations on ${pg.label}`, async ({ page, baseURL, a11y }) => {
      await a11y.navigate(page, baseURL!, pg.path)
      await a11y.assertNoA11yViolations(page)
    })
  })
}

// =============================================================================
// MOBILE REGRESSION COVERAGE
// =============================================================================

for (const pg of PAGES) {
  // prettier-ignore
  test.describe(`A11y: ${pg.label} — Mobile`, { tag: ['@a11y', '@mobile'] }, () => {
    test.beforeEach(async ({ page }) => {
      await util.setDeviceMode(page, 'mobile')
    })

    test(`Should have no WCAG 2.1 AA violations on ${pg.label}`, async ({ page, baseURL, a11y }) => {
      await a11y.navigate(page, baseURL!, pg.path)
      await a11y.assertNoA11yViolations(page)
    })
  })
}

// =============================================================================
// SMOKE COVERAGE
// =============================================================================

// prettier-ignore
test.describe('A11y — Smoke — Desktop', { tag: ['@a11y', '@desktop', '@smoke'] }, () => {
  test('Should have no WCAG 2.1 AA violations on the homepage', async ({ page, baseURL, a11y }) => {
    await util.setDeviceMode(page, 'desktop')
    await a11y.navigate(page, baseURL!, '/')
    await a11y.assertNoA11yViolations(page)
  })
})
