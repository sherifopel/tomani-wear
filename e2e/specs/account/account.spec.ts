import { test, expect } from '../../fixtures/fixtures'
import * as accountPage  from '../../page-objects/account.page'
import * as util         from '../../helpers/utils'

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

// Skipped until auth storageState setup is configured (see TW-38)
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
    await accountPage.assertOrdersCardNavigates(page)
  })

  test.skip('Sign out button is visible', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'desktop')
    await accountPage.navigate(page, baseURL!)
    await accountPage.assertSignOutVisible(page)
  })

  test.skip('Mobile — profile header and cards are visible', async ({ page, baseURL }) => {
    await util.setDeviceMode(page, 'mobile')
    await accountPage.navigate(page, baseURL!)
    await accountPage.assertProfileVisible(page)
    await accountPage.assertCardsVisible(page)
  })
})
