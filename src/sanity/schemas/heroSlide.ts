import { defineField, defineType } from 'sanity'
import { HeroFocalPreview } from '../components/HeroFocalPreview'

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
      description: 'Upload one image. The preview below shows how it crops on each device — use the slider to adjust the focal point.',
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
      name: 'focalPoints',
      title: 'Image Preview & Focal Points',
      description: 'Preview how the hero image crops on each device and adjust the focal point.',
      type: 'object',
      fields: [
        defineField({ name: 'mobile',  title: 'Mobile focal Y',  type: 'number', initialValue: 50 }),
        defineField({ name: 'tablet',  title: 'Tablet focal Y',  type: 'number', initialValue: 50 }),
        defineField({ name: 'desktop', title: 'Desktop focal Y', type: 'number', initialValue: 30 }),
      ],
      components: { input: HeroFocalPreview },
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
