# Logger, helpers and reporters — diff against the reference

Terraform step 10. **Done when:** a diff against the reference is empty or every
difference is explained. This repo doesn't carry the reference's bespoke files —
it substitutes two of Sherif's own npm packages (`logr-kit`, `playwright-final-
summary-reporter`) plus one local helper file and one local reporter wrapper.
Graded here feature-by-feature against what the reference's files do.

**Recorded:** 2026-11-21
**Branch:** `task/TW-74-terraform-stage-0-1`

## Logger: `logr-kit` vs reference `logger.ts`

| Reference method | In `logr-kit`? | Note |
|---|---|---|
| `section`, `kv`, `info`, `ok`, `warn`, `fail`, `table`, `navigate`, `check`, `diff`, `list`, `raw`, `group` | Yes, all 13 | Same names, same signatures |
| `step`, `viewport`, `response`, `ac` | No | Specialised convenience methods (multi-step traces, viewport markers, API response pretty-printing, AC-numbered assertions). Not currently called anywhere in `e2e/` (checked by grep) — an absent-but-unneeded gap, not a blocker. |

**Real behavioural difference found:** the reference's `kv`, `table`, `check`,
`diff`, `list` and `group` all check `LOG_LEVEL=silent` and suppress output
(table/list/group unconditionally when silent; check/diff only when the result
passed). `logr-kit`'s versions of **all six** of these don't check `silent` at
all — only `section`/`info`/`ok`/`navigate` do. `LOG_LEVEL=silent` in this repo
is therefore less quiet than the reference: a CI run with it set would still
print every `Log.table`/`Log.check`/`Log.diff`/`Log.list`/`Log.group` call.
Not fixed here — `logr-kit` is an external package (Sherif's own
`sherifopel/pw-log` repo), not a file in this repo, so there's nothing to edit
in this terraform step. Worth a note on that repo if `LOG_LEVEL=silent` is ever
relied on for quiet CI output.

## Status line: `e2e/reporters/status-reporter.ts` vs reference `stdoutReporter.ts` + `testStatus.ts`

Functionally equivalent, with two deliberate substitutions:
- **Desktop/Mobile signal:** the reference reads `testInfo.tags?.includes('@mobile')`.
  This repo's reporter instead builds `testInfo.project.use.isMobile`, and
  confirmed (by reading `playwright-final-summary-reporter`'s compiled
  `testStatus.js`) that its `logTestStatus()` checks `testInfo.project.use.isMobile`,
  not tags — so the substitution is correctly wired, not a mismatch. No project
  sets `isMobile` today (projects are browsers only, viewport comes from
  `setDeviceMode()`), so every status line currently prints "Desktop" regardless
  of the spec's actual viewport. Harmless today (informational logging only,
  doesn't drive any test logic), but worth knowing if the status line ever looks
  wrong during a mobile-tagged run.
- **Env label:** the reference does an exact lookup against `ITS_ENV_MAP` (literal
  base URLs → `UAT`/`PROD`/`QA`/`LOCAL`). This repo's `envLabel()` does hostname
  substring matching (`localhost`→`LOCAL`, `tomanni.com`→`PRODUCTION`,
  `vercel.app`→`PREPROD`) — necessary since Vercel preview URLs are dynamic
  per-branch, not a fixed list.

**Gap found:** the reference's `formatTestStatus` appends a retry note — "- will
retry" while a failure is about to retry, "- flaky, passed on retry" when a later
attempt passed. `playwright-final-summary-reporter`'s `logTestStatus` builds the
retry *count* label (`[attempt 2/3]`) but never the retry note. Same as the
`LOG_LEVEL=silent` gap above: lives in Sherif's external package, not fixable
inside this repo's terraform step.

## Helpers: `e2e/helpers/utils.ts`

No reference snapshot of ITS's `utils.ts` exists in the Terraform Vault to diff
against — only its role is documented ("mobile comes from `setDeviceMode()` in
the specs" and "no base URL in specs or page objects — navigation goes through
one helper that takes baseURL"). Checked against both:
- `setDeviceMode(page, mode)` exists, used in every spec's `beforeEach` — satisfies
  the first requirement, already covered by step 7's "no project emulates touch"
  decision.
- **Gap found:** `navigateTo(page, baseURL, path)` exists but **isn't the one
  helper navigation goes through** — all 13 page objects call `page.goto()`
  directly with their own inline URL-building instead of delegating to it
  (`accessibility.page.ts`, `account.page.ts`, `cart.page.ts`,
  `cart-merge.page.ts`, `home.page.ts`, `not-found.page.ts`, `checkout.page.ts`,
  `smoke.page.ts`, `plp.page.ts`, `pdp.page.ts`). None hardcode a literal domain
  (`baseURL` is always a parameter, confirmed by grep — the checklist's actual
  "no base URL in specs or page objects" bar is met), but the duplication is real:
  14 near-identical `page.goto()` calls instead of one shared call. **Not fixed
  here** — rewriting 13 page objects to delegate is exactly what step 15 (three-
  layer page objects) already needs to touch each file for, so it's picked up
  there rather than as a drive-by in a reporters/logger diff. Recorded so step 15
  doesn't miss it.

## Reporters: what's wired vs what the package can already do

Current `playwright.config.ts` reporter lists: `status-reporter.ts` (above) +
`playwright-final-summary-reporter` (the default export, `FinalSummaryReporter`)
configured with tag-based sections (`@smoke`, `@header`, `@hero`, `@pdp`, `@cart`,
`@checkout`, `@a11y`). This substitutes the reference's folder-grouped console
summary (`testReporter.ts`) — tag-based instead of folder-based since the numbered
journey folders don't exist yet (step 12/13); revisit the section grouping once
they do, since folder order would then be available too.

Inspected the installed package (`playwright-final-summary-reporter`'s compiled
`dist/`) for capabilities beyond what's currently wired in:

- **`FinalSummaryReporter` already builds an HTML summary** (`playwright-summary.html`
  by default) and **already supports posting the run's headline to Slack**
  (`slackChannel` option or `SLACK_CHANNEL_ID`, needs `SLACK_BOT_TOKEN` +
  `SLACK_NOTIFY=1`/`SLACK_ALWAYS=1`) — covering the reference's
  `htmlSummaryBuilder.ts` and the Slack-headline half of `testReporter.ts` in one
  package. **Not activated** — no Slack workspace/bot token exists for this
  project. Self-silences without one, so nothing to do until Sherif wants Slack
  notifications and sets up a bot + channel.
- **`AxeSlackReporter` exists in the package** (`playwright-final-summary-reporter`'s
  named export `AxeSlackReporter`, confirmed via its compiled `dist/axeSlackReporter.js`
  and `.d.ts`) — the direct substitute for the reference's `axeReporter.ts`: prints a
  consolidated violation table at the end of a run, posts to Slack if a token is set,
  self-silences if no axe tests ran. **Tried wiring it in, didn't keep it:** it reads
  `testInfo.attach()` annotations in a specific shape (`Page`, `Audited URL`,
  `Violations: critical/serious/moderate/minor`) that `e2e/page-objects/accessibility.page.ts`
  never attaches — `assertNoA11yViolations(page)` doesn't even receive `testInfo`.
  Registering the reporter without that would just be dead weight (it would
  self-silence on every run, forever, since it would never recognise an axe test).
  Worth its own ticket: thread `testInfo` into `assertNoA11yViolations`, attach the
  four annotations from the real `AxeBuilder` result, then wire the reporter in.
- The JSDoc example in the package (`reporter: [['playwright-final-summary-reporter/axe', ...]]`)
  **doesn't actually resolve** — the package has no `exports` subpath map and no
  root-level `axe.js` stub, only `dist/axeSlackReporter.js`. Confirmed with
  `require.resolve('playwright-final-summary-reporter/axe')`, which throws
  `MODULE_NOT_FOUND`. The real way to use it would be a local wrapper file (same
  pattern as `status-reporter.ts` already uses for `logTestStatus`), not the
  documented subpath. Worth flagging on that package's own repo — the docstring
  is stale.

**Not ported, with reasons:**
- `itsSlackReporter.ts` / `quietSlackReporter.ts` / `uploadToSlack.ts` /
  `postSlackHealthBoard.js` — their job (headline-then-thread Slack posts, HTML
  report upload, per-folder health board) is already covered by
  `playwright-final-summary-reporter`'s built-in Slack support once activated;
  no separate files needed.
- The per-folder health board specifically has no equivalent yet because it
  needs numbered folders to group by (`getLane()` maps `05-cart` etc. to a lane
  name) — not meaningful before step 12/13.

## Verdict

No code changes landed in this repo for step 10 — every real difference found
either lives in an external package Sherif maintains separately (not this
repo's job to patch) or is scoped to a later step that already has to touch the
same files (step 15's page-object rewrite). Recorded here so none of the five
findings above get silently lost:
1. `logr-kit`: `LOG_LEVEL=silent` doesn't silence `kv`/`table`/`check`/`diff`/`list`/`group` (upstream fix, `pw-log`).
2. `playwright-final-summary-reporter`: missing the "will retry" / "flaky, passed on retry" status-line note (upstream fix).
3. 13 page objects build their own `page.goto()` instead of delegating to `utils.navigateTo()` (step 15).
4. `AxeSlackReporter` needs `testInfo.attach()` wiring in `accessibility.page.ts` before it's worth registering (new ticket).
5. `playwright-final-summary-reporter`'s own `/axe` subpath doesn't resolve — stale docstring (upstream fix, flag on that repo).
