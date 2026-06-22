import { defineField, defineType } from 'sanity'

export const heroSlide = defineType({
  name: 'heroSlide',
  title: 'Hero Slide',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      description: 'Only used inside Sanity to identify this slide.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Small Label',
      description: 'Example: New Drop',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Main Heading',
      description: 'Use line breaks if you want the heading split across lines.',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sub',
      title: 'Subheading',
      type: 'string',
    }),
    defineField({
      name: 'href',
      title: 'Button Link',
      description: 'Example: /products',
      type: 'string',
      initialValue: '/products',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      description: 'Lower numbers show first.',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'enabled',
      title: 'Show Slide',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})
