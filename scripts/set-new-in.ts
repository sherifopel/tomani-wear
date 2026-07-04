/**
 * Set newIn: true on all published products.
 * Run: pnpm set-new-in
 *
 * Pass --false to disable instead: pnpm set-new-in -- --false
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
  const enable = !process.argv.includes('--false')

  const products = await client.fetch<Array<{ _id: string; name: string }>>(
    `*[_type == "product" && !(_id in path("drafts.**"))]{ _id, name }`
  )

  if (products.length === 0) {
    console.log('No published products found.')
    return
  }

  console.log(`Setting newIn = ${enable} on ${products.length} product(s)…`)

  const tx = client.transaction()
  for (const p of products) {
    tx.patch(p._id, { set: { newIn: enable } })
  }

  await tx.commit()
  console.log(`✅ Done — ${products.length} product(s) updated.`)
}

run().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
