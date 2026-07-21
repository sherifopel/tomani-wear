import { defineField, defineType } from 'sanity'
import { Menu } from 'lucide-react'
import { NavigationEditor } from '../components/NavigationEditor'

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: Menu,
  components: { input: NavigationEditor },
  fields: [
    // Hidden title so the Studio shows "Navigation" instead of "Untitled"
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      hidden: true,
      readOnly: true,
      initialValue: 'Navigation',
    }),
    defineField({
      name: 'links',
      title: 'Nav Links',
      description: 'Drag to reorder. Toggle "Visible" to show or hide a link.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              description: 'What the customer sees, e.g. "Men" or "Sale".',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Link URL',
              description: 'e.g. /products?category=men',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'enabled',
              title: 'Visible in nav',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'accent',
              title: 'Highlight in red (for Sale links)',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'underlineColor',
              title: 'Underline colour',
              type: 'string',
              options: {
                list: [
                  { title: 'Black',  value: 'var(--brand-black)'  },
                  { title: 'Yellow', value: 'var(--brand-yellow)' },
                  { title: 'Red',    value: 'var(--brand-red)'    },
                ],
                layout: 'radio',
              },
              initialValue: 'var(--brand-black)',
            }),
            defineField({
              name: 'children',
              title: 'Dropdown links',
              description: 'Optional sub-links that appear on hover.',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'href',
                      title: 'Link URL',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'enabled',
                      title: 'Visible',
                      type: 'boolean',
                      initialValue: true,
                    }),
                  ],
                  preview: {
                    select: { title: 'label', subtitle: 'href', enabled: 'enabled' },
                    prepare({ title, subtitle, enabled }) {
                      return {
                        title:    enabled === false ? `⊘ ${title}` : title,
                        subtitle: subtitle ?? '',
                      }
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              label:   'label',
              href:    'href',
              enabled: 'enabled',
              accent:  'accent',
            },
            prepare({ label, href, enabled, accent }) {
              const icon  = enabled === false ? '⊘' : accent ? '🔴' : '◦'
              return {
                title:    `${icon} ${label ?? 'Untitled link'}`,
                subtitle: href ?? '',
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Navigation' }
    },
  },
})
