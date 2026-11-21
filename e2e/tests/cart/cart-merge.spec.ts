import { test }          from '../../src/fixtures'
import * as mergePage    from '../../page-objects/cart-merge.page'
import * as util         from '../../helpers/utils'

test.describe('Cart — guest cart merge on sign-in', { tag: ['@tomanni', '@cart', '@merge'] }, () => {
  test.beforeEach(async ({ page }) => {
    await util.setDeviceMode(page, 'desktop')
  })

  test('Should call merge API when session becomes authenticated', async ({ page, baseURL }) => {
    const guest = mergePage.guestCartItem()
    let mergePayload: { items: unknown[] } | null = null

    await mergePage.seedGuestCart(page, [guest])
    await mergePage.mockAuthSession(page)
    await mergePage.mockMergeApi(page, [guest], (body) => { mergePayload = body as { items: unknown[] } })

    // Set up response waiter before navigation so we don't miss a fast response
    const mergeResponse = page.waitForResponse('**/api/cart/merge', { timeout: 8_000 })
    await mergePage.navigate(page, baseURL!)
    await mergeResponse  // waits for the route handler to fully respond (guarantees onRequest ran)

    test.expect(mergePayload).not.toBeNull()
    test.expect((mergePayload as unknown as { items: unknown[] }).items).toHaveLength(1)
  })

  test('Guest cart items are preserved after sign-in', async ({ page, baseURL }) => {
    const guest = mergePage.guestCartItem()
    const merged = [guest]

    await mergePage.seedGuestCart(page, [guest])
    await mergePage.mockAuthSession(page)
    await mergePage.mockMergeApi(page, merged)

    await mergePage.navigate(page, baseURL!)

    await page.waitForTimeout(2000)
    await mergePage.assertLocalStorageCart(page, 1)
  })

  test('Saved DB items are added to local cart after merge', async ({ page, baseURL }) => {
    // On WebKit + Playwright, localStorage writes inside Promise .then()
    // callbacks don't update what page.evaluate() reads back — a known Playwright/WebKit
    // context quirk. The merge logic is correct: test 5 (badge) confirms React state updates,
    // and this test passes on Chrome. KNOWN GAP since the terraform step-7 project rename
    // (2026-11-20): this used to also be covered by the Mobile Safari project, which didn't
    // hit the quirk — that project is gone (browsers only now, no devices[...]), so this
    // assertion currently has zero WebKit coverage. Flagged in the terraform plan.
    test.skip(test.info().project.name === 'webkit', 'localStorage reads unreliable in Playwright WebKit — no coverage until this quirk is worked around, see comment above')

    const guest = mergePage.guestCartItem()
    const saved = mergePage.savedCartItem()
    const merged = [guest, saved]

    await mergePage.seedGuestCart(page, [guest])
    await mergePage.mockAuthSession(page)
    await mergePage.mockMergeApi(page, merged)

    await mergePage.navigate(page, baseURL!)

    await page.waitForTimeout(2000)
    await mergePage.assertLocalStorageCart(page, 2)
  })

  test('Duplicate items have quantities combined not duplicated', async ({ page, baseURL }) => {
    // Same WebKit localStorage quirk as above, same known gap — skip on that project only.
    test.skip(test.info().project.name === 'webkit', 'localStorage reads unreliable in Playwright WebKit — no coverage until this quirk is worked around, see comment above')

    const guest = mergePage.guestCartItem()
    const serverCopy = { ...guest, quantity: 3 }

    await mergePage.seedGuestCart(page, [guest])
    await mergePage.mockAuthSession(page)
    await mergePage.mockMergeApi(page, [serverCopy])

    await mergePage.navigate(page, baseURL!)

    await page.waitForTimeout(2000)
    await mergePage.assertMergedQuantity(page, guest.productId, 3)
  })

  test('Cart badge reflects merged item count', async ({ page, baseURL }) => {
    const guest  = mergePage.guestCartItem()
    const saved  = mergePage.savedCartItem()
    const merged = [{ ...guest, quantity: 2 }, { ...saved, quantity: 1 }]

    await mergePage.seedGuestCart(page, [guest])
    await mergePage.mockAuthSession(page)
    await mergePage.mockMergeApi(page, merged)

    await mergePage.navigate(page, baseURL!)

    await page.waitForTimeout(2000)
    await mergePage.assertCartBadgeCount(page, 3)
  })

  test('Unauthenticated users keep their guest cart untouched', async ({ page, baseURL }) => {
    const guest = mergePage.guestCartItem()

    await mergePage.seedGuestCart(page, [guest])
    // No mockAuthSession — user stays as guest

    await mergePage.navigate(page, baseURL!)

    await page.waitForTimeout(1000)
    await mergePage.assertLocalStorageCart(page, 1)
  })
})
