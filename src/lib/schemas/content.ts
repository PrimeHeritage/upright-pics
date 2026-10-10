import { z } from 'zod'

import { imageAssetSchema } from './common'
import { parseVideoUrl } from '@/lib/media'

const text = (max: number, label = 'This field') =>
  z.string().trim().min(1, `${label} cannot be empty`).max(max, `Keep it under ${max} characters`)
const optionalText = (max: number) => z.string().trim().max(max, `Keep it under ${max} characters`)

export const heroSchema = z.object({
  headline: text(40, 'Headline'),
  headlineEmphasis: optionalText(30),
  subheadline: text(160, 'Subheadline'),
  primaryCta: text(24, 'Button text'),
  secondaryCta: text(24, 'Button text'),
  slides: z.array(imageAssetSchema).min(1, 'Add at least one photo').max(8),
})

export const introSchema = z.object({
  statement: text(200, 'Statement'),
  body: optionalText(400),
  image: imageAssetSchema.nullable(),
})

export const processSchema = z.object({
  heading: text(60, 'Heading'),
  intro: optionalText(200),
  steps: z
    .array(z.object({ title: text(30, 'Step title'), body: text(200, 'Step text'), image: imageAssetSchema }))
    .min(2, 'Keep at least two steps')
    .max(6),
})

export const showreelSchema = z.object({
  heading: text(50, 'Heading'),
  caption: optionalText(160),
  videoUrl: z
    .string()
    .trim()
    .max(300)
    .refine((v) => v === '' || parseVideoUrl(v) !== null, 'Paste a YouTube or Vimeo link'),
  poster: imageAssetSchema,
})

export const ctaSchema = z.object({
  heading: text(60, 'Heading'),
  body: optionalText(200),
  image: imageAssetSchema.nullable(),
})

export const aboutSchema = z.object({
  heading: text(60, 'Heading'),
  lead: text(240, 'Introduction'),
  story: z.array(text(700, 'Paragraph')).min(1).max(6),
  portrait: imageAssetSchema,
  secondaryImage: imageAssetSchema.nullable(),
  stats: z.array(z.object({ value: text(16, 'Value'), label: text(60, 'Label') })).max(4),
  values: z.array(z.object({ title: text(40, 'Title'), body: text(200, 'Text') })).max(4),
})

export const contactSchema = z.object({
  heading: text(40, 'Heading'),
  body: text(240, 'Text'),
  responseNote: optionalText(160),
})

export const pageHeaderSchema = z.object({
  heading: text(40, 'Heading'),
  body: optionalText(200),
})

/** Every editable section, keyed as `${page}.${section}` (matches page_content rows). */
export const contentSchemas = {
  'home.hero': heroSchema,
  'home.intro': introSchema,
  'home.process': processSchema,
  'home.showreel': showreelSchema,
  'home.cta': ctaSchema,
  'about.main': aboutSchema,
  'contact.main': contactSchema,
  'work.header': pageHeaderSchema,
  'services.header': pageHeaderSchema,
} as const

export type ContentKey = keyof typeof contentSchemas

export const contentKeys = Object.keys(contentSchemas) as Array<ContentKey>

export const updateContentSchema = z.discriminatedUnion('key', [
  z.object({ key: z.literal('home.hero'), data: heroSchema }),
  z.object({ key: z.literal('home.intro'), data: introSchema }),
  z.object({ key: z.literal('home.process'), data: processSchema }),
  z.object({ key: z.literal('home.showreel'), data: showreelSchema }),
  z.object({ key: z.literal('home.cta'), data: ctaSchema }),
  z.object({ key: z.literal('about.main'), data: aboutSchema }),
  z.object({ key: z.literal('contact.main'), data: contactSchema }),
  z.object({ key: z.literal('work.header'), data: pageHeaderSchema }),
  z.object({ key: z.literal('services.header'), data: pageHeaderSchema }),
])

export type UpdateContentInput = z.infer<typeof updateContentSchema>
