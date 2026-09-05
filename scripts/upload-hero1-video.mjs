import { createClient } from '@sanity/client'
import { v2 as cloudinary } from 'cloudinary'

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

const FILE_PATH   = `${process.env.HOME}/Downloads/10352446-uhd_4096_2160_25fps.mp4`
const PUBLIC_ID   = 'tomani-wear/hero/hero1-video'
const SECTION_KEY = '5a31763090d0'  // hero 1

console.log('\n🎬 Uploading hero 1 video to Cloudinary...')
console.log('Source:', FILE_PATH)
console.log('Target: cloudinary/' + PUBLIC_ID + '\n')

const result = await cloudinary.uploader.upload(FILE_PATH, {
  public_id:     PUBLIC_ID,
  resource_type: 'video',
  overwrite:     true,
})

console.log('✓ Uploaded:', result.secure_url)
console.log('  Duration:', result.duration?.toFixed(1) + 's', '| Size:', (result.bytes / 1_000_000).toFixed(1) + ' MB\n')

const doc = await sanity.fetch(`*[_type == "homePage"][0]{ _id }`)

await sanity.patch(doc._id)
  .set({
    [`sections[_key=="${SECTION_KEY}"].focalPoints.videoCloudinaryUrl`]: result.secure_url,
    [`sections[_key=="${SECTION_KEY}"].enabled`]: true,
  })
  .commit({ autoGenerateArrayKeys: false })

console.log('✓ Sanity patched — hero 1 re-enabled with Cloudinary video URL')
console.log('\n✅ All 3 hero sections are now live:\n')
console.log('  1. hero 1     → video (Cloudinary)')
console.log('  2. New In     → image (Cloudinary)')
console.log('  3. MENS DROP  → video (Cloudinary)\n')
