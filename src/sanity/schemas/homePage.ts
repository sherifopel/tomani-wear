import { defineField, defineType } from 'sanity'
import { LayoutDashboard } from 'lucide-react'
import { MidBannerFocalPreview } from '../components/MidBannerFocalPreview'
import { HeroContentPreview } from '../components/HeroContentPreview'
import { FocalYSlider, FocalXSlider } from '../components/FocalYSlider'
import { ColorPickerInput } from '../components/ColorPickerInput'
import { InfoTooltipField } from '../components/InfoTooltipField'

// ── Reusable sub-fields ───────────────────────────────────────────────────────

const focalPointsFields = [
  defineField({ name: 'imageMobile',  title: 'Mobile Image',       description: 'Phones (< 768px). Portrait recommended — 9:16.',         type: 'image', options: { hotspot: true } }),
  defineField({ name: 'imageTablet',  title: 'Tablet Image',       description: 'Tablets (768px–1023px). Leave empty to reuse Mobile.',    type: 'image', options: { hotspot: true } }),
  defineField({ name: 'imageDesktop', title: 'Desktop Image',      description: 'Desktops (1024px–1279px). Leave empty to reuse Tablet.',  type: 'image', options: { hotspot: true } }),
  defineField({ name: 'imageXl',      title: 'Extra Large Image',  description: 'Wide screens (1280px+). Leave empty to reuse Desktop.',   type: 'image', options: { hotspot: true } }),
  defineField({ name: 'imageMobileCloudinaryUrl',  title: 'Mobile Cloudinary URL',  type: 'string', hidden: true, readOnly: true }),
  defineField({ name: 'imageTabletCloudinaryUrl',  title: 'Tablet Cloudinary URL',  type: 'string', hidden: true, readOnly: true }),
  defineField({ name: 'imageDesktopCloudinaryUrl', title: 'Desktop Cloudinary URL', type: 'string', hidden: true, readOnly: true }),
  defineField({ name: 'imageXlCloudinaryUrl',      title: 'XL Cloudinary URL',      type: 'string', hidden: true, readOnly: true }),
  defineField({ name: 'video',        title: 'Video — Mobile',         description: 'Portrait video for phones. Plays on loop instead of the Mobile image.',           type: 'file', options: { accept: 'video/mp4,video/webm' } }),
  defineField({ name: 'videoDesktop', title: 'Video — Tablet & Desktop', description: 'Landscape video for wider screens. Use a blur-letterbox version to show the full subject.', type: 'file', options: { accept: 'video/mp4,video/webm' } }),
  defineField({ name: 'videoCloudinaryUrl',        title: 'Video Cloudinary URL',         type: 'string', hidden: true, readOnly: true }),
  defineField({ name: 'videoDesktopCloudinaryUrl', title: 'Video Desktop Cloudinary URL', type: 'string', hidden: true, readOnly: true }),
  defineField({ name: 'mobile',   title: 'Mobile focal Y',   type: 'number', initialValue: 50 }),
  defineField({ name: 'tablet',   title: 'Tablet focal Y',   type: 'number', initialValue: 50 }),
  defineField({ name: 'desktop',  title: 'Desktop focal Y',  type: 'number', initialValue: 30 }),
  defineField({ name: 'xlarge',   title: 'XL focal Y',       type: 'number', initialValue: 30 }),
  defineField({ name: 'mobileX',  title: 'Mobile focal X',   type: 'number', initialValue: 50 }),
  defineField({ name: 'tabletX',  title: 'Tablet focal X',   type: 'number', initialValue: 50 }),
  defineField({ name: 'desktopX', title: 'Desktop focal X',  type: 'number', initialValue: 50 }),
  defineField({ name: 'xlargeX',  title: 'XL focal X',       type: 'number', initialValue: 50 }),
]

const contentFields = [
  defineField({ name: 'label',   title: 'Small Label',   description: 'Short tag above heading in gold. Leave empty to hide.', type: 'string' }),
  defineField({ name: 'heading', title: 'Main Heading',  description: 'Press Enter to split across two lines.',                type: 'text', rows: 2 }),
  defineField({ name: 'sub',     title: 'Subheading',    description: 'One short sentence beneath the heading.',               type: 'string' }),
  defineField({ name: 'ctaLabel', title: 'Button Label', description: 'Text on the button. Leave empty to hide the button.',  type: 'string', initialValue: 'Shop Now' }),
  defineField({ name: 'href',    title: 'Button Link',   description: 'e.g. /products or /products?category=men',             type: 'string' }),
  defineField({ name: 'textPosition',  title: 'Default Text Vertical Position',   type: 'number', initialValue: 85, components: { input: FocalYSlider } }),
  defineField({ name: 'textPositionX', title: 'Default Text Horizontal Position', type: 'number', initialValue: 0,  components: { input: FocalXSlider } }),
  defineField({ name: 'mobileTextPosition',   title: 'Mobile Text Vertical Position',   type: 'number', components: { input: FocalYSlider } }),
  defineField({ name: 'mobileTextPositionX',  title: 'Mobile Text Horizontal Position', type: 'number', components: { input: FocalXSlider } }),
  defineField({ name: 'tabletTextPosition',   title: 'Tablet Text Vertical Position',   type: 'number', components: { input: FocalYSlider } }),
  defineField({ name: 'tabletTextPositionX',  title: 'Tablet Text Horizontal Position', type: 'number', components: { input: FocalXSlider } }),
  defineField({ name: 'desktopTextPosition',  title: 'Desktop Text Vertical Position',  type: 'number', components: { input: FocalYSlider } }),
  defineField({ name: 'desktopTextPositionX', title: 'Desktop Text Horizontal Position',type: 'number', components: { input: FocalXSlider } }),
  defineField({ name: 'xlTextPosition',       title: 'XL Text Vertical Position',       type: 'number', components: { input: FocalYSlider } }),
  defineField({ name: 'xlTextPositionX',      title: 'XL Text Horizontal Position',     type: 'number', components: { input: FocalXSlider } }),
  defineField({
    name: 'textColor', title: 'Text Colour Preset', type: 'string', initialValue: 'white',
    options: { list: [{ title: 'White', value: 'white' }, { title: 'Black', value: 'black' }], layout: 'radio' },
  }),
  defineField({ name: 'textCustomColor', title: 'Custom Text Colour', description: 'Overrides the preset above. Leave empty to use White or Black.', type: 'string', components: { input: ColorPickerInput } }),
  defineField({
    name: 'buttonColor', title: 'Button Preset Colour', type: 'string', initialValue: 'white',
    options: { list: [{ title: 'White', value: 'white' }, { title: 'Black', value: 'black' }, { title: 'Gold', value: 'gold' }], layout: 'radio' },
  }),
  defineField({ name: 'buttonCustomColor',     title: 'Custom Button Text & Border Colour', type: 'string', components: { input: ColorPickerInput } }),
  defineField({ name: 'buttonBackgroundColor', title: 'Custom Button Background Colour',    type: 'string', components: { input: ColorPickerInput } }),
]

// ── Schema ────────────────────────────────────────────────────────────────────

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: LayoutDashboard,
  fields: [
    defineField({
      name: 'title',
      title: 'Document Title',
      type: 'string',
      hidden: true,
      readOnly: true,
      initialValue: 'Home Page',
    }),

    defineField({
      name: 'sections',
      title: 'Page Sections',
      description: 'Stack as many Hero + Carousel sections as you like. Drag to reorder.',
      type: 'array',
      of: [{
        type: 'object',
        name: 'homeSection',
        title: 'Section',
        groups: [
          { name: 'hero',     title: 'Hero Image',       default: true },
          { name: 'content',  title: 'Content & Style'                 },
          { name: 'carousel', title: 'Carousel'                        },
          { name: 'settings', title: 'Settings'                        },
        ],
        fields: [
          // Internal label — shown in the section list
          defineField({
            name: 'title',
            title: 'Section Label',
            description: 'Internal name — only visible in Sanity. Example: "New Arrivals", "Men\'s Drop".',
            type: 'string',
            validation: Rule => Rule.required(),
          }),

          // ── Hero images tab ──────────────────────────────────────────────
          defineField({
            name: 'focalPoints',
            title: 'Device Images & Crop',
            description: 'Upload one image per device. Adjust focal point to control what stays in frame.',
            type: 'object',
            group: 'hero',
            components: { input: MidBannerFocalPreview },
            fields: focalPointsFields,
          }),

          // ── Hero height controls ─────────────────────────────────────────
          defineField({
            name: 'heights',
            title: 'Banner Size & Fit',
            description: 'How tall the banner is and how the image fills it.',
            type: 'object',
            group: 'hero',
            fields: [
              defineField({
                name: 'height',
                title: 'Height (vh)',
                description: 'How tall the banner is as a percentage of the screen height. 80 = 80% of the screen.',
                type: 'number',
                initialValue: 80,
                validation: Rule => Rule.min(20).max(100),
              }),
              defineField({
                name: 'fit',
                title: 'Image Fit',
                description: 'Cover fills the banner and crops the edges. Contain shows the full image with black bars if needed.',
                type: 'string',
                initialValue: 'cover',
                options: {
                  list: [
                    { title: 'Cover — fill banner, crop edges',  value: 'cover'   },
                    { title: 'Contain — show full image',         value: 'contain' },
                  ],
                  layout: 'radio',
                },
              }),
            ],
          }),

          // ── Content & Style tab ──────────────────────────────────────────
          defineField({
            name: 'content',
            title: 'Content & Style',
            type: 'object',
            group: 'content',
            components: { input: HeroContentPreview },
            fields: contentFields,
          }),

          // ── Carousel tab ─────────────────────────────────────────────────
          defineField({
            name: 'carousel',
            title: 'Carousel',
            type: 'object',
            group: 'carousel',
            fields: [
              defineField({
                name: 'title',
                title: 'Carousel Heading',
                description: 'Displayed above the product carousel. e.g. "Men\'s Collection".',
                type: 'string',
              }),
              defineField({
                name: 'viewAllLink',
                title: 'View All Link',
                description: 'Where the "View All" button goes. e.g. /products?category=men',
                type: 'string',
              }),
              defineField({
                name: 'style',
                title: 'Carousel Style',
                description: 'Scroll = horizontal strip. Grid = 4-up image tiles.',
                type: 'string',
                initialValue: 'scroll',
                options: {
                  list: [
                    { title: 'Scroll strip (horizontal)', value: 'scroll' },
                    { title: 'Grid showcase (4 tiles)',   value: 'grid'   },
                  ],
                  layout: 'radio',
                },
              }),
              defineField({
                name: 'filter',
                title: 'Products to Show',
                description: 'Pick a category. Ignored if "Filter by Tag" is filled in below.',
                type: 'string',
                initialValue: 'new',
                options: {
                  list: [
                    { title: 'New In',        value: 'new'          },
                    { title: 'Men',           value: 'men'          },
                    { title: 'Women',         value: 'women'        },
                    { title: 'Accessories',   value: 'accessories'  },
                    { title: 'Sale',          value: 'sale'         },
                    { title: 'All Products',  value: 'all'          },
                  ],
                  layout: 'radio',
                },
              }),
              // Sub-category radios — only one appears at a time based on the filter above
              defineField({
                name: 'filterMenType',
                title: 'Men\'s Type',
                description: 'Pick a specific type, or leave on "All" to show every Men\'s product.',
                type: 'string',
                initialValue: '',
                hidden: ({ parent }) => (parent as { filter?: string })?.filter !== 'men',
                options: {
                  layout: 'radio',
                  list: [
                    { title: '— All Men\'s products —', value: ''         },
                    { title: 'Hoodies',                 value: 'hoodies'  },
                    { title: 'Jackets',                 value: 'jackets'  },
                    { title: 'Joggers',                 value: 'joggers'  },
                    { title: 'Shirts',                  value: 'shirts'   },
                    { title: 'Shorts',                  value: 'shorts'   },
                    { title: 'Trousers',                value: 'trousers' },
                  ],
                },
              }),
              defineField({
                name: 'filterWomenType',
                title: 'Women\'s Type',
                description: 'Pick a specific type, or leave on "All" to show every Women\'s product.',
                type: 'string',
                initialValue: '',
                hidden: ({ parent }) => (parent as { filter?: string })?.filter !== 'women',
                options: {
                  layout: 'radio',
                  list: [
                    { title: '— All Women\'s products —', value: ''         },
                    { title: 'Dresses',                   value: 'dresses'  },
                    { title: 'Jackets',                   value: 'jackets'  },
                    { title: 'Joggers',                   value: 'joggers'  },
                    { title: 'Shorts',                    value: 'shorts'   },
                    { title: 'Tops',                      value: 'tops'     },
                    { title: 'Trousers',                  value: 'trousers' },
                  ],
                },
              }),
              defineField({
                name: 'filterAccessoriesType',
                title: 'Accessories Type',
                description: 'Pick a specific type, or leave on "All" to show every Accessory.',
                type: 'string',
                initialValue: '',
                hidden: ({ parent }) => (parent as { filter?: string })?.filter !== 'accessories',
                options: {
                  layout: 'radio',
                  list: [
                    { title: '— All Accessories —', value: ''      },
                    { title: 'Bags',                value: 'bags'  },
                    { title: 'Belts',               value: 'belts' },
                    { title: 'Boots',               value: 'boots' },
                    { title: 'Hats',                value: 'hats'  },
                    { title: 'Shoes',               value: 'shoes' },
                  ],
                },
              }),
              defineField({
                name: 'filterTag',
                title: 'Filter by Tag',
                description: 'ℹ Overrides "Products to Show" and Type above — shows only products tagged with this value. e.g. lookbook or summer-2025. Tag products first from the Products section.',
                type: 'string',
                components: { field: InfoTooltipField },
              }),
              defineField({
                name: 'limit',
                title: 'Max Products',
                description: 'Maximum number of products to show (default 8).',
                type: 'number',
                initialValue: 8,
                validation: Rule => Rule.min(2).max(20),
              }),
            ],
          }),

          // ── Settings tab ─────────────────────────────────────────────────
          defineField({
            name: 'enabled',
            title: 'Show Section',
            description: 'Untick to hide this section without deleting it.',
            type: 'boolean',
            initialValue: true,
            group: 'settings',
          }),
          defineField({
            name: 'audio',
            title: 'Background Audio',
            description: 'Optional ambient sound or music that plays with this hero. Starts muted — visitor can click the 🔇 button to unmute. MP3 recommended.',
            type: 'file',
            options: { accept: 'audio/mp3,audio/mpeg,audio/wav,audio/ogg,audio/aac' },
            group: 'settings',
          }),
          defineField({
            name: 'audioStart',
            title: 'Start At (seconds)',
            description: 'Where in the track to begin. 0 = from the very start. 30 = skip to the 30-second mark.',
            type: 'number',
            initialValue: 0,
            hidden: ({ parent }) => !((parent as { audio?: unknown })?.audio),
            group: 'settings',
          }),
          defineField({
            name: 'audioSnippetLength',
            title: 'How Long to Play',
            type: 'string',
            initialValue: '60',
            options: {
              layout: 'radio',
              list: [
                { title: '30 seconds', value: '30'   },
                { title: '1 minute',   value: '60'   },
                { title: '2 minutes',  value: '120'  },
                { title: 'Full song',  value: 'full' },
              ],
            },
            hidden: ({ parent }) => !((parent as { audio?: unknown })?.audio),
            group: 'settings',
          }),
          defineField({
            name: 'audioRepeat',
            title: 'Repeat',
            type: 'string',
            initialValue: 'loop',
            options: {
              layout: 'radio',
              list: [
                { title: 'Loop — replay after a 30 second pause (hero must still be on screen)', value: 'loop' },
                { title: 'Play once — stops after the first play',                               value: 'once' },
              ],
            },
            hidden: ({ parent }) => !((parent as { audio?: unknown })?.audio),
            group: 'settings',
          }),
        ],

        preview: {
          select: {
            title:  'title',
            style:  'carousel.style',
            filter: 'carousel.filter',
            media:  'focalPoints.imageMobile',
          },
          prepare({ title, style, filter, media }) {
            const styleLabel  = style  === 'grid'     ? 'Grid'   : 'Scroll'
            const filterLabel = filter === 'new'       ? 'New Arrivals'
                              : filter === 'featured'  ? 'Featured'
                              : filter === 'men'       ? 'Men'
                              : filter === 'women'     ? 'Women'
                              : filter === 'sale'      ? 'Sale'
                              : filter === 'all'       ? 'All'
                              : filter ?? 'Products'
            return {
              title,
              media,
              subtitle: `${styleLabel} · ${filterLabel}`,
            }
          },
        },
      }],
    }),
  ],

  preview: {
    select: { title: 'title' },
    prepare() {
      return { title: 'Home Page' }
    },
  },
})
