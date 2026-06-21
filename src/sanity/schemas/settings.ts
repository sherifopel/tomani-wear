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
      description: 'The text shown in the black bar at the top of every page',
    }),
    defineField({
      name: 'announcementBarEnabled',
      title: 'Show Announcement Bar',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})
