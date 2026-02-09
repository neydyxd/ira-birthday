import type { CollectionConfig } from 'payload'

export const Congratulations: CollectionConfig = {
  slug: 'congratulations',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'message', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'authorName',
      type: 'text',
      required: true,
      label: 'Имя',
      maxLength: 100,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Поздравление',
      maxLength: 1000,
    },
  ],
  timestamps: true,
}
