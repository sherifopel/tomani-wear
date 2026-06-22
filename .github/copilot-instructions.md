# Tomanni Wear — Copilot Instructions

## PR & Branch naming — always use this format

| Thing | Format | Example |
|---|---|---|
| Branch | `feat/TW-XXX-short-description` or `fix/TW-XXX-short-description` | `feat/TW-3-product-detail-page` |
| PR title | `[TW-XXX]: short description` | `[TW-7]: mobile menu overlay with header bar` |
| Commit message | plain English, what changed and why | `add close button and logo to mobile menu` |

**Never use conventional commits format (`feat(scope):`) for PR titles.**

---

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Sanity CMS · Vercel · Playwright

## Test conventions

- All selectors via `data-testid` — never CSS classes or visible text
- Page object functions only — no raw `page.locator()` or `expect()` in spec files
- Never use `waitForLoadState('networkidle')` — carousel autoplay keeps network busy; use `domcontentloaded`
- Smoke tests tagged `@tomanni-smoke` run on every PR against the Vercel preview URL
- Regression suite tagged `@tomanni`

## Golden rule

**Never assume. Always verify.** Read the file, run the command, check the output before acting.
