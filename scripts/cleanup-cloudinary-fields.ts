/**
 * Removes the legacy cloudinaryUrl field from every productImages[] item
 * in every product document, now that all images have been migrated to
 * Sanity native assets via migrate-cloudinary-to-sanity.ts.
 *
 * Also unsets the homePage Cloudinary URL fields (imageMobileCloudinaryUrl etc.)
 * — they were never populated so this is a no-op, but it leaves the data clean.
 *
 * Safe to run multiple times.
 * Run: pnpm cleanup:cloudinary
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'tu8h6v2e',
  dataset:   'production',
  token:     process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn:    false,
})

async function run() {
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) {
    console.error('❌  SANITY_API_WRITE_TOKEN is not set — add it to .env.local')
    process.exit(1)
  }

  // ── 1. Products ────────────────────────────────────────────────────────────
  console.log('Querying products with cloudinaryUrl still set…\n')

  type ImageKey = { _key: string }
  type Product  = { _id: string; name: string; productImages: ImageKey[] }

  const products = await client.fetch<Product[]>(`
    *[_type == "product" && count(productImages[defined(cloudinaryUrl)]) > 0] {
      _id, name,
      productImages[defined(cloudinaryUrl)]{ _key }
    }
  `)

  if (products.length === 0) {
    console.log('Products: nothing to clean up ✅')
  } else {
    console.log(`Cleaning ${products.length} products…`)

    for (const product of products) {
      const unsets = product.productImages.map(
        img => `productImages[_key=="${img._key}"].cloudinaryUrl`
      )
      await client.patch(product._id).unset(unsets).commit()
      console.log(`  ✅ ${product.name} — unset ${unsets.length} cloudinaryUrl field(s)`)
    }
  }

  // ── 2. homePage Cloudinary fields ─────────────────────────────────────────
  console.log('\nCleaning homePage Cloudinary URL fields…')

  const homePage = await client.fetch<{ _id: string } | null>(
    `*[_type == "homePage"][0]{ _id }`
  )

  if (homePage) {
    // These fields are already null but we unset them properly so Sanity doesn't
    // store them as ghost keys in the document.
    await client.patch(homePage._id).unset([
      'sections[].focalPoints.imageMobileCloudinaryUrl',
      'sections[].focalPoints.imageTabletCloudinaryUrl',
      'sections[].focalPoints.imageDesktopCloudinaryUrl',
      'sections[].focalPoints.imageXlCloudinaryUrl',
      'sections[].focalPoints.videoCloudinaryUrl',
      'sections[].focalPoints.videoDesktopCloudinaryUrl',
    ]).commit()
    console.log('  ✅ homePage Cloudinary URL fields unset')
  } else {
    console.log('  homePage document not found — skipping')
  }

  console.log('\n🎉 Cleanup complete.')
}

run().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
