import { Page, expect } from '@playwright/test'
import { Log } from 'logr-kit'

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  LOCATORS                                                                  ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const accountSelectors = (page: Page) => ({
  // ── Profile header ──────────────────────────────────────────────────────────
  header: {
    root:           page.locator('[data-testid="account-profile-header"]'),
    avatar:         page.locator('[data-testid="account-avatar"]'),
    avatarInitials: page.locator('[data-testid="account-avatar-initials"]'),
    heading:        page.locator('[data-testid="account-heading"]'),
  },

  // ── Nav cards ───────────────────────────────────────────────────────────────
  cards: {
    orders:    page.locator('[data-testid="account-card-orders"]'),
    addresses: page.locator('[data-testid="account-card-addresses"]'),
    profile:   page.locator('[data-testid="account-card-profile"]'),
  },

  // ── Sign out ─────────────────────────────────────────────────────────────────
  signOutButton: page.locator('[data-testid="account-sign-out-button"]'),
})

// ╔════════════════════════════════════════════════════════════════════════════╗
// ║  ACTIONS                                                                   ║
// ╚════════════════════════════════════════════════════════════════════════════╝

export const navigate = async (page: Page, baseURL: string) => {
  Log.navigate(`${baseURL}/account`)
  await page.goto(`${baseURL}/account`, { waitUntil: 'domcontentloaded' })
}

export const assertProfileVisible = async (page: Page) => {
  Log.section('Account — profile header')
  const { header } = accountSelectors(page)
  await expect(header.root).toBeVisible();    Log.ok('profile header')
  await expect(header.heading).toBeVisible(); Log.ok('name heading')
}

export const assertCardsVisible = async (page: Page) => {
  Log.section('Account — nav cards')
  const { cards } = accountSelectors(page)
  await expect(cards.orders).toBeVisible();    Log.ok('orders card')
  await expect(cards.addresses).toBeVisible(); Log.ok('addresses card')
  await expect(cards.profile).toBeVisible();   Log.ok('profile card')
}
