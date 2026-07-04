/**
 * Account page
 *
 * Unauthenticated tests run against the live app with no auth setup.
 * Authenticated tests use a stored auth session via storageState.
 *
 * To generate the auth session file, run:
 *   pnpm playwright test --project=setup
 * (not yet configured — see TW-38 notes)
 *
 * Until auth setup is in place, authenticated tests are skipped.
 * The redirect and structure tests run in all environments.
 */

import { test, expect } from '../../fixtures'
import * as accountPage from '../../pages/account.page'
import * as util from '../../utils/utils'

// ─────────────────────────────────────────────────────────────────────────────
// 🔒 UNAUTHENTICATED — redirect
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Account — unauthenticated redirect', { tag: ['@tomanni', '@account'] }, () => {
  test('Should redirect to /sign-in when not logged in', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await accountPage.navigate(page, baseURL!)
    await expect(page).toHaveURL(/\/sign-in/)
  })

  test('Should include callbackUrl pointing back to /account', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await accountPage.navigate(page, baseURL!)
    await expect(page).toHaveURL(/callbackUrl=.*account/)
  })

  test('Mobile — should redirect to /sign-in when not logged in', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await accountPage.navigate(page, baseURL!)
    await expect(page).toHaveURL(/\/sign-in/)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 👤 AUTHENTICATED — page structure
// Skipped until auth storageState setup is configured (see file header)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Account — authenticated page structure', { tag: ['@tomanni', '@account'] }, () => {
  test.skip('Should show profile header with name and avatar', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await accountPage.navigate(page, baseURL!)
    await accountPage.assertProfileVisible(page)
  })

  test.skip('Should show all three nav cards — orders, addresses, profile', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await accountPage.navigate(page, baseURL!)
    await accountPage.assertCardsVisible(page)
  })

  test.skip('Orders card links to /account/orders', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await accountPage.navigate(page, baseURL!)
    const { cards } = (await import('../../pages/account.page')).accountSelectors(page)
    await cards.orders.click()
    await expect(page).toHaveURL(/\/account\/orders/)
  })

  test.skip('Sign out button is visible', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await accountPage.navigate(page, baseURL!)
    const { signOutButton } = (await import('../../pages/account.page')).accountSelectors(page)
    await expect(signOutButton).toBeVisible()
  })

  test.skip('Mobile — profile header and cards are visible', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await accountPage.navigate(page, baseURL!)
    await accountPage.assertProfileVisible(page)
    await accountPage.assertCardsVisible(page)
  })
})
