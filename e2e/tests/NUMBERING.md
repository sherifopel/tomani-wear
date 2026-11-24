# Numbered journey folders

Terraform step 12. **Done when:** the numbers have no gaps. This is the folder
skeleton only — nothing has been moved into these folders yet. Moving the specs,
one folder at a time with one commit each, is step 13 (not done here).

**Recorded:** 2026-11-21

## Numbering scheme

Consecutive, not the reference's fixed slots (`04-basket`, `08-wishlist`, `12-accessibility`
etc.) — this repo has no basket-drawer or wishlist feature to reserve a number for,
and the "numbering rule" explicitly allows a project to go consecutive instead
(see `Roll out the reference structure.md`, "Numbering rule", 2026-10-28).

| Number | Folder | Maps from | Note |
|---|---|---|---|
| `00-global` | cross-site checks, suite preflight | *(exists)* `00-global/environment-health.spec.ts` | `smoke/ssr-health.spec.ts` is a candidate to also land here at step 13 — it's a cross-page check (does every key route render without a blank page/JS error), the same kind of thing as the preflight, not a single journey's behaviour. Decide at step 13, not here. |
| `01-home` | home page, header, footer, search | `homepage/hero.section/`, `homepage/header.section/` | |
| `02-plp` | listing, filters, category pages | `plp/` | |
| `03-pdp` | product detail | `pdp/` | |
| `04-cart` | the cart page, guest/session merge | `cart/` (`cart.spec.ts`, `cart-merge.spec.ts`) | No separate mini-basket drawer exists, so there's no `04-basket`/`05-cart` split — one folder covers both. |
| `05-checkout` | checkout, order confirmation | `checkout/` (`checkout.spec.ts`, `checkout-payment.spec.ts`) | |
| `06-account` | login, account pages, order history | `account/` (`account.spec.ts`, `order-history.spec.ts`) | |
| `07-not-found` | the 404 page | `not-found/` | Special feature, not a standard journey — gets its own folder per the reference's "09+ special features" bucket, numbered consecutively here instead. |
| `08-accessibility` | axe scans, Desktop and Mobile only | `accessibility/` | Already the name `playwright.config.ts`'s `testMatch` substitution points at (step 7/9) — moving this folder at step 13 needs that `testMatch`/getRunSettings `@a11y` mapping updated to the new path in the same commit. |

No `09-wishlist` or further: nothing left to number. Folders stay numbered even if a
future journey (wishlist, a kit builder) never arrives — per the reference rule, "a
project without that journey leaves the number unused and never renumbers" once a
number has been assigned here, but there's no unused number reserved up front since
nothing needs it yet.

## What exists right now

Every numbered folder from `01` to `08` is empty except for a `.gitkeep` placeholder
(git doesn't track empty directories). `00-global` already has its real spec. Nothing
else has moved — the old folders (`homepage/`, `plp/`, `pdp/`, `cart/`, `checkout/`,
`account/`, `not-found/`, `accessibility/`, `smoke/`) are untouched and still the ones
`playwright.config.ts`'s `testMatch` and every spec import path point at.
