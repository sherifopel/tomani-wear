/**
 * Bulk publish all product drafts.
 * Run: npx tsx scripts/publish-all-products.ts
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
  const drafts = await client.fetch<Array<Record<string, unknown>>>(
    `*[_type == "product" && _id in path("drafts.**")]`
  )

  if (drafts.length === 0) {
    console.log('No product drafts found — everything is already published.')
    return
  }

  console.log(`Publishing ${drafts.length} product draft(s)…`)

  const tx = client.transaction()

  for (const draft of drafts) {
    const draftId     = draft._id as string
    const publishedId = draftId.replace('drafts.', '')
    tx.createOrReplace({ ...draft, _id: publishedId })
    tx.delete(draftId)
  }

  await tx.commit()
  console.log(`✅ Done — ${drafts.length} product(s) published.`)
}

run().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
