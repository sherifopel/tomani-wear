import { test } from '../../src/fixtures'
import * as util from '../../helpers/utils'

// =============================================================================
// DESKTOP REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Cart Merge — Desktop', { tag: ['@cart', '@merge', '@desktop'] }, () => {
  test.beforeEach(async ({ page }) => {
    await util.setDeviceMode(page, 'desktop')
  })

  test('Should call merge API when session becomes authenticated', async ({ page, baseURL, cart }) => {
    const guest = cart.guestCartItem()
    let mergePayload: { items: unknown[] } | null = null

    await cart.seedGuestCart(page, [guest])
    await cart.mockAuthSession(page)
    await cart.mockMergeApi(page, [guest], (body) => { mergePayload = body as { items: unknown[] } })

    // Set up response waiter before navigation so we don't miss a fast response
    const mergeResponse = page.waitForResponse('**/api/cart/merge', { timeout: 8_000 })
    await cart.navigate(page, baseURL!)
    await mergeResponse // waits for the route handler to fully respond (guarantees onRequest ran)

    cart.assertMergePayloadItemCount(mergePayload, 1)
  })

  test('Guest cart items are preserved after sign-in', async ({ page, baseURL, cart }) => {
    const guest = cart.guestCartItem()
    const merged = [guest]

    await cart.seedGuestCart(page, [guest])
    await cart.mockAuthSession(page)
    await cart.mockMergeApi(page, merged)
    await cart.navigate(page, baseURL!)

    await cart.assertLocalStorageCart(page, 1)
  })

  test('Saved DB items are added to local cart after merge', async ({ page, baseURL, cart }) => {
    // On WebKit + Playwright, localStorage writes inside Promise .then()
    // callbacks don't update what page.evaluate() reads back — a known Playwright/WebKit
    // context quirk. The merge logic is correct: the badge test confirms React state
    // updates, and this test passes on Chrome. KNOWN GAP since the terraform step-7
    // project rename (2026-11-20): this used to also be covered by the Mobile Safari
    // project, which didn't hit the quirk — that project is gone (browsers only now, no
    // devices[...]), so this assertion currently has zero WebKit coverage. Flagged in
    // the terraform plan.
    test.skip(test.info().project.name === 'webkit', 'localStorage reads unreliable in Playwright WebKit — no coverage until this quirk is worked around, see comment above')

    const guest = cart.guestCartItem()
    const saved = cart.savedCartItem()
    const merged = [guest, saved]

    await cart.seedGuestCart(page, [guest])
    await cart.mockAuthSession(page)
    await cart.mockMergeApi(page, merged)
    await cart.navigate(page, baseURL!)

    await cart.assertLocalStorageCart(page, 2)
  })

  test('Duplicate items have quantities combined not duplicated', async ({ page, baseURL, cart }) => {
    // Same WebKit localStorage quirk as above, same known gap — skip on that project only.
    test.skip(test.info().project.name === 'webkit', 'localStorage reads unreliable in Playwright WebKit — no coverage until this quirk is worked around, see comment above')

    const guest = cart.guestCartItem()
    const serverCopy = { ...guest, quantity: 3 }

    await cart.seedGuestCart(page, [guest])
    await cart.mockAuthSession(page)
    await cart.mockMergeApi(page, [serverCopy])
    await cart.navigate(page, baseURL!)

    await cart.assertMergedQuantity(page, guest.productId, 3)
  })

  test('Cart badge reflects merged item count', async ({ page, baseURL, cart }) => {
    const guest = cart.guestCartItem()
    const saved = cart.savedCartItem()
    const merged = [{ ...guest, quantity: 2 }, { ...saved, quantity: 1 }]

    await cart.seedGuestCart(page, [guest])
    await cart.mockAuthSession(page)
    await cart.mockMergeApi(page, merged)
    await cart.navigate(page, baseURL!)

    await cart.assertCartBadgeCount(page, 3)
  })

  test('Unauthenticated users keep their guest cart untouched', async ({ page, baseURL, cart }) => {
    const guest = cart.guestCartItem()

    await cart.seedGuestCart(page, [guest])
    // No mockAuthSession — user stays as guest
    await cart.navigate(page, baseURL!)

    await cart.assertLocalStorageCart(page, 1)
  })
})

// =============================================================================
// MOBILE REGRESSION COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Cart Merge — Mobile', { tag: ['@cart', '@merge', '@mobile'] }, () => {
  test.beforeEach(async ({ page }) => {
    await util.setDeviceMode(page, 'mobile')
  })

  test('Should call merge API when session becomes authenticated', async ({ page, baseURL, cart }) => {
    const guest = cart.guestCartItem()
    let mergePayload: { items: unknown[] } | null = null

    await cart.seedGuestCart(page, [guest])
    await cart.mockAuthSession(page)
    await cart.mockMergeApi(page, [guest], (body) => { mergePayload = body as { items: unknown[] } })

    const mergeResponse = page.waitForResponse('**/api/cart/merge', { timeout: 8_000 })
    await cart.navigate(page, baseURL!)
    await mergeResponse

    cart.assertMergePayloadItemCount(mergePayload, 1)
  })

  test('Guest cart items are preserved after sign-in', async ({ page, baseURL, cart }) => {
    const guest = cart.guestCartItem()
    const merged = [guest]

    await cart.seedGuestCart(page, [guest])
    await cart.mockAuthSession(page)
    await cart.mockMergeApi(page, merged)
    await cart.navigate(page, baseURL!)

    await cart.assertLocalStorageCart(page, 1)
  })

  test('Saved DB items are added to local cart after merge', async ({ page, baseURL, cart }) => {
    // Same WebKit localStorage quirk and known gap as the Desktop describe above.
    test.skip(test.info().project.name === 'webkit', 'localStorage reads unreliable in Playwright WebKit — no coverage until this quirk is worked around, see comment above')

    const guest = cart.guestCartItem()
    const saved = cart.savedCartItem()
    const merged = [guest, saved]

    await cart.seedGuestCart(page, [guest])
    await cart.mockAuthSession(page)
    await cart.mockMergeApi(page, merged)
    await cart.navigate(page, baseURL!)

    await cart.assertLocalStorageCart(page, 2)
  })

  test('Duplicate items have quantities combined not duplicated', async ({ page, baseURL, cart }) => {
    test.skip(test.info().project.name === 'webkit', 'localStorage reads unreliable in Playwright WebKit — no coverage until this quirk is worked around, see comment above')

    const guest = cart.guestCartItem()
    const serverCopy = { ...guest, quantity: 3 }

    await cart.seedGuestCart(page, [guest])
    await cart.mockAuthSession(page)
    await cart.mockMergeApi(page, [serverCopy])
    await cart.navigate(page, baseURL!)

    await cart.assertMergedQuantity(page, guest.productId, 3)
  })

  test('Cart badge reflects merged item count', async ({ page, baseURL, cart }) => {
    const guest = cart.guestCartItem()
    const saved = cart.savedCartItem()
    const merged = [{ ...guest, quantity: 2 }, { ...saved, quantity: 1 }]

    await cart.seedGuestCart(page, [guest])
    await cart.mockAuthSession(page)
    await cart.mockMergeApi(page, merged)
    await cart.navigate(page, baseURL!)

    await cart.assertCartBadgeCount(page, 3)
  })

  test('Unauthenticated users keep their guest cart untouched', async ({ page, baseURL, cart }) => {
    const guest = cart.guestCartItem()

    await cart.seedGuestCart(page, [guest])
    await cart.navigate(page, baseURL!)

    await cart.assertLocalStorageCart(page, 1)
  })
})

// =============================================================================
// SMOKE COVERAGE
// =============================================================================

// prettier-ignore
test.describe('Cart Merge — Smoke — Desktop', { tag: ['@cart', '@merge', '@desktop', '@smoke'] }, () => {
  test('Should merge the guest cart into the session on sign-in', async ({ page, baseURL, cart }) => {
    await util.setDeviceMode(page, 'desktop')
    const guest = cart.guestCartItem()

    await cart.seedGuestCart(page, [guest])
    await cart.mockAuthSession(page)
    await cart.mockMergeApi(page, [guest])
    await cart.navigate(page, baseURL!)

    await cart.assertLocalStorageCart(page, 1)
    await cart.assertCartBadgeCount(page, guest.quantity)
  })
})

// prettier-ignore
test.describe('Cart Merge — Smoke — Mobile', { tag: ['@cart', '@merge', '@mobile', '@smoke'] }, () => {
  test('Should merge the guest cart into the session on sign-in', async ({ page, baseURL, cart }) => {
    await util.setDeviceMode(page, 'mobile')
    const guest = cart.guestCartItem()

    await cart.seedGuestCart(page, [guest])
    await cart.mockAuthSession(page)
    await cart.mockMergeApi(page, [guest])
    await cart.navigate(page, baseURL!)

    await cart.assertLocalStorageCart(page, 1)
    await cart.assertCartBadgeCount(page, guest.quantity)
  })
})
