import { test as base, expect } from '@playwright/test'

// Extend here when you need custom fixtures (auth state, DB seeds, etc.)
// Per-test coloured status lines are handled by e2e/reporters/status-reporter.ts
// which runs in the main process and is never buffered.
export const test = base.extend({})
export { expect }
