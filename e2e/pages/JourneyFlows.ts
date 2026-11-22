import { Page } from '@playwright/test'
import { Log } from 'logr-kit'
import * as pdp from './03-PdpPage'

// Multi-page journeys that compose other page objects' own functions.
// Holds no selectors of its own — every locator lives with the page it
// belongs to.

// =============================================================================
// ACTIONS
// =============================================================================

export async function addProductToCart(page: Page, baseURL: string, slug: string) {
  Log.info(`adding ${slug} to cart from its PDP`)
  await pdp.navigate(page, baseURL, slug)
  await pdp.selectFirstAvailableSize(page)
  await pdp.clickAddToCart(page)
  await pdp.assertAddedToCartConfirmation(page)
  Log.ok(`${slug} added to cart`)
}
