import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter'
import { logTestStatus, getEnvLabel } from 'playwright-final-summary-reporter'

// Runs in the MAIN process (not a worker) so stdout is never buffered or swallowed.
// Playwright calls onTestEnd after every test completes, regardless of status.
export default class StatusReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    const project    = test.parent?.project()
    const baseURL    = project?.use?.baseURL ?? ''
    const projectName = (project?.name ?? '').toLowerCase()

    const browserName = projectName.includes('firefox') ? 'firefox'
      : projectName.includes('webkit') || projectName.includes('safari') ? 'webkit'
      : 'chromium'

    // logTestStatus expects a TestInfo-shaped object — we build one from the
    // TestCase + TestResult available in a reporter's onTestEnd.
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

    logTestStatus(getEnvLabel(baseURL), testInfo as never, browserName)
  }
}
