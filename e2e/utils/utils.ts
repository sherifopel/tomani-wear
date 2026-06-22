import { Page } from '@playwright/test'

// ─── Device helpers ───────────────────────────────────────────────────────────
// Use setDeviceMode() in beforeEach instead of inline setViewportSize() calls
// in every test. Keeps specs clean and gives us one place to change dimensions.

const VIEWPORTS = {
  mobile:  { width: 375,  height: 667  },  // iPhone SE
  tablet:  { width: 768,  height: 1024 },  // iPad Mini portrait
  desktop: { width: 1440, height: 1080 },
} as const

export type DeviceMode = keyof typeof VIEWPORTS

export async function setDeviceMode(page: Page, mode: DeviceMode): Promise<void> {
  await page.setViewportSize(VIEWPORTS[mode])
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export async function navigateTo(
  page: Page,
  baseURL: string,
  path: string,
): Promise<void> {
  await page.goto(`${baseURL}${path}`, { waitUntil: 'domcontentloaded' })
}
