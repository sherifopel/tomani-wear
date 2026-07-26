import { test } from '../../fixtures/fixtures'
import * as a11y from '../../page-objects/accessibility.page'
import * as util from '../../helpers/utils'

// Pages to audit — path + human label
const PAGES = [
  { path: '/',                        label: 'Homepage'   },
  { path: '/products?category=men',   label: 'PLP — Men'  },
  { path: '/products?category=women', label: 'PLP — Women'},
  { path: '/cart',                    label: 'Cart'       },
  { path: '/sign-in',                 label: 'Sign In'    },
  { path: '/this-page-does-not-exist',label: '404 Page'   },
]

// ─────────────────────────────────────────────────────────────────────────────
// 🖥  DESKTOP
// ─────────────────────────────────────────────────────────────────────────────

for (const pg of PAGES) {
  // prettier-ignore
  test.describe(`A11y: ${pg.label} — Desktop`, { tag: ['@tomanni', '@a11y', '@desktop'] }, () => {
    test.beforeEach(async ({ page }) => {
      await util.setDeviceMode(page, 'desktop')
    })

    test(`Should have no WCAG 2.1 AA violations on ${pg.label}`, async ({ page, baseURL }) => {
      await a11y.navigate(page, baseURL!, pg.path)
      await a11y.assertNoA11yViolations(page)
    })
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// 📱 MOBILE
// ─────────────────────────────────────────────────────────────────────────────

for (const pg of PAGES) {
  // prettier-ignore
  test.describe(`A11y: ${pg.label} — Mobile`, { tag: ['@tomanni', '@a11y', '@mobile'] }, () => {
    test.beforeEach(async ({ page }) => {
      await util.setDeviceMode(page, 'mobile')
    })

    test(`Should have no WCAG 2.1 AA violations on ${pg.label}`, async ({ page, baseURL }) => {
      await a11y.navigate(page, baseURL!, pg.path)
      await a11y.assertNoA11yViolations(page)
    })
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// 🚀 TOMANNI SMOKE
// ─────────────────────────────────────────────────────────────────────────────

// prettier-ignore
test.describe('A11y Smoke — Desktop', { tag: ['@tomanni-smoke', '@a11y', '@desktop'] }, () => {
  test('Should have no WCAG 2.1 AA violations on the homepage', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await a11y.navigate(page, baseURL!, '/')
    await a11y.assertNoA11yViolations(page)
  })
})
