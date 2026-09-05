import { createClient } from '@sanity/client'

const sanity = createClient({
  projectId:  'tu8h6v2e',
  dataset:    'production',
  token:      process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn:     false,
})

const doc = await sanity.fetch(`*[_type == "homePage"][0]{ _id }`)

console.log('\n🧹 Removing videoCloudinaryUrl from all hero sections...\n')

await sanity.patch(doc._id)
  .unset([
    // Hero 1 (cherry blossoms / boot image) — has static images now, no video needed
    'sections[_key=="5a31763090d0"].focalPoints.videoCloudinaryUrl',
    'sections[_key=="5a31763090d0"].focalPoints.videoDesktopCloudinaryUrl',
    // MENS DROP — still has video URL, needs to go too
    'sections[_key=="8147e4dea770"].focalPoints.videoCloudinaryUrl',
    'sections[_key=="8147e4dea770"].focalPoints.videoDesktopCloudinaryUrl',
  ])
  .commit({ autoGenerateArrayKeys: false })

console.log('✓ Hero 1 video URL removed — boot image will now show on mobile + desktop')
console.log('✓ MENS DROP video URL removed — section will go hidden (no image set yet)')
console.log('\n✅ Done. Cloudinary will no longer be hit for video bandwidth.\n')
console.log('Next: add a still image to MENS DROP in Sanity Studio to bring that section back.\n')
