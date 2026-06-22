import { defineField, defineType } from 'sanity'
import { ProductEditor } from '../components/ProductEditor'

const CLOTHING_SIZES = [
  { title: 'XS',  value: 'XS'  },
  { title: 'S',   value: 'S'   },
  { title: 'M',   value: 'M'   },
  { title: 'L',   value: 'L'   },
  { title: 'XL',  value: 'XL'  },
  { title: 'XXL', value: 'XXL' },
]

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  preview: {
    select: {
      title: 'name',
      media: 'productSetup.mainImage',
    },
  },
  fields: [
    // ── Identity ──────────────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),

    // ── Details ───────────────────────────────────────────────────────────
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Men',         value: 'men'         },
          { title: 'Women',       value: 'women'       },
          { title: 'Accessories', value: 'accessories' },
        ],
      },
    }),

    // ── Visibility ────────────────────────────────────────────────────────
    defineField({
      name: 'featured',
      title: 'Show in New Arrivals',
      description: 'Tick to feature this product on the homepage carousel.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      description: 'Untick to mark as sold out.',
      type: 'boolean',
      initialValue: true,
    }),

    // ── Product Setup (unified editor) ────────────────────────────────────
    defineField({
      name: 'productSetup',
      title: 'Product Setup',
      description: 'Images, sizes, and pricing — all in one place.',
      type: 'object',
      components: { input: ProductEditor },
      fields: [
        // ── Images ──
        defineField({
          name: 'mainImage',
          title: 'Main Display Image',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'gallery',
          title: 'Additional Images',
          type: 'array',
          of: [{ type: 'image', options: { hotspot: true } }],
        }),
        // ── Colour variants ──
        defineField({
          name: 'variants',
          title: 'Colour Variants',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'colorName',
                  title: 'Colour Name',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'colorHex',
                  title: 'Colour Hex',
                  type: 'string',
                }),
                defineField({
                  name: 'images',
                  title: 'Images',
                  type: 'array',
                  of: [{ type: 'image', options: { hotspot: true } }],
                }),
                defineField({
                  name: 'sizes',
                  title: 'Available Sizes',
                  type: 'array',
                  of: [{ type: 'string' }],
                  options: { list: CLOTHING_SIZES },
                }),
              ],
            },
          ],
        }),
        // ── Sizes ──
        defineField({
          name: 'clothingSizes',
          title: 'Clothing Sizes',
          type: 'array',
          of: [{ type: 'string' }],
          options: { list: CLOTHING_SIZES },
        }),
        defineField({
          name: 'shoeSizes',
          title: 'Shoe Sizes',
          type: 'string',
        }),
        // ── Pricing ──
        defineField({
          name: 'price',
          title: 'Price (₦)',
          type: 'number',
          validation: (Rule) => Rule.required().positive(),
        }),
        defineField({
          name: 'compareAtPrice',
          title: 'Compare-at Price (₦)',
          type: 'number',
        }),
      ],
    }),
  ],
})
