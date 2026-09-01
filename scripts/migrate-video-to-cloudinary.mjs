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

// MENS DROP video — _key "8147e4dea770"
const SECTION_KEY = '8147e4dea770'
const VIDEO_URL   = 'https://cdn.sanity.io/files/tu8h6v2e/production/df9d16c279ec945989c3fdcd4d3517e734023dc6.mp4'
const ASSET_ID    = 'file-df9d16c279ec945989c3fdcd4d3517e734023dc6-mp4'
const PUBLIC_ID   = 'tomani-wear/hero/mens-drop-video'

console.log('\n🎬 Uploading MENS DROP video to Cloudinary...\n')
console.log('Source:', VIDEO_URL)
console.log('Target:', `cloudinary/${PUBLIC_ID}\n`)

// Upload — resource_type video, overwrite:false so safe to re-run
const result = await cloudinary.uploader.upload(VIDEO_URL, {
  public_id:     PUBLIC_ID,
  resource_type: 'video',
  overwrite:     false,
})

console.log('✓ Uploaded:', result.secure_url)
console.log('  Format:', result.format, '| Duration:', result.duration?.toFixed(1) + 's', '| Size:', (result.bytes / 1_000_000).toFixed(2) + ' MB\n')

// Patch Sanity doc with the Cloudinary URL
const doc = await sanity.fetch(`*[_type == "homePage"][0]{ _id }`)
await sanity.patch(doc._id)
  .set({ [`sections[_key=="${SECTION_KEY}"].focalPoints.videoCloudinaryUrl`]: result.secure_url })
  .commit({ autoGenerateArrayKeys: false })

console.log('✓ Sanity document patched — videoCloudinaryUrl set on MENS DROP section')

// Delete the original asset from Sanity
console.log('\nDeleting original video from Sanity library...')
try {
  await sanity.delete(ASSET_ID)
  console.log('✓ Asset deleted:', ASSET_ID)
} catch (err) {
  console.error('✗ Could not delete asset yet:', err.message)
  console.log('  (The focalPoints.video field still holds a reference — run delete-stock-video.mjs first)')
}

console.log('\n✅ MENS DROP video is now on Cloudinary. Zero Sanity bandwidth from here.\n')
