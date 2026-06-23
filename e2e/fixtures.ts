import { test as base, expect } from '@playwright/test'

// Extend here when you need custom fixtures (auth state, DB seeds, etc.)
export const test = base.extend({})
export { expect }
