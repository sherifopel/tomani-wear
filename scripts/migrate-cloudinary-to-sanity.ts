/**
 * One-time migration: copy every Cloudinary product image into Sanity's native
 * asset store and patch each productImages[].image field with the new reference.
 *
 * After running this script:
 *  - All productImages items will have both cloudinaryUrl (kept for rollback)
 *    and image.asset (the new Sanity native asset).
 *  - The updated queries.ts prefers image.asset->url over cloudinaryUrl, so
 *    the site automatically switches to Sanity CDN after the next deploy.
 *
 * Run:
 *   pnpm migrate:sanity
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local
 * Safe to run multiple times — Sanity deduplicates identical uploads by hash,
 * and already-migrated images are skipped.
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'tu8h6v2e',
  dataset:   'production',
  token:     process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn:    false,
})

type ProductImage = {
  _key:          string
  cloudinaryUrl?: string
  alreadyMigrated: boolean
}

type Product = {
  _id:           string
  name:          string
  productImages: ProductImage[]
}

function filenameFromUrl(url: string): string {
  const raw = url.split('/').pop()?.split('?')[0] ?? 'image.jpg'
  // f_auto may have changed the extension to .webp — keep it as-is so Sanity
  // stores the actual format; Sanity will serve WebP/AVIF via auto=format anyway.
  return raw
}

async function downloadImage(url: string): Promise<{ buffer: Buffer; contentType: string }> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  const contentType = res.headers.get('content-type') ?? 'image/jpeg'
  const buffer = Buffer.from(await res.arrayBuffer())
  return { buffer, contentType }
}

async function run() {
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) {
    console.error('❌  SANITY_API_WRITE_TOKEN is not set — add it to .env.local')
    process.exit(1)
  }

  console.log('Querying Sanity for products with Cloudinary images…\n')

  const products = await client.fetch<Product[]>(`
    *[_type == "product" && count(productImages[defined(cloudinaryUrl)]) > 0]
    | order(_createdAt asc) {
      _id,
      name,
      productImages[defined(cloudinaryUrl)] {
        _key,
        cloudinaryUrl,
        "alreadyMigrated": defined(image.asset._ref)
      }
    }
  `)

  const toDo = products.filter(p =>
    p.productImages.some(img => !img.alreadyMigrated)
  )

  console.log(`Products needing migration: ${toDo.length} of ${products.length}`)
  if (toDo.length === 0) {
    console.log('Nothing to do — all product images already have Sanity native assets. ✅')
    return
  }

  let migrated = 0
  let skipped  = 0
  let failed   = 0

  for (const product of toDo) {
    const images = product.productImages.filter(img => !img.alreadyMigrated)
    console.log(`\n📦 ${product.name}  (${images.length} image${images.length === 1 ? '' : 's'})`)

    const patches: Record<string, unknown> = {}

    for (const img of images) {
      const url = img.cloudinaryUrl!

      try {
        process.stdout.write(`  ↓ ${url.slice(url.indexOf('/upload/') + 8, url.indexOf('/upload/') + 60)}… `)

        const { buffer, contentType } = await downloadImage(url)
        const filename = filenameFromUrl(url)

        process.stdout.write(`${(buffer.length / 1024).toFixed(0)} KB  ↑ uploading…`)

        const asset = await client.assets.upload('image', buffer, { filename, contentType })

        process.stdout.write(` ✅\n`)

        patches[`productImages[_key=="${img._key}"].image`] = {
          _type:  'image',
          asset:  { _type: 'reference', _ref: asset._id },
        }
        migrated++
      } catch (err) {
        process.stdout.write(` ❌ ${(err as Error).message}\n`)
        failed++
      }
    }

    if (Object.keys(patches).length > 0) {
      await client.patch(product._id).set(patches).commit()
      console.log(`  💾 Sanity document patched`)
    }
  }

  const bar = '─'.repeat(56)
  console.log(`\n${bar}`)
  console.log(`✅ Migrated : ${migrated}`)
  console.log(`❌ Failed   : ${failed}`)
  if (failed > 0) {
    console.log('\nRe-run the script to retry failed images.')
    console.log('Sanity deduplicates by hash — no duplicate assets will be created.')
  }
}

run().catch(err => {
  console.error('\nFatal error:', err)
  process.exit(1)
})
