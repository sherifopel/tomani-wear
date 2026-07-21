import { defineConfig, definePlugin } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { schemaTypes } from './src/sanity/schemas'
import { InfoTooltipField } from './src/sanity/components/InfoTooltipField'
import DiscountCodesTool from './src/sanity/tools/DiscountCodesTool'

const discountCodesPlugin = definePlugin({
  name: 'discount-codes-plugin',
  tools: [
    {
      name: 'discount-codes',
      title: 'Discount Codes',
      component: DiscountCodesTool,
    },
  ],
})

export default defineConfig({
  name: 'default',
  title: 'Tomanni Wear',
  projectId: 'tu8h6v2e',
  dataset: 'production',
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
            orderableDocumentListDeskItem({ type: 'product', title: 'Products', S, context }),
            S.listItem()
              .title('Navigation')
              .child(
                S.document()
                  .schemaType('navigation')
                  .documentId('navigation-singleton')
                  .title('Navigation')
              ),
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
    discountCodesPlugin(),
  ],
  schema: {
    types: schemaTypes,
  },
  form: {
    components: {
      field: InfoTooltipField,
    },
  },
})
