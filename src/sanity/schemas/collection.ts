import { defineField, defineType } from 'sanity'
import { Tag } from 'lucide-react'

export const collection = defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  icon: Tag,
  fields: [
    defineField({
      name: 'name',
      title: 'Collection Name',
      type: 'string',
      description: 'e.g. Summer Collection 2025',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Used in the URL — e.g. summer-2025 → /products?collection=summer-2025',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'slug.current' },
    prepare({ title, subtitle }) {
      return { title: title ?? 'Untitled', subtitle: subtitle ? `/${subtitle}` : '' }
    },
  },
})
