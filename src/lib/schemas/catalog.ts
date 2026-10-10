import { z } from 'zod'

import { imageAssetSchema } from './common'

const slug = z
  .string()
  .trim()
  .min(2, 'Enter a short web address')
  .max(60)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and dashes only')

const id = z.uuid()

export const categorySchema = z.object({
  name: z.string().trim().min(2, 'Enter a name').max(40),
  slug,
  description: z.string().trim().max(200),
})

export const serviceSchema = z.object({
  title: z.string().trim().min(2, 'Enter a title').max(60),
  slug,
  summary: z.string().trim().min(10, 'Add a one-line summary').max(160),
  body: z.string().trim().max(600),
  cover: imageAssetSchema.nullable(),
  visible: z.boolean(),
})

export const packageSchema = z.object({
  name: z.string().trim().min(2, 'Enter a name').max(60),
  serviceId: z.union([z.literal(''), id]),
  description: z.string().trim().max(160),
  priceLabel: z.string().trim().max(40),
  features: z.array(z.string().trim().min(1, 'Remove empty lines').max(80)).max(8),
  highlighted: z.boolean(),
  visible: z.boolean(),
})

export const testimonialSchema = z.object({
  clientName: z.string().trim().min(2, 'Enter the client name').max(60),
  context: z.string().trim().max(80),
  quote: z.string().trim().min(10, 'Add the quote').max(300, 'Keep quotes short: under 300 characters'),
  visible: z.boolean(),
})

export const categoryUpdateSchema = categorySchema.extend({ id })
export const serviceUpdateSchema = serviceSchema.extend({ id })
export const packageUpdateSchema = packageSchema.extend({ id })
export const testimonialUpdateSchema = testimonialSchema.extend({ id })
export const idOnly = z.object({ id })
export const reorderSchema = z.object({ ids: z.array(id).min(1).max(200) })
export const visibilitySchema = z.object({ id, visible: z.boolean() })

export type CategoryInput = z.infer<typeof categorySchema>
export type ServiceInput = z.infer<typeof serviceSchema>
export type PackageInput = z.infer<typeof packageSchema>
export type TestimonialInput = z.infer<typeof testimonialSchema>
