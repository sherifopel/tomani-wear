# Test count record

Terraform step 5. Re-run and compare after any structural change (step 8), and again
after the whole-suite runs (step 32).

**Recorded:** 2026-11-19
**Command:** `npx playwright test --list --reporter=line`
**Branch:** `task/TW-74-terraform-stage-0-1`

## Totals

```
Total: 354 tests in 13 files
```

118 unique tests, run across 3 Playwright projects.

| Project | Tests |
|---|---|
| Desktop Chrome | 118 |
| Desktop Safari | 118 |
| Mobile Safari | 118 |
| **Total** | **354** |

Per project: `npx playwright test --list --reporter=line --project="Desktop Chrome"`

## Per spec file (unique tests, one project)

| Spec | Tests |
|---|---|
| checkout/checkout.spec.ts | 14 |
| plp/product-listing.spec.ts | 13 |
| accessibility/accessibility.spec.ts | 13 |
| pdp/product-detail.spec.ts | 12 |
| homepage/hero.section/hero.spec.ts | 11 |
| homepage/header.section/header.spec.ts | 11 |
| not-found/not-found.spec.ts | 9 |
| account/order-history.spec.ts | 8 |
| account/account.spec.ts | 8 |
| smoke/ssr-health.spec.ts | 6 |
| cart/cart-merge.spec.ts | 6 |
| cart/cart.spec.ts | 5 |
| checkout/checkout-payment.spec.ts | 2 |
| **Total** | **118** |

## What the number hides

`--list` counts declared tests, including ones that never run. **11 of the 118 are
permanently skipped**, which is 33 of the 354 across the three projects, so roughly 9% of
the suite is switched off:

| Spec | Skipped | Reason given |
|---|---|---|
| account/account.spec.ts | 5 | waiting on auth `storageState` (TW-38) |
| account/order-history.spec.ts | 4 | waiting on auth `storageState` (TW-38) |
| cart/cart.spec.ts | 1 | size-error case |
| pdp/product-detail.spec.ts | 1 | product description |

`pdp/product-detail.spec.ts:22` also holds a bare `test.skip()` with a note that it needs
a product marked out of stock.

Separately there are 3 **conditional** skips, which are legitimate rather than disabled
work: a hover dropdown that does not apply to touch (`header.spec.ts`), and two
localStorage reads that are unreliable in Playwright's Desktop Safari and are covered by
Chrome and Mobile Safari instead (`cart-merge.spec.ts`).

So the honest reading is **107 unique tests actually execute**, not 118.

## Recount — Terraform step 8 (2026-11-21)

**Command:** `npx playwright test --list --reporter=line`
**Branch:** `task/TW-74-terraform-stage-0-1`, after step 7 (commit `1b6b2c5`)

```
Total: 355 tests in 14 files
```

**+1 test, +1 file versus the step-5 baseline (354 in 13 files). Fully explained:**

The three browser projects (`chromium`/`webkit`/`firefox`, renamed from `Desktop
Chrome`/`Desktop Safari`/`Mobile Safari`) still declare the same **118 unique tests
across the same 13 spec files**, with an identical per-file breakdown to the table
above — confirmed by re-running `--list --project=chromium` and diffing against this
file's "Per spec file" table, which matched exactly. 118 × 3 = 354, unchanged.

The +1 is `e2e/specs/00-global/environment-health.spec.ts`, added in step 7 as the new
`setup` project's preflight check. It runs once — the `setup` project is a dependency
gate for the other three (`dependencies: ['setup']`), not a fourth parallel browser
lane, so it is not multiplied by 3. 354 + 1 = 355.

**Skip audit, re-checked:** the 11 permanently-skipped tests (account × 9, cart.spec × 1,
pdp/product-detail × 1) are untouched — same specs, same `test.skip()` calls, not
touched by step 7. The **conditional** skip count changed from 3 to 2: the touch-skip in
`header.spec.ts` (`project.name === 'Mobile Safari'`) was deleted outright in step 7
since no project emulates touch anymore, so that test now actually runs on all three
projects instead of being skipped on one. The two localStorage conditional skips in
`cart-merge.spec.ts` survive, renamed from `'Desktop Safari'` to `'webkit'` — same
behaviour, new project name. Net effect: one more test now executes than before
(header's touch-skip gone), partially offset by the pre-existing, now-undocumented-no-more
WebKit coverage gap on the two cart-merge tests (see step-7 notes in the Terraform Vault
plan) — neither changes the **declared** count above, only what actually runs.

## Rules for this file
- `--list` only lists. It proves nothing passes.
- Re-run the exact command above and compare before and after any structural change.
- Any difference must be explained next to the new number, not silently accepted.
