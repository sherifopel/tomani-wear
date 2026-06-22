import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { previewHeroAction } from './src/sanity/actions/previewHeroAction'
import { schemaTypes } from './src/sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Tomanni Wear',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tu8h6v2e',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'heroSlide') {
        return [previewHeroAction, ...prev]
      }

      return prev
    },
  },
})
