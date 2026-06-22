import { defineField, defineType } from 'sanity'
import { FocalYSlider } from '../components/FocalYSlider'

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
      name: 'mobileImage',
      title: 'Small Hero Image',
      description: 'Used on phones. Crop this for the small preview.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'mediumImage',
      title: 'Medium Hero Image',
      description: 'Used on tablets and medium screens. If empty, the small image is reused.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'image',
      title: 'Large Hero Image',
      description: 'Used on desktop. The site crops this to a 1505 x 600 hero frame.',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'extraLargeImage',
      title: 'Extra Large Hero Image',
      description: 'Used on extra large screens. If empty, the large image is reused.',
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
      name: 'desktopFocalY',
      title: 'Desktop Image Position (vertical)',
      description: 'Slide to control which part of the image shows on desktop. 0 = top of image, 50 = middle, 100 = bottom. Start at 30 — most portrait photos show the face there.',
      type: 'number',
      initialValue: 30,
      validation: (Rule) => Rule.min(0).max(100),
      components: { input: FocalYSlider },
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
