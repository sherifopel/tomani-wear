import { test } from '../../src/fixtures'
import * as util from '../../helpers/utils'

// =============================================================================
// DESKTOP REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Account — Desktop', { tag: ['@account', '@desktop'] }, () => {
  test.beforeEach(async ({ page, baseURL, account }) => {
    await util.setDeviceMode(page, 'desktop')
    await account.navigate(page, baseURL!)
  })

  test('Should redirect to /sign-in when not logged in', async ({ page, account }) => {
    await account.assertRedirectedToSignIn(page)
  })

  test('Should include callbackUrl pointing back to /account', async ({ page, account }) => {
    await account.assertCallbackUrlPointsToAccount(page)
  })

  // Skipped until auth storageState setup is configured (see TW-38)
  test.skip('Should show profile header with name and avatar', async ({ page, account }) => {
    await account.assertProfileVisible(page)
  })

  test.skip('Should show all three nav cards — orders, addresses, profile', async ({ page, account }) => {
    await account.assertCardsVisible(page)
  })

  test.skip('Orders card links to /account/orders', async ({ page, account }) => {
    await account.clickOrdersCard(page)
    await account.assertOrdersCardNavigatesToOrders(page)
  })

  test.skip('Sign out button is visible', async ({ page, account }) => {
    await account.assertSignOutVisible(page)
  })
})

// =============================================================================
// MOBILE REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Account — Mobile', { tag: ['@account', '@mobile'] }, () => {
  test.beforeEach(async ({ page, baseURL, account }) => {
    await util.setDeviceMode(page, 'mobile')
    await account.navigate(page, baseURL!)
  })

  test('Should redirect to /sign-in when not logged in', async ({ page, account }) => {
    await account.assertRedirectedToSignIn(page)
  })

  // Skipped until auth storageState setup is configured (see TW-38)
  test.skip('Should show profile header and cards', async ({ page, account }) => {
    await account.assertProfileVisible(page)
    await account.assertCardsVisible(page)
  })
})

// =============================================================================
// SMOKE COVERAGE
// =============================================================================

// Logged-in coverage is skipped pending TW-38, so smoke verifies the one thing
// that's real and critical today: the account route actually protects itself.

// prettier-ignore
test.describe('Account — Smoke — Desktop', { tag: ['@account', '@desktop', '@smoke'] }, () => {
  test('Should redirect unauthenticated visitors to sign-in with a callback to /account', async ({ page, baseURL, account }) => {
    await util.setDeviceMode(page, 'desktop')
    await account.navigate(page, baseURL!)
    await account.assertRedirectedToSignIn(page)
    await account.assertCallbackUrlPointsToAccount(page)
  })
})

// prettier-ignore
test.describe('Account — Smoke — Mobile', { tag: ['@account', '@mobile', '@smoke'] }, () => {
  test('Should redirect unauthenticated visitors to sign-in with a callback to /account', async ({ page, baseURL, account }) => {
    await util.setDeviceMode(page, 'mobile')
    await account.navigate(page, baseURL!)
    await account.assertRedirectedToSignIn(page)
    await account.assertCallbackUrlPointsToAccount(page)
  })
})
