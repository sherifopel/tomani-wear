'use strict'
/* eslint-disable @typescript-eslint/no-require-imports */

const { createClient }  = require('@sanity/client')
const { v2: cloudinary } = require('cloudinary')

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

// ── Counters ──────────────────────────────────────────────────────────────────

let uploaded = 0
let skipped  = 0
let failed   = 0

async function uploadAndPatch({ docId, assetUrl, publicId, patchPath, label }) {
  if (!assetUrl) { console.log(`  ⚠  ${label} — no Sanity asset, skipping`); skipped++; return }

  try {
    const result = await cloudinary.uploader.upload(assetUrl, {
      public_id:     publicId,
      resource_type: 'image',
      overwrite:     false,
    })
    await sanity.patch(docId).set({ [patchPath]: result.secure_url }).commit({ autoGenerateArrayKeys: false })
    console.log(`  ✓  ${label} → ${result.secure_url}`)
    uploaded++
  } catch (err) {
    console.error(`  ✗  ${label} — ${err.message ?? err}`)
    failed++
  }
}

// ── Products ──────────────────────────────────────────────────────────────────

async function migrateProducts() {
  console.log('── Products ──────────────────────────────────────────────────────\n')

  const products = await sanity.fetch(`
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
    for (let idx = 0; idx < images.length; idx++) {
      const img = images[idx]
      if (img.cloudinaryUrl) { skipped++; continue }
      const label = img.isMain ? `${product.name} [★ main]` : `${product.name} [gallery ${idx}]`
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

// ── Hero ──────────────────────────────────────────────────────────────────────

async function migrateHero() {
  console.log('\n── Hero Images ───────────────────────────────────────────────────\n')

  const homePage = await sanity.fetch(`
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

  if (!homePage) { console.log('  No homePage document found.\n'); return }

  const sections = homePage.sections ?? []
  console.log(`Found ${sections.length} hero sections.\n`)

  for (const section of sections) {
    const fp = section.focalPoints
    if (!fp) continue
    const base = `sections[_key=="${section._key}"].focalPoints`
    const slug = section.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 40)

    const variants = [
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

  if (failed > 0) { console.log('Some uploads failed — re-run to retry.\n'); process.exit(1) }
  console.log('✅ Migration complete. All images are now on Cloudinary.\n')
}

run().catch(err => { console.error('Fatal:', err); process.exit(1) })
