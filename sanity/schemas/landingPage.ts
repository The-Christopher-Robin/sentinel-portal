import { defineField, defineType } from 'sanity'

export const landingPage = defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'subtitle', type: 'text', rows: 3 }),
    defineField({
      name: 'ctaLabel',
      type: 'string',
      initialValue: 'Start free scan',
    }),
    defineField({ name: 'ctaHref', type: 'url' }),
    defineField({
      name: 'sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'featureSection',
          fields: [
            { name: 'heading', type: 'string' },
            { name: 'body', type: 'text' },
            {
              name: 'bullets',
              type: 'array',
              of: [{ type: 'string' }],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'seo',
      type: 'object',
      fields: [
        { name: 'metaTitle', type: 'string' },
        { name: 'metaDescription', type: 'text' },
      ],
    }),
  ],
})
