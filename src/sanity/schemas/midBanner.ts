import { defineField, defineType } from 'sanity'
import { LayoutPanelTop } from 'lucide-react'
import { MidBannerFocalPreview } from '../components/MidBannerFocalPreview'
import { HeroContentPreview } from '../components/HeroContentPreview'
import { FocalYSlider, FocalXSlider } from '../components/FocalYSlider'
import { ColorPickerInput } from '../components/ColorPickerInput'

export const midBanner = defineType({
  name: 'midBanner',
  title: 'Mid Banner',
  type: 'document',
  icon: LayoutPanelTop,
  groups: [
    { name: 'images',  title: 'Images',          default: true },
    { name: 'content', title: 'Content & Style'               },
  ],
  fields: [
    // ── Images & Video ────────────────────────────────────────────────────────
    defineField({
      name: 'focalPoints',
      title: 'Device Images & Crop Preview',
      description: 'Upload one image per device and adjust the crop position for each. Or upload a video to replace still images.',
      type: 'object',
      group: 'images',
      components: { input: MidBannerFocalPreview },
      fields: [
        defineField({
          name: 'imageMobile',
          title: 'Mobile Image',
          description: 'Shown on phones (below 768px). Portrait recommended.',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'imageTablet',
          title: 'Tablet Image',
          description: 'Shown on tablets (768px – 1023px). Leave empty to reuse Mobile.',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'imageDesktop',
          title: 'Desktop Image',
          description: 'Shown on desktops (1024px – 1279px). Leave empty to reuse Tablet.',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'imageXl',
          title: 'Extra Large Image',
          description: 'Shown on large screens (1280px+). Leave empty to reuse Desktop.',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'video',
          title: 'Banner Video',
          description: 'Optional. Upload an MP4 or WebM. When set, the video plays on loop instead of the still images.',
          type: 'file',
          options: { accept: 'video/mp4,video/webm' },
        }),
        defineField({ name: 'mobile',   title: 'Mobile crop Y',      type: 'number', initialValue: 50 }),
        defineField({ name: 'tablet',   title: 'Tablet crop Y',      type: 'number', initialValue: 50 }),
        defineField({ name: 'desktop',  title: 'Desktop crop Y',     type: 'number', initialValue: 30 }),
        defineField({ name: 'xlarge',   title: 'Extra Large crop Y', type: 'number', initialValue: 30 }),
        defineField({ name: 'mobileX',  title: 'Mobile crop X',      type: 'number', initialValue: 50 }),
        defineField({ name: 'tabletX',  title: 'Tablet crop X',      type: 'number', initialValue: 50 }),
        defineField({ name: 'desktopX', title: 'Desktop crop X',     type: 'number', initialValue: 50 }),
        defineField({ name: 'xlargeX',  title: 'Extra Large crop X', type: 'number', initialValue: 50 }),
      ],
    }),

    // ── Content & Style ───────────────────────────────────────────────────────
    defineField({
      name: 'content',
      title: 'Content & Style',
      description: 'Optional overlay text and button on the banner.',
      type: 'object',
      group: 'content',
      components: { input: HeroContentPreview },
      fields: [
        defineField({
          name: 'label',
          title: 'Small Label',
          description: 'Short tag shown above the heading in gold. Leave empty to hide.',
          type: 'string',
        }),
        defineField({
          name: 'heading',
          title: 'Main Heading',
          description: 'Main headline. Leave empty for a clean image/video-only banner.',
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
          description: 'Path the button sends the customer to. Leave empty and no button will appear.',
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
        defineField({ name: 'mobileTextPosition',   title: 'Small Text Vertical Position',         description: 'Phones. 0 = top · 100 = bottom.',                        type: 'number', components: { input: FocalYSlider } }),
        defineField({ name: 'mobileTextPositionX',  title: 'Small Text Horizontal Position',       description: 'Phones. 0 = left · 50 = centre · 100 = right.',          type: 'number', components: { input: FocalXSlider } }),
        defineField({ name: 'tabletTextPosition',   title: 'Medium Text Vertical Position',        description: 'Tablets. 0 = top · 100 = bottom.',                       type: 'number', components: { input: FocalYSlider } }),
        defineField({ name: 'tabletTextPositionX',  title: 'Medium Text Horizontal Position',      description: 'Tablets. 0 = left · 50 = centre · 100 = right.',         type: 'number', components: { input: FocalXSlider } }),
        defineField({ name: 'desktopTextPosition',  title: 'Large Text Vertical Position',         description: 'Desktop. 0 = top · 100 = bottom.',                       type: 'number', components: { input: FocalYSlider } }),
        defineField({ name: 'desktopTextPositionX', title: 'Large Text Horizontal Position',       description: 'Desktop. 0 = left · 50 = centre · 100 = right.',         type: 'number', components: { input: FocalXSlider } }),
        defineField({ name: 'xlTextPosition',       title: 'Extra Large Text Vertical Position',   description: 'Wide screens. 0 = top · 100 = bottom.',                  type: 'number', components: { input: FocalYSlider } }),
        defineField({ name: 'xlTextPositionX',      title: 'Extra Large Text Horizontal Position', description: 'Wide screens. 0 = left · 50 = centre · 100 = right.',    type: 'number', components: { input: FocalXSlider } }),
        defineField({
          name: 'textColor',
          title: 'Text Colour',
          description: 'Heading and subheading colour. Use White on dark images, Black on light ones.',
          type: 'string',
          initialValue: 'white',
          options: { list: [{ title: 'White', value: 'white' }, { title: 'Black', value: 'black' }], layout: 'radio' },
        }),
        defineField({
          name: 'buttonColor',
          title: 'Button Preset Colour',
          description: 'Quick preset for border and text. Custom colour below overrides this.',
          type: 'string',
          initialValue: 'white',
          options: { list: [{ title: 'White', value: 'white' }, { title: 'Black', value: 'black' }, { title: 'Gold', value: 'gold' }], layout: 'radio' },
        }),
        defineField({ name: 'buttonCustomColor',     title: 'Custom Button Text & Border Colour', description: 'Overrides the preset above. Leave empty to use the preset.', type: 'string', components: { input: ColorPickerInput } }),
        defineField({ name: 'buttonBackgroundColor', title: 'Custom Button Background Colour',     description: 'Optional. Leave empty for the transparent outline button style.', type: 'string', components: { input: ColorPickerInput } }),
      ],
    }),
  ],

  preview: {
    select: {
      media:    'focalPoints.imageMobile',
      hasVideo: 'focalPoints.video.asset._ref',
      heading:  'content.heading',
    },
    prepare({ media, hasVideo, heading }) {
      return {
        title:    'Mid Banner',
        subtitle: heading ?? 'No heading set',
        media,
      }
    },
  },
})
