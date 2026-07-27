import { Page, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// WCAG 2.1 AA — the standard we target for all Tomanni pages.
// 'best-practice' is excluded so we only fail on real compliance issues,
// not opinionated lint rules (e.g. "page must have a unique title").
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ACTIONS                                                                   ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const navigate = async (page: Page, baseURL: string, path: string) => {
  await page.goto(baseURL + path)
  await page.waitForLoadState('domcontentloaded')
}

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ASSERTIONS                                                                ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const assertNoA11yViolations = async (page: Page) => {
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
}
