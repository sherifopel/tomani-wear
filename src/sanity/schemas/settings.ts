import { defineField, defineType } from 'sanity'
import { Settings2 } from 'lucide-react'
import { AnnouncementPreview } from '../components/AnnouncementPreview'

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: Settings2,
  groups: [
    { name: 'announcement', title: 'Announcement' },
    { name: 'footer', title: 'Footer' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Document Title',
      type: 'string',
      hidden: true,
      readOnly: true,
      initialValue: 'Settings',
    }),
    defineField({
      name: 'announcementPreview',
      title: 'Banner Preview',
      type: 'string',
      group: 'announcement',
      components: { input: AnnouncementPreview },
    }),
    defineField({
      name: 'announcementBars',
      title: 'Rotating Announcement Messages',
      type: 'array',
      description: 'Add two or more messages to rotate through the bar above',
      group: 'announcement',
      of: [{ type: 'string', title: 'Message' }],
    }),
    defineField({
      name: 'announcementBarBgColor',
      title: 'Banner Background Colour',
      description: 'Defaults to black if not set.',
      type: 'string',
      group: 'announcement',
      options: {
        layout: 'radio',
        direction: 'horizontal',
        list: [
          { title: 'Black', value: '#000000' },
          { title: 'White', value: '#ffffff' },
          { title: 'Grey',  value: '#6b7280' },
          { title: 'Red',   value: '#E8000D' },
        ],
      },
    }),
    defineField({
      name: 'announcementBarTextColor',
      title: 'Banner Text Colour',
      description: 'Defaults to white if not set.',
      type: 'string',
      group: 'announcement',
      options: {
        layout: 'radio',
        direction: 'horizontal',
        list: [
          { title: 'Black', value: '#000000' },
          { title: 'White', value: '#ffffff' },
          { title: 'Grey',  value: '#6b7280' },
          { title: 'Red',   value: '#E8000D' },
        ],
      },
    }),
    defineField({
      name: 'announcementBarEnabled',
      title: 'Show Announcement Bar',
      type: 'boolean',
      initialValue: true,
      group: 'announcement',
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
  preview: {
    select: { id: '_id' },
    prepare() {
      return { title: 'Settings' }
    },
  },
})
