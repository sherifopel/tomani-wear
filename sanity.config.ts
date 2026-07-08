import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { schemaTypes } from './src/sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Tomanni Wear',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tu8h6v2e',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Home Page')
              .child(
                S.document()
                  .schemaType('homePage')
                  .documentId('home-page-singleton')
                  .title('Home Page')
              ),
            S.listItem()
              .title('Hero Slides')
              .schemaType('heroSlide')
              .child(S.documentTypeList('heroSlide').title('Hero Slides')),
            orderableDocumentListDeskItem({ type: 'product', title: 'Products', S, context }),
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
