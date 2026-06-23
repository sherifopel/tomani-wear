import { defineField, defineType } from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  groups: [
    { name: 'announcement', title: 'Announcement' },
    { name: 'hero', title: 'Hero' },
    { name: 'footer', title: 'Footer' },
  ],
  fields: [
    defineField({
      name: 'announcementBar',
      title: 'Announcement Bar Text',
      type: 'string',
      description: 'Fallback text shown if no rotating messages are added',
      group: 'announcement',
    }),
    defineField({
      name: 'announcementBars',
      title: 'Rotating Announcement Messages',
      type: 'array',
      description: 'Add two or more messages to rotate through the black bar',
      group: 'announcement',
      of: [
        {
          type: 'string',
          title: 'Message',
        },
      ],
    }),
    defineField({
      name: 'announcementBarEnabled',
      title: 'Show Announcement Bar',
      type: 'boolean',
      initialValue: true,
      group: 'announcement',
    }),
    defineField({
      name: 'heroAutoplay',
      title: 'Hero Autoplay',
      description: 'Automatically rotate through hero slides.',
      type: 'boolean',
      initialValue: true,
      group: 'hero',
    }),
    defineField({
      name: 'heroShowArrows',
      title: 'Show Hero Arrows',
      description: 'Show previous and next controls on the hero carousel.',
      type: 'boolean',
      initialValue: false,
      group: 'hero',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL (legacy)',
      description: 'Old single Instagram field. Prefer Social Links below.',
      type: 'url',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
      group: 'footer',
      hidden: ({ document }) => Boolean(document?.socialLinks),
    }),
    defineField({
      name: 'footerLinks',
      title: 'Footer Site Links',
      description: 'Optional links shown in the footer, such as Contact, Shipping, Returns, or Size Guide.',
      type: 'array',
      group: 'footer',
      of: [
        {
          type: 'object',
          title: 'Footer Link',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Link',
              type: 'string',
              description: 'Use a site path like /products or a full URL like https://example.com.',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'href',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      description: 'Add Tomanni Wear social accounts. Examples: Instagram, TikTok, WhatsApp, Pinterest.',
      type: 'array',
      group: 'footer',
      of: [
        {
          type: 'object',
          title: 'Social Link',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                layout: 'dropdown',
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'TikTok', value: 'tiktok' },
                  { title: 'WhatsApp', value: 'whatsapp' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'Pinterest', value: 'pinterest' },
                  { title: 'X / Twitter', value: 'x' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'Other', value: 'other' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
            }),
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url',
            },
          },
        },
      ],
    }),
  ],
})
