import { defineField, defineType } from 'sanity'
import { Settings2 } from 'lucide-react'
import { AnnouncementPreview } from '../components/AnnouncementPreview'
import { AnnouncementBannersInput } from '../components/AnnouncementBannersInput'

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
      title: 'Announcement Banners',
      type: 'array',
      description: 'Each banner rotates in turn. Max 3.',
      group: 'announcement',
      components: { input: AnnouncementBannersInput },
      validation: (Rule) => Rule.max(3),
      of: [
        {
          type: 'object',
          title: 'Banner',
          fields: [
            defineField({
              name: 'message',
              title: 'Message',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'theme',
              title: 'Colour',
              type: 'string',
              initialValue: 'black-white',
              options: {
                layout: 'radio',
                direction: 'horizontal',
                list: [
                  { title: 'Black & White', value: 'black-white' },
                  { title: 'Light Grey & Red', value: 'grey-red' },
                ],
              },
            }),
          ],
          preview: {
            select: { title: 'message', theme: 'theme' },
            prepare({ title, theme }) {
              return {
                title:    title ?? 'Untitled banner',
                subtitle: theme === 'grey-red' ? 'Grey & Red' : 'Black & White',
              }
            },
          },
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
