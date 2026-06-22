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
      title: 'Desktop Hero Image',
      description: 'Use a wide landscape image. Click the crop icon to control how it appears on desktop.',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mobileImage',
      title: 'Mobile Hero Image',
      description: 'Optional. Use a tall portrait image for phones. If empty, the desktop image is reused.',
      type: 'image',
      options: { hotspot: true },
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
  preview: {
    select: {
      title: 'title',
      media: 'image',
      order: 'order',
    },
    prepare({ title, media, order }) {
      return {
        title,
        media,
        subtitle: typeof order === 'number' ? `Slide order: ${order}` : 'Hero slide',
      }
    },
  },
})
