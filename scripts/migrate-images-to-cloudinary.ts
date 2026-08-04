/**
 * Migrate product and hero images from Sanity CDN → Cloudinary.
 *
 * Products: uploads each productImage that has a Sanity asset but no
 *   cloudinaryUrl, then patches the document with the Cloudinary URL.
 *
 * Hero sections: uploads each focalPoints image (mobile/tablet/desktop/xl)
 *   and patches imageMobileCloudinaryUrl / imageTabletCloudinaryUrl / etc.
 *
 * Re-running is safe — already-migrated images are skipped. If Cloudinary
 * already has the asset (same public_id), overwrite=false preserves it.
 *
 * Run:
 *   pnpm migrate-images
 *
 * Prerequisites:
 *   .env.local must contain:
 *     SANITY_API_WRITE_TOKEN      — Editor-level token from sanity.io/manage
 *     NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 *     CLOUDINARY_API_KEY
 *     CLOUDINARY_API_SECRET
 */

import { createClient }  from '@sanity/client'
import { v2 as cloudinary } from 'cloudinary'

// ── Validate env ──────────────────────────────────────────────────────────────

const required = [
  'SANITY_API_WRITE_TOKEN',
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
]
const missing = required.filter(k => !process.env[k])
if (missing.length) {
  console.error(`\n❌ Missing env vars: ${missing.join(', ')}\n`)
  console.error('Add them to .env.local then re-run.\n')
  process.exit(1)
}

// ── Clients ───────────────────────────────────────────────────────────────────

const sanity = createClient({
  projectId:  'tu8h6v2e',
  dataset:    'production',
  token:      process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn:     false,
})

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
})

// ── Helpers ───────────────────────────────────────────────────────────────────

let uploaded = 0
let skipped  = 0
let failed   = 0

async function uploadAndPatch(opts: {
  docId:     string
  assetUrl:  string | null
  publicId:  string
  patchPath: string
  label:     string
}) {
  const { docId, assetUrl, publicId, patchPath, label } = opts

  if (!assetUrl) {
    console.log(`  ⚠  ${label} — no Sanity asset, skipping`)
    skipped++
    return
  }

  try {
    const result = await cloudinary.uploader.upload(assetUrl, {
      public_id:     publicId,
      resource_type: 'image',
      overwrite:     false,
    })

    await sanity
      .patch(docId)
      .set({ [patchPath]: result.secure_url })
      .commit({ autoGenerateArrayKeys: false })

    console.log(`  ✓  ${label} → ${result.secure_url}`)
    uploaded++
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`  ✗  ${label} — ${msg}`)
    failed++
  }
}

// ── Products ──────────────────────────────────────────────────────────────────

type ProductImage = {
  _key:          string
  isMain:        boolean
  cloudinaryUrl: string | null
  assetUrl:      string | null
}

type Product = {
  _id:           string
  name:          string
  slug:          string
  productImages: ProductImage[] | null
}

async function migrateProducts() {
  console.log('── Products ──────────────────────────────────────────────────────\n')

  const products = await sanity.fetch<Product[]>(`
    *[_type == "product" && !(_id in path("drafts.**"))] | order(orderRank asc) {
      _id,
      name,
      "slug": slug.current,
      "productImages": productImages[] {
        _key,
        isMain,
        cloudinaryUrl,
        "assetUrl": image.asset->url
      }
    }
  `)

  console.log(`Found ${products.length} products.\n`)

  for (const product of products) {
    const images = product.productImages ?? []
    if (!images.length) continue

    for (let idx = 0; idx < images.length; idx++) {
      const img = images[idx]

      if (img.cloudinaryUrl) {
        skipped++
        continue
      }

      const label = img.isMain
        ? `${product.name} [★ main]`
        : `${product.name} [gallery ${idx}]`

      await uploadAndPatch({
        docId:     product._id,
        assetUrl:  img.assetUrl,
        publicId:  `tomani-wear/products/${product.slug}-${idx}`,
        patchPath: `productImages[_key=="${img._key}"].cloudinaryUrl`,
        label,
      })
    }
  }
}

// ── Hero (homePage) ───────────────────────────────────────────────────────────

type HeroSection = {
  _key:    string
  title:   string
  focalPoints: {
    imageMobileCloudinaryUrl?:  string | null
    imageTabletCloudinaryUrl?:  string | null
    imageDesktopCloudinaryUrl?: string | null
    imageXlCloudinaryUrl?:      string | null
    imageMobileUrl?:   string | null
    imageTabletUrl?:   string | null
    imageDesktopUrl?:  string | null
    imageXlUrl?:       string | null
  } | null
}

type HomePage = {
  _id:      string
  sections: HeroSection[] | null
}

async function migrateHero() {
  console.log('\n── Hero Images ───────────────────────────────────────────────────\n')

  const homePage = await sanity.fetch<HomePage | null>(`
    *[_type == "homePage"][0] {
      _id,
      "sections": sections[] {
        _key,
        title,
        "focalPoints": focalPoints {
          imageMobileCloudinaryUrl,
          imageTabletCloudinaryUrl,
          imageDesktopCloudinaryUrl,
          imageXlCloudinaryUrl,
          "imageMobileUrl":  imageMobile.asset->url,
          "imageTabletUrl":  imageTablet.asset->url,
          "imageDesktopUrl": imageDesktop.asset->url,
          "imageXlUrl":      imageXl.asset->url
        }
      }
    }
  `)

  if (!homePage) {
    console.log('  No homePage document found, skipping.\n')
    return
  }

  const sections = homePage.sections ?? []
  console.log(`Found ${sections.length} hero sections.\n`)

  for (const section of sections) {
    const fp = section.focalPoints
    if (!fp) continue

    const base = `sections[_key=="${section._key}"].focalPoints`
    const slug = section.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 40)

    const variants: Array<{ cloudinaryUrl: string | null | undefined; assetUrl: string | null | undefined; suffix: string; field: string }> = [
      { cloudinaryUrl: fp.imageMobileCloudinaryUrl,  assetUrl: fp.imageMobileUrl,  suffix: 'mobile',  field: 'imageMobileCloudinaryUrl'  },
      { cloudinaryUrl: fp.imageTabletCloudinaryUrl,  assetUrl: fp.imageTabletUrl,  suffix: 'tablet',  field: 'imageTabletCloudinaryUrl'  },
      { cloudinaryUrl: fp.imageDesktopCloudinaryUrl, assetUrl: fp.imageDesktopUrl, suffix: 'desktop', field: 'imageDesktopCloudinaryUrl' },
      { cloudinaryUrl: fp.imageXlCloudinaryUrl,      assetUrl: fp.imageXlUrl,      suffix: 'xl',      field: 'imageXlCloudinaryUrl'      },
    ]

    for (const v of variants) {
      if (v.cloudinaryUrl) { skipped++; continue }
      if (!v.assetUrl) continue

      await uploadAndPatch({
        docId:     homePage._id,
        assetUrl:  v.assetUrl,
        publicId:  `tomani-wear/hero/${slug}-${v.suffix}`,
        patchPath: `${base}.${v.field}`,
        label:     `Hero "${section.title}" [${v.suffix}]`,
      })
    }
  }
}

// ── Run ───────────────────────────────────────────────────────────────────────

async function run() {
  console.log('\n🚀 Tomani Wear — Cloudinary migration\n')

  await migrateProducts()
  await migrateHero()

  console.log('\n─────────────────────────────────────────')
  console.log(`Uploaded:  ${uploaded}`)
  console.log(`Skipped:   ${skipped}  (already on Cloudinary)`)
  console.log(`Failed:    ${failed}`)
  console.log('─────────────────────────────────────────\n')

  if (failed > 0) {
    console.log('Some uploads failed. Fix the errors above and re-run — already-migrated images will be skipped.\n')
    process.exit(1)
  }

  console.log('✅ Migration complete. All images are now on Cloudinary.\n')
  console.log('Next steps:')
  console.log('  1. Push to dev and verify images load from res.cloudinary.com')
  console.log('  2. Monitor Sanity bandwidth over the next billing period')
  console.log('  3. If bandwidth stays below 10 GB/month, downgrade Sanity to Free plan\n')
}

run().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
