import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'

import { applyOrder, friendlyDbError } from './helpers'
import {
  addPhotosSchema,
  addVideoSchema,
  albumDetailsSchema,
  albumFlagsSchema,
  createAlbumSchema,
  reorderMediaSchema,
  setCoverSchema,
  updateMediaSchema,
} from '@/lib/schemas/albums'
import { idOnly, reorderSchema } from '@/lib/schemas/catalog'
import { collectPublicIds, destroyImages } from '@/server/cloudinary'
import { toMedia } from '@/server/mappers'
import { adminMiddleware } from '@/server/middleware'
import { slugify } from '@/lib/utils'
import type { Db } from '@/server/supabase'
import type { ImageAsset, MediaItem } from '@/types'

const asImage = (v: unknown) => (v && typeof v === 'object' && 'src' in v ? (v as ImageAsset) : null)

/** Picks a slug that no other album uses, adding -2, -3... if needed. */
async function uniqueSlug(db: Db, base: string, exceptId?: string) {
  const root = slugify(base) || 'album'
  const { data } = await db.from('albums').select('id, slug').like('slug', `${root}%`)
  const taken = new Set((data ?? []).filter((r) => r.id !== exceptId).map((r) => r.slug))
  if (!taken.has(root)) return root
  let n = 2
  while (taken.has(`${root}-${n}`)) n++
  return `${root}-${n}`
}

/** Deletes Cloudinary files only if no album cover or media row still uses them. */
async function destroyIfUnused(db: Db, publicIds: Iterable<string>) {
  const ids = [...publicIds]
  if (ids.length === 0) return
  const [{ data: albums }, { data: media }] = await Promise.all([
    db.from('albums').select('cover'),
    db.from('media').select('image, poster'),
  ])
  const inUse = collectPublicIds([albums, media])
  const orphaned = ids.filter((id) => !inUse.has(id))
  try {
    await destroyImages(orphaned)
  } catch (err) {
    console.error('[cloudinary] cleanup failed', orphaned, err)
  }
}

/* ---------------- Albums ---------------- */

export const listAdminAlbums = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async ({ context: { db } }) => {
    const { data, error } = await db
      .from('albums')
      .select('id, slug, title, cover, published, featured, sort_order, shot_on, category_id, categories(name), media(count)')
      .order('sort_order')
    if (error) throw new Error(error.message)
    return data.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      cover: asImage(a.cover),
      published: a.published,
      featured: a.featured,
      shotOn: a.shot_on,
      categoryId: a.category_id,
      categoryName: a.categories?.name ?? null,
      mediaCount: a.media[0]?.count ?? 0,
    }))
  })

export const getAdminAlbum = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .validator(idOnly)
  .handler(async ({ data, context: { db } }) => {
    const { data: row, error } = await db
      .from('albums')
      .select('*, media(*)')
      .eq('id', data.id)
      .order('sort_order', { referencedTable: 'media' })
      .maybeSingle()
    if (error) throw new Error(error.message)
    if (!row) throw notFound()
    const { media, ...a } = row
    return {
      id: a.id,
      slug: a.slug,
      title: a.title,
      categoryId: a.category_id,
      summary: a.summary,
      story: a.story ?? '',
      location: a.location ?? '',
      shotOn: a.shot_on ?? '',
      cover: asImage(a.cover),
      published: a.published,
      featured: a.featured,
      media: media.map(toMedia).filter((m): m is MediaItem => m !== null),
    }
  })

export const createAlbum = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(createAlbumSchema)
  .handler(async ({ data, context: { db } }) => {
    // New albums go to the top of the list.
    const { data: first } = await db.from('albums').select('sort_order').order('sort_order').limit(1).maybeSingle()
    const { data: row, error } = await db
      .from('albums')
      .insert({
        title: data.title,
        slug: await uniqueSlug(db, data.title),
        category_id: data.categoryId || null,
        sort_order: (first?.sort_order ?? 1) - 1,
        published: false,
      })
      .select('id')
      .single()
    if (error) throw friendlyDbError(error, 'album')
    return { id: row.id }
  })

export const updateAlbumDetails = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(albumDetailsSchema)
  .handler(async ({ data, context: { db } }) => {
    const { error } = await db
      .from('albums')
      .update({
        title: data.title,
        slug: data.slug,
        category_id: data.categoryId || null,
        summary: data.summary,
        story: data.story || null,
        location: data.location || null,
        shot_on: data.shotOn || null,
      })
      .eq('id', data.id)
    if (error) throw friendlyDbError(error, 'album')
    return { ok: true as const }
  })

export const setAlbumFlags = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(albumFlagsSchema)
  .handler(async ({ data, context: { db } }) => {
    const { error } = await db
      .from('albums')
      .update({ published: data.published, featured: data.featured })
      .eq('id', data.id)
    if (error?.code === '23514') throw new Error('Add at least one photo before publishing this album.')
    if (error) throw new Error(error.message)
    return { ok: true as const }
  })

export const reorderAlbums = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(reorderSchema)
  .handler(async ({ data, context: { db } }) => {
    await applyOrder((id, sort_order) => db.from('albums').update({ sort_order }).eq('id', id), data.ids)
    return { ok: true as const }
  })

export const deleteAlbum = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(idOnly)
  .handler(async ({ data, context: { db } }) => {
    const { data: album } = await db.from('albums').select('cover, media(image, poster)').eq('id', data.id).single()
    const { error } = await db.from('albums').delete().eq('id', data.id)
    if (error) throw new Error(error.message)
    await destroyIfUnused(db, collectPublicIds(album))
    return { ok: true as const }
  })

/* ---------------- Media ---------------- */

async function nextMediaOrder(db: Db, albumId: string) {
  const { data } = await db
    .from('media')
    .select('sort_order')
    .eq('album_id', albumId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()
  return (data?.sort_order ?? 0) + 1
}

export const addPhotos = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(addPhotosSchema)
  .handler(async ({ data, context: { db } }) => {
    const start = await nextMediaOrder(db, data.albumId)
    const { error } = await db.from('media').insert(
      data.images.map((image, i) => ({ album_id: data.albumId, kind: 'image', image, sort_order: start + i })),
    )
    if (error) throw new Error(error.message)

    // First photos in an empty album become its cover.
    await db.from('albums').update({ cover: data.images[0] }).eq('id', data.albumId).is('cover', null)
    return { ok: true as const }
  })

export const addVideo = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(addVideoSchema)
  .handler(async ({ data, context: { db } }) => {
    const { error } = await db.from('media').insert({
      album_id: data.albumId,
      kind: 'video',
      video_url: data.url,
      caption: data.caption || null,
      sort_order: await nextMediaOrder(db, data.albumId),
    })
    if (error) throw new Error(error.message)
    return { ok: true as const }
  })

export const updateMedia = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(updateMediaSchema)
  .handler(async ({ data, context: { db } }) => {
    const { data: row, error: readError } = await db.from('media').select('kind, image').eq('id', data.id).single()
    if (readError) throw new Error(readError.message)
    const image = asImage(row.image)
    const { error } = await db
      .from('media')
      .update({ caption: data.caption || null, image: image ? { ...image, alt: data.alt } : row.image })
      .eq('id', data.id)
    if (error) throw new Error(error.message)
    return { ok: true as const }
  })

export const deleteMedia = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(idOnly)
  .handler(async ({ data, context: { db } }) => {
    const { data: row } = await db.from('media').select('album_id, image, poster').eq('id', data.id).single()
    const { error } = await db.from('media').delete().eq('id', data.id)
    if (error) throw new Error(error.message)
    // Files still used as the album cover are kept.
    if (row) await destroyIfUnused(db, collectPublicIds(row))
    return { ok: true as const }
  })

export const reorderMedia = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(reorderMediaSchema)
  .handler(async ({ data, context: { db } }) => {
    await applyOrder(
      (id, sort_order) => db.from('media').update({ sort_order }).eq('id', id).eq('album_id', data.albumId),
      data.ids,
    )
    return { ok: true as const }
  })

export const setAlbumCover = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(setCoverSchema)
  .handler(async ({ data, context: { db } }) => {
    const { data: before } = await db.from('albums').select('cover').eq('id', data.albumId).single()
    const { error } = await db.from('albums').update({ cover: data.image }).eq('id', data.albumId)
    if (error) throw new Error(error.message)
    const removed = [...collectPublicIds(before)].filter((id) => id !== data.image.publicId)
    await destroyIfUnused(db, removed)
    return { ok: true as const }
  })

