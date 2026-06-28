import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Tomanni Wear',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tu8h6v2e',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Hero Slide')
              .schemaType('heroSlide')
              .child(S.documentTypeList('heroSlide').title('Hero Slides')),
            S.listItem()
              .title('Product')
              .schemaType('product')
              .child(S.documentTypeList('product').title('Products')),
            S.listItem()
              .title('Global Settings')
              .child(
                S.document()
                  .schemaType('settings')
                  .documentId('global-settings')
                  .title('Settings')
              ),
            S.listItem()
              .title('Orders')
              .schemaType('order')
              .child(S.documentTypeList('order').title('Orders')),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
