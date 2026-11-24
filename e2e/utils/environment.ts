// =============================================================================
// ENVIRONMENT REGISTRY
// =============================================================================
// Reference: Terraform Vault → Playwright QA Toolkit → Reference Playwright
// config → environment.ts. The reference registry maps named BigCommerce
// stores (uat/prod/qa/local) to env files, storage states and base URLs.
//
// Tomani Wear is Next.js on Vercel, not BigCommerce Stencil — there's no
// separate store per environment, just three places the same app runs:
//   - local:  a local `pnpm dev` server
//   - dev:    the `dev` branch's stable Vercel preview (what
//             daily-regression.yml already targets)
//   - prod:   the live production domain
// This substitution is recorded in the Terraform Vault plan, Stage 1 step 7.

export interface TestEnvironment {
  name: 'local' | 'dev' | 'prod'
  label: string
  tag: string
  envFile?: string
  baseURL: string
}

const environments = {
  local: {
    name: 'local',
    label: 'LOCAL',
    tag: '@local',
    envFile: '.env.local',
    baseURL: 'http://localhost:3000',
  },
  dev: {
    name: 'dev',
    label: 'DEV',
    tag: '@dev',
    baseURL: 'https://tomani-wear-git-dev-tomanni-wear.vercel.app',
  },
  prod: {
    name: 'prod',
    label: 'PROD',
    tag: '@prod',
    baseURL: 'https://www.tomanni.com',
  },
} as const satisfies Record<string, TestEnvironment>

export function getTestEnvironment(value: string = process.env.TEST_ENV ?? 'local'): TestEnvironment {
  if (!Object.prototype.hasOwnProperty.call(environments, value)) {
    throw new Error(`Unknown TEST_ENV "${value}". Choose local, dev, or prod.`)
  }
  return environments[value as keyof typeof environments]
}

// =============================================================================
// RUN SETTINGS
// =============================================================================
// Deviation from the reference: environment selects baseURL/envFile only here
// — it is not folded into the grep. In ITS every spec already carries its
// environment tag (@uat/@prod/@qa/@stencil), so requiring it in the grep is
// safe. No Tomani Wear spec carries an environment tag yet — @local/@dev/@prod
// land with the Stage 1 step-14 four-describe retag. Requiring one now would
// select zero tests on chromium/webkit/firefox in every environment, which
// would silently break both CI workflows. Revisit this file once step 14
// closes and add environment.tag back into the grep below.
//
// The one exception is the `setup` project in playwright.config.ts, which
// gates on environment.tag directly (see the comment there) — its single
// preflight spec is authored fresh in this same change, tagged for all three
// environments, so it isn't affected by the gap above.

export interface RunSettings {
  environment: TestEnvironment
  suite: string
  viewport: string
  grep: RegExp
}

export function getRunSettings(env: NodeJS.ProcessEnv = process.env): RunSettings {
  const environment = getTestEnvironment(env.TEST_ENV ?? 'local')
  const suite = env.TEST_SUITE ?? 'regression'
  const viewport = env.TEST_VIEWPORT ?? 'all'

  // 'stencil-smoke' dropped: BigCommerce Stencil-specific, no equivalent here.
  if (!['regression', 'smoke', 'axe'].includes(suite)) {
    throw new Error(`Unknown TEST_SUITE "${suite}". Choose regression, smoke, or axe.`)
  }
  if (!['all', 'desktop', 'mobile'].includes(viewport)) {
    throw new Error(`Unknown TEST_VIEWPORT "${viewport}". Choose all, desktop, or mobile.`)
  }

  const tags: string[] = []
  // Substitution: the reference pushes `@${suite}` (i.e. `@axe`) unconditionally.
  // This repo's accessibility specs already carry `@a11y`, predating this step —
  // mapped here rather than renaming every accessibility.spec.ts tag plus the
  // reporter's matcher, which is outside this step's scope.
  if (suite === 'axe') tags.push('@a11y')
  else if (suite !== 'regression') tags.push(`@${suite}`)
  if (viewport !== 'all') tags.push(`@${viewport}`)

  const grep = tags.length
    ? new RegExp(tags.map(tag => `(?=.*(?:^|\\s)${tag}(?:\\s|$))`).join(''))
    : /.*/

  return { environment, suite, viewport, grep }
}
