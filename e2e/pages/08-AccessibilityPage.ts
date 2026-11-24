import { Page, expect } from '@playwright/test'
import { Log } from 'logr-kit'
import AxeBuilder from '@axe-core/playwright'

// WCAG 2.1 AA — the standard we target for all Tomanni pages.
// 'best-practice' is excluded so we only fail on real compliance issues,
// not opinionated lint rules (e.g. "page must have a unique title").
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

// No SELECTOR FACTORY here — axe-core scans the whole rendered page itself,
// there's nothing to hand-pick a locator for.

// =============================================================================
// ACTIONS
// =============================================================================

export async function navigate(page: Page, baseURL: string, path: string) {
  Log.navigate(`${baseURL}${path}`)
  await page.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded' })
  Log.ok('navigated')
}

// =============================================================================
// ASSERTIONS
// =============================================================================

export async function assertNoA11yViolations(page: Page) {
  Log.info('running axe-core WCAG 2.1 AA scan')
  const results = await new AxeBuilder({ page })
    .withTags(AXE_TAGS)
    .analyze()

  // Format violations into a readable summary if any exist
  if (results.violations.length > 0) {
    const summary = results.violations.map(v =>
      `\n[${v.impact?.toUpperCase()}] ${v.id}: ${v.description}\n` +
      v.nodes.slice(0, 2).map(n => `  ↳ ${n.html}`).join('\n')
    ).join('\n')
    expect(results.violations, `Accessibility violations found:${summary}`).toHaveLength(0)
  }

  expect(results.violations).toHaveLength(0)
  Log.ok('no WCAG 2.1 AA violations found')
}
