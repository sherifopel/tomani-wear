import { defineField, defineType } from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'announcementBar',
      title: 'Announcement Bar Text',
      type: 'string',
      description: 'Fallback text shown if no rotating messages are added',
    }),
    defineField({
      name: 'announcementBars',
      title: 'Rotating Announcement Messages',
      type: 'array',
      description: 'Add two or more messages to rotate through the black bar',
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
    }),
  ],
})
