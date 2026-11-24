# Tomani Wear — Git & PR Workflow

## Branch Naming
| Type | Format | Example |
|---|---|---|
| Feature | `feat/TW-XXX-short-description` | `feat/TW-3-product-detail-page` |
| Bug fix | `fix/TW-XXX-short-description` | `fix/TW-12-cart-total-rounding` |
| Task | `task/TW-XXX-short-description` | `task/TW-74-terraform-stage-0-1` |

Use `task/` for dev and infra work that is neither a user-facing feature nor a bug
fix: tooling, CI, test framework, dependencies, refactors. It pairs with the
`type: task` label on the issue. Not `chore/`.

## PR Title
Format: `[TW-XXX]: short description`
Example: `[TW-7]: mobile menu overlay with header bar`

**Never use conventional commits format (`feat(scope):`) for PR titles.**
The ticket number ties every PR directly to the GitHub issue so Tomiwa and Sherif can trace every change back to a requirement.

## Commit Messages
Free-form, clear English.
Example: `add close button and logo to mobile menu`
