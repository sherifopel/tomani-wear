import { defineField, defineType } from 'sanity'
import { Image, Video } from 'lucide-react'
import { HeroFocalPreview } from '../components/HeroFocalPreview'
import { HeroContentPreview } from '../components/HeroContentPreview'
import { FocalYSlider, FocalXSlider } from '../components/FocalYSlider'
import { ColorPickerInput } from '../components/ColorPickerInput'

export const heroSlide = defineType({
  name: 'heroSlide',
  title: 'Hero Slide',
  type: 'document',
  icon: Image,

  // Groups create visual tabs in Sanity Studio.
  // Fields without a group appear above the tabs (always visible).
  groups: [
    { name: 'images',   title: 'Images',          default: true },
    { name: 'content',  title: 'Content & Style'               },
    { name: 'settings', title: 'Settings'                      },
  ],

  fields: [
    // ── Always visible — above all tabs ───────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Internal Title',
      description: 'Only visible inside Sanity — used to identify this slide in the list. Customers never see it.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // ── Images tab ────────────────────────────────────────────────────────────
    defineField({
      name: 'focalPoints',
      title: 'Device Images & Crop Preview',
      description: 'Upload one image per device and adjust the crop position for each.',
      type: 'object',
      group: 'images',
      fields: [
        // Per-device image uploads
        defineField({
          name: 'imageMobile',
          title: 'Mobile Image',
          description: 'Shown on phones (below 768px). Portrait or square. Recommended: 9:16.',
          type: 'image',
          options: { hotspot: true },
          validation: (Rule) => Rule.custom((value, ctx) => {
            const doc = ctx.document as { focalPoints?: { video?: { asset?: { _ref?: string } } } } | undefined
            if (doc?.focalPoints?.video?.asset?._ref) return true
            return value ? true : 'Required when no video is set'
          }),
        }),
        defineField({
          name: 'imageTablet',
          title: 'Tablet Image',
          description: 'Shown on tablets (768px – 1023px). Leave empty to reuse Mobile. Recommended: 4:3.',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'imageDesktop',
          title: 'Desktop Image',
          description: 'Shown on desktops (1024px – 1279px). Leave empty to reuse Tablet. Recommended: 16:6.',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'imageXl',
          title: 'Extra Large Image',
          description: 'Shown on large screens (1280px+). Leave empty to reuse Desktop. Recommended: 16:5.',
          type: 'image',
          options: { hotspot: true },
        }),
        // Video — inside focalPoints so it renders within the HeroFocalPreview container
        defineField({
          name: 'video',
          title: 'Hero Video',
          description: 'Optional. Upload an MP4 or WebM. When set, the video plays on loop on the live site. The crop sliders below still control how it is framed.',
          type: 'file',
          options: { accept: 'video/mp4,video/webm' },
        }),
        // Per-device crop position — managed by the sliders in the preview UI
        defineField({ name: 'mobile',   title: 'Mobile crop Y',          type: 'number', initialValue: 50 }),
        defineField({ name: 'tablet',   title: 'Tablet crop Y',          type: 'number', initialValue: 50 }),
        defineField({ name: 'desktop',  title: 'Desktop crop Y',         type: 'number', initialValue: 30 }),
        defineField({ name: 'xlarge',   title: 'Extra Large crop Y',     type: 'number', initialValue: 30 }),
        defineField({ name: 'mobileX',  title: 'Mobile crop X',          type: 'number', initialValue: 50 }),
        defineField({ name: 'tabletX',  title: 'Tablet crop X',          type: 'number', initialValue: 50 }),
        defineField({ name: 'desktopX', title: 'Desktop crop X',         type: 'number', initialValue: 50 }),
        defineField({ name: 'xlargeX',  title: 'Extra Large crop X',     type: 'number', initialValue: 50 }),
      ],
      components: { input: HeroFocalPreview },
    }),

    // ── Content & Style tab ───────────────────────────────────────────────────
    // All content fields are wrapped in a single object so Sanity renders them
    // as one bordered card rather than flat individual fields.
    defineField({
      name: 'content',
      title: 'Content & Style',
      type: 'object',
      group: 'content',
      components: { input: HeroContentPreview },
      fields: [
        defineField({
          name: 'label',
          title: 'Small Label',
          description: 'Short tag shown above the heading in gold. Examples: New Drop · SS25 · Limited Edition. Leave empty to hide.',
          type: 'string',
        }),
        defineField({
          name: 'heading',
          title: 'Main Heading',
          description: 'The main slide headline. Press Enter to split across two lines. Leave empty for a clean image/video-only slide.',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'sub',
          title: 'Subheading',
          description: 'One short sentence beneath the heading. Leave empty to hide.',
          type: 'string',
        }),
        defineField({
          name: 'href',
          title: 'Button Link',
          description: 'Path the button sends the customer to — e.g. /products or /collections/men. Leave empty and no button will appear on this slide.',
          type: 'string',
        }),
        defineField({
          name: 'textPosition',
          title: 'Default Text Vertical Position',
          description: 'Fallback used when a screen-specific vertical position is empty.',
          type: 'number',
          initialValue: 85,
          components: { input: FocalYSlider },
        }),
        defineField({
          name: 'textPositionX',
          title: 'Default Text Horizontal Position',
          description: 'Fallback used when a screen-specific horizontal position is empty.',
          type: 'number',
          initialValue: 0,
          components: { input: FocalXSlider },
        }),
        defineField({ name: 'mobileTextPosition',   title: 'Small Text Vertical Position',       description: 'Phones. 0 = top · 100 = bottom.', type: 'number', components: { input: FocalYSlider } }),
        defineField({ name: 'mobileTextPositionX',  title: 'Small Text Horizontal Position',     description: 'Phones. 0 = left · 50 = centre · 100 = right.', type: 'number', components: { input: FocalXSlider } }),
        defineField({ name: 'tabletTextPosition',   title: 'Medium Text Vertical Position',      description: 'Tablets. 0 = top · 100 = bottom.', type: 'number', components: { input: FocalYSlider } }),
        defineField({ name: 'tabletTextPositionX',  title: 'Medium Text Horizontal Position',    description: 'Tablets. 0 = left · 50 = centre · 100 = right.', type: 'number', components: { input: FocalXSlider } }),
        defineField({ name: 'desktopTextPosition',  title: 'Large Text Vertical Position',       description: 'Desktop. 0 = top · 100 = bottom.', type: 'number', components: { input: FocalYSlider } }),
        defineField({ name: 'desktopTextPositionX', title: 'Large Text Horizontal Position',     description: 'Desktop. 0 = left · 50 = centre · 100 = right.', type: 'number', components: { input: FocalXSlider } }),
        defineField({ name: 'xlTextPosition',       title: 'Extra Large Text Vertical Position', description: 'Wide screens. 0 = top · 100 = bottom.', type: 'number', components: { input: FocalYSlider } }),
        defineField({ name: 'xlTextPositionX',      title: 'Extra Large Text Horizontal Position', description: 'Wide screens. 0 = left · 50 = centre · 100 = right.', type: 'number', components: { input: FocalXSlider } }),
        defineField({
          name: 'textColor',
          title: 'Text Colour',
          description: 'Heading and subheading colour. Use White on dark images, Black on light ones. The small label is always gold.',
          type: 'string',
          initialValue: 'white',
          options: {
            list: [
              { title: 'White', value: 'white' },
              { title: 'Black', value: 'black' },
            ],
            layout: 'radio',
          },
        }),
        defineField({
          name: 'buttonColor',
          title: 'Button Preset Colour',
          description: 'Quick preset for border and text. Custom colour below overrides this.',
          type: 'string',
          initialValue: 'white',
          options: {
            list: [
              { title: 'White', value: 'white' },
              { title: 'Black', value: 'black' },
              { title: 'Gold',  value: 'gold'  },
            ],
            layout: 'radio',
          },
        }),
        defineField({
          name: 'buttonCustomColor',
          title: 'Custom Button Text & Border Colour',
          description: 'Overrides the preset above. Leave empty to use the preset.',
          type: 'string',
          components: { input: ColorPickerInput },
        }),
        defineField({
          name: 'buttonBackgroundColor',
          title: 'Custom Button Background Colour',
          description: 'Optional. Leave empty for the transparent outline button style.',
          type: 'string',
          components: { input: ColorPickerInput },
        }),
      ],
    }),

    // ── Settings tab ──────────────────────────────────────────────────────────
    defineField({
      name: 'order',
      title: 'Display Order',
      description: 'Lower numbers appear first. Example: 0 = first · 1 = second · 2 = third.',
      type: 'number',
      initialValue: 0,
      group: 'settings',
    }),
    defineField({
      name: 'enabled',
      title: 'Show Slide',
      description: 'Untick to hide this slide without deleting it.',
      type: 'boolean',
      initialValue: true,
      group: 'settings',
    }),
  ],

  preview: {
    select: {
      title:    'title',
      media:    'focalPoints.imageMobile',
      hasVideo: 'focalPoints.video.asset._ref',
      order:    'order',
    },
    prepare({ title, media, hasVideo, order }) {
      return {
        title,
        media: media ?? (hasVideo ? Video : undefined),
        subtitle: typeof order === 'number' ? `Slide order: ${order}` : 'Hero slide',
      }
    },
  },
})
