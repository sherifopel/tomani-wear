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

## Rules for this file
- `--list` only lists. It proves nothing passes.
- Re-run the exact command above and compare before and after any structural change.
- Any difference must be explained next to the new number, not silently accepted.
