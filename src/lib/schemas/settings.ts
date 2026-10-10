import { z } from 'zod'

import { imageAssetSchema, optionalUrl, phoneSchema } from './common'

export const settingsSchema = z.object({
  businessName: z.string().trim().min(2, 'Enter the business name').max(80),
  shortName: z.string().trim().max(12),
  tagline: z.string().trim().max(120),
  logo: imageAssetSchema.nullable(),
  email: z.union([z.literal(''), z.email('That email address looks incomplete').max(120)]),
  phones: z.array(phoneSchema).max(3),
  whatsapp: phoneSchema,
  location: z.string().trim().max(80),
  socials: z.object({
    instagram: optionalUrl,
    tiktok: optionalUrl,
    youtube: optionalUrl,
    x: optionalUrl,
    facebook: optionalUrl,
  }),
  footerNote: z.string().trim().max(160),
  showPackages: z.boolean(),
  showPrices: z.boolean(),
  showTestimonials: z.boolean(),
  seo: z.object({
    title: z.string().trim().max(70, 'Keep it under 70 characters so Google shows it in full'),
    description: z.string().trim().max(170, 'Keep it under 170 characters'),
    image: imageAssetSchema.nullable(),
  }),
})

export type SettingsInput = z.infer<typeof settingsSchema>
