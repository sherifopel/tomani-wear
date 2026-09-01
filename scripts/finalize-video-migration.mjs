import { createClient } from '@sanity/client'

const sanity = createClient({
  projectId:  'tu8h6v2e',
  dataset:    'production',
  token:      process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn:     false,
})

const SECTION_KEY = '8147e4dea770'  // MENS DROP
const ASSET_ID    = 'file-df9d16c279ec945989c3fdcd4d3517e734023dc6-mp4'

const doc = await sanity.fetch(`*[_type == "homePage"][0]{ _id }`)

// Remove the Sanity file reference — Cloudinary URL is already stored in videoCloudinaryUrl
await sanity.patch(doc._id)
  .unset([`sections[_key=="${SECTION_KEY}"].focalPoints.video`])
  .commit({ autoGenerateArrayKeys: false })
console.log('✓ focalPoints.video unset from MENS DROP section')

// Now delete the asset
await sanity.delete(ASSET_ID)
console.log('✓ Sanity video asset deleted:', ASSET_ID)

console.log('\n✅ Cleanup complete — MENS DROP video fully migrated to Cloudinary.\n')
