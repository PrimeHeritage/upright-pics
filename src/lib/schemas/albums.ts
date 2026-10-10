import { z } from 'zod'

import { imageAssetSchema } from './common'
import { parseVideoUrl } from '@/lib/media'

const id = z.uuid()

export const createAlbumSchema = z.object({
  title: z.string().trim().min(2, 'Give the album a title').max(80),
  categoryId: z.union([z.literal(''), id]),
})

export const albumDetailsSchema = z.object({
  id,
  title: z.string().trim().min(2, 'Give the album a title').max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and dashes only'),
  categoryId: z.union([z.literal(''), id]),
  summary: z.string().trim().max(240),
  story: z.string().trim().max(1200),
  location: z.string().trim().max(80),
  shotOn: z.union([z.literal(''), z.iso.date()]),
})

export const albumFlagsSchema = z.object({
  id,
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
})

export const addPhotosSchema = z.object({ albumId: id, images: z.array(imageAssetSchema).min(1).max(100) })

export const addVideoSchema = z.object({
  albumId: id,
  url: z
    .string()
    .trim()
    .max(300)
    .refine((v) => parseVideoUrl(v) !== null, 'Paste a YouTube or Vimeo link'),
  caption: z.string().trim().max(160),
})

export const updateMediaSchema = z.object({
  id,
  caption: z.string().trim().max(160),
  alt: z.string().trim().max(200),
})

export const reorderMediaSchema = z.object({ albumId: id, ids: z.array(id).min(1).max(300) })
export const setCoverSchema = z.object({ albumId: id, image: imageAssetSchema })

export type CreateAlbumInput = z.infer<typeof createAlbumSchema>
export type AlbumDetailsInput = z.infer<typeof albumDetailsSchema>
