import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'
import { z } from 'zod'

import { findAlbumBySlug, findAlbums, findCategories } from '@/server/repository'

export const getCategories = createServerFn({ method: 'GET' }).handler(() => findCategories())

export const getAlbums = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      category: z.string().max(60).optional(),
      featured: z.boolean().optional(),
    }),
  )
  .handler(({ data }) => findAlbums({ categorySlug: data.category, featured: data.featured }))

export const getAlbum = createServerFn({ method: 'GET' })
  .validator(z.object({ slug: z.string().min(1).max(120) }))
  .handler(async ({ data }) => {
    const result = await findAlbumBySlug(data.slug)
    if (!result) throw notFound()
    return result
  })
