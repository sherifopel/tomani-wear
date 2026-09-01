import { createClient } from '@sanity/client'

const sanity = createClient({
  projectId:  'tu8h6v2e',
  dataset:    'production',
  token:      process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn:     false,
})

const ASSET_ID   = 'file-bd3677b63f72fabee1dcd11bddd0e66907e4471d-mp4'
const HERO_SLIDE = 'fccf8f12-b139-4b8e-ad8b-4bde5e97cdee'

// See what fields the heroSlide has so we can unset the right one
const slide = await sanity.fetch('*[_id == $id][0]', { id: HERO_SLIDE })
console.log('heroSlide document:', JSON.stringify(slide, null, 2))

// The reference is at focalPoints.video.asset._ref
await sanity.patch(HERO_SLIDE).unset(['focalPoints.video']).commit()
console.log('✓ Video reference cleared from heroSlide "Hero4"')

// Now delete the asset
console.log('\nDeleting asset from Sanity library...')
try {
  await sanity.delete(ASSET_ID)
  console.log('✓ Asset deleted:', ASSET_ID)
  console.log('\n✅ 42 MB stock video permanently removed from Sanity.')
} catch (err) {
  console.error('✗ Delete still failed:', err.message)
  console.log('\nYou may need to delete it manually in Sanity Studio → Files.')
}
