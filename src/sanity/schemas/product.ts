import { defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
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

    // ── Pricing ───────────────────────────────────────────────────────────
    // compareAtPrice is the Shopify standard pattern for sales:
    //   price           = what the customer pays today
    //   compareAtPrice  = the original price (only set when on sale)
    //
    // If compareAtPrice is set and higher than price → item is on sale.
    // To end a sale: just remove compareAtPrice. No boolean to forget.
    defineField({
      name: 'price',
      title: 'Price (₦)',
      description: 'Current selling price. Lower this when putting an item on sale.',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare-at Price (₦)',
      description: 'Original price before the sale. Leave empty if not on sale.',
      type: 'number',
      validation: (Rule) => Rule.positive(),
    }),

    // ── Media ─────────────────────────────────────────────────────────────
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      description: 'Additional angles (front, back, detail). Used when no colour variants are defined.',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'variants',
      title: 'Colour Variants',
      description: 'Each colour gets its own images and available sizes.',
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
              description: 'e.g. #000000 — used for the swatch circle on the product page',
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
              description: 'Sizes available in this colour.',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                list: [
                  { title: 'XS',  value: 'XS'  },
                  { title: 'S',   value: 'S'   },
                  { title: 'M',   value: 'M'   },
                  { title: 'L',   value: 'L'   },
                  { title: 'XL',  value: 'XL'  },
                  { title: 'XXL', value: 'XXL' },
                ],
              },
            }),
          ],
        },
      ],
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
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      description: 'Select all sizes currently in stock.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'XS', value: 'XS' },
          { title: 'S',  value: 'S'  },
          { title: 'M',  value: 'M'  },
          { title: 'L',  value: 'L'  },
          { title: 'XL', value: 'XL' },
          { title: 'XXL', value: 'XXL' },
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
  ],
})
