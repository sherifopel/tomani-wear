// Pre-compiled from status-reporter.ts — edit the .ts source, then re-run:
//   node -e "require('./e2e/reporters/status-reporter.js')"
// to verify, or just keep both in sync manually.
// Loading a .js file avoids the need for esbuild to JIT-compile TypeScript in CI.

'use strict'

const { logTestStatus, getEnvLabel } = require('playwright-final-summary-reporter')

class StatusReporter {
  onTestEnd(test, result) {
    const project     = test.parent?.project()
    const baseURL     = project?.use?.baseURL ?? ''
    const projectName = (project?.name ?? '').toLowerCase()

    const browserName = projectName.includes('firefox')
      ? 'firefox'
      : projectName.includes('webkit') || projectName.includes('safari')
      ? 'webkit'
      : 'chromium'

    const testInfo = {
      title:    test.title,
      line:     test.location.line,
      status:   result.status,
      duration: result.duration,
      retry:    result.retry,
      project: {
        use:     { isMobile: project?.use?.isMobile ?? false, baseURL },
        retries: project?.retries ?? 0,
      },
    }

    logTestStatus(getEnvLabel(baseURL), testInfo, browserName)
  }
}

module.exports = StatusReporter
