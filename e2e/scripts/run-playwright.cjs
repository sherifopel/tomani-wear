// =============================================================================
// RUNNER
// =============================================================================
// Reference: Terraform Vault → Playwright QA Toolkit → Reference Playwright
// config → run-playwright.cjs. Turns --environment/--suite/--viewport/
// --browser into the TEST_* env vars the config reads via getRunSettings(),
// then calls the real `playwright test` CLI. Wired into npm scripts at
// terraform Stage 1 step 9 (not yet — this file lands with step 7 so the
// config and environment registry it drives can be reviewed as one unit).
//
// Substitution from the reference: environment choices are local/dev/prod
// (see ../utils/environment.ts), not uat/prod/qa/local.

const { spawnSync } = require('node:child_process')
const { dirname, resolve } = require('node:path')

function buildRun(tokens, inheritedEnv = process.env) {
  const options = {
    environment: inheritedEnv.TEST_ENV ?? 'local',
    suite: inheritedEnv.TEST_SUITE ?? 'regression',
    viewport: inheritedEnv.TEST_VIEWPORT ?? 'all',
    browser: 'chromium',
  }
  const extra = []
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]
    if (token === '--') {
      extra.push(...tokens.slice(index + 1))
      break
    }
    const [flag, inlineValue] = token.split(/=(.*)/s)
    const key = flag.slice(2)
    if (flag.startsWith('--') && Object.hasOwn(options, key)) {
      const value = inlineValue ?? tokens[++index]
      if (!value || value.startsWith('-')) throw new Error(`Missing value for ${flag}`)
      options[key] = value
    } else {
      extra.push(token)
    }
  }
  if (!['chromium', 'webkit', 'firefox', 'all'].includes(options.browser)) {
    throw new Error(`Unknown browser "${options.browser}". Choose chromium, webkit, firefox, or all.`)
  }
  if (extra.some(arg => arg === '--project' || arg.startsWith('--project='))) {
    throw new Error('Select browsers with --browser chromium|webkit|firefox|all. Environment and viewport use their own options.')
  }
  const browsers = options.browser === 'all' ? ['chromium', 'webkit', 'firefox'] : [options.browser]
  return {
    args: ['test', ...browsers.map(browser => `--project=${browser}`), ...extra],
    env: {
      ...inheritedEnv,
      TEST_ENV: options.environment,
      TEST_SUITE: options.suite,
      TEST_VIEWPORT: options.viewport,
    },
  }
}

module.exports = { buildRun }

if (require.main === module) {
  try {
    const run = buildRun(process.argv.slice(2))
    // Substitution: this repo depends on @playwright/test, not the bare
    // `playwright` package the reference resolves. Under pnpm's strict
    // linking, `playwright` (a nested dependency of @playwright/test, not a
    // direct one) isn't hoisted to the root, so `playwright/package.json`
    // doesn't resolve here even though the CLI itself is present either way.
    const cli = resolve(dirname(require.resolve('@playwright/test/package.json')), 'cli.js')
    const result = spawnSync(process.execPath, [cli, ...run.args], {
      env: run.env,
      stdio: 'inherit',
      shell: false,
    })
    if (result.error) throw result.error
    process.exit(result.status ?? 1)
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}
