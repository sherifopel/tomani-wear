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
    defineField({
      name: 'heroAutoplay',
      title: 'Hero Autoplay',
      description: 'Automatically rotate through hero slides.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'heroShowArrows',
      title: 'Show Hero Arrows',
      description: 'Show previous and next controls on the hero carousel.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'heroDesktopRatio',
      title: 'Hero Desktop Aspect Ratio',
      description: 'Controls how tall the hero banner is on desktop. Wider = shorter, taller = more portrait. All slides share the same ratio.',
      type: 'string',
      initialValue: '1505/600',
      options: {
        list: [
          { title: 'Cinematic (21:9) — very wide, short band', value: '21/9' },
          { title: 'Widescreen (16:9) — standard TV ratio', value: '16/9' },
          { title: 'Brand (5:2) — current Tomanni ratio', value: '1505/600' },
          { title: 'Classic photo (3:2)', value: '3/2' },
          { title: 'Square-ish (4:3)', value: '4/3' },
        ],
        layout: 'radio',
      },
    }),
  ],
})
