import { defineField, defineType } from 'sanity'
import { ProductEditor } from '../components/ProductEditor'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  // Apply the custom UI at the document level so Tomiwa sees one clean form
  components: { input: ProductEditor },
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
      description: 'Auto-generated from the name. Used in the product URL.',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
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
      name: 'description',
      title: 'Description',
      type: 'text',
    }),

    // ── Images (managed via ProductEditor UI) ─────────────────────────────
    // All product images live in one pool. The one marked isMain = true
    // becomes the hero shot; the rest become the gallery.
    defineField({
      name: 'productImages',
      title: 'Product Images',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'isMain', title: 'Main Display', type: 'boolean', initialValue: false }),
          ],
          preview: {
            select: { media: 'image', isMain: 'isMain' },
            prepare({ media, isMain }) {
              return { title: isMain ? '★ Main Display' : 'Gallery image', media }
            },
          },
        },
      ],
    }),

    // ── Colour Variants (managed via ProductEditor UI) ─────────────────────
    defineField({
      name: 'variants',
      title: 'Colour Variants',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'colorName', title: 'Colour Name', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'colorHex',  title: 'Hex Code',    type: 'string' }),
            defineField({
              name: 'sizes',
              title: 'Available Sizes',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                list: [
                  { title: 'XS', value: 'XS' }, { title: 'S', value: 'S' },
                  { title: 'M',  value: 'M'  }, { title: 'L', value: 'L' },
                  { title: 'XL', value: 'XL' }, { title: 'XXL', value: 'XXL' },
                ],
              },
            }),
          ],
        },
      ],
    }),

    // ── Sizes (managed via ProductEditor UI) ──────────────────────────────
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'XS', value: 'XS' }, { title: 'S', value: 'S'  },
          { title: 'M',  value: 'M'  }, { title: 'L', value: 'L'  },
          { title: 'XL', value: 'XL' }, { title: 'XXL', value: 'XXL' },
        ],
      },
    }),
    defineField({
      name: 'shoeSizes',
      title: 'Shoe Sizes',
      description: 'Comma-separated, e.g. 40, 41, 42, 43',
      type: 'string',
    }),

    // ── Pricing (managed via ProductEditor UI) ────────────────────────────
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
      validation: (Rule) => Rule.positive(),
    }),

    // ── Visibility ────────────────────────────────────────────────────────
    defineField({
      name: 'featured',
      title: 'Show in New Arrivals',
      description: 'Tick to feature this product on the homepage.',
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
  preview: {
    select: { title: 'name', media: 'productImages.0.image', price: 'price' },
    prepare({ title, media, price }) {
      return {
        title:    title ?? 'Untitled product',
        media,
        subtitle: price ? `₦${Number(price).toLocaleString()}` : 'No price set',
      }
    },
  },
})
