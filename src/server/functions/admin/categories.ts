import { createServerFn } from '@tanstack/react-start'

import { applyOrder, friendlyDbError } from './helpers'
import { categorySchema, idOnly, reorderSchema, categoryUpdateSchema } from '@/lib/schemas/catalog'
import { toCategory } from '@/server/mappers'
import { adminMiddleware } from '@/server/middleware'

export const listCategories = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async ({ context: { db } }) => {
    const { data, error } = await db.from('categories').select('*, albums(count)').order('sort_order')
    if (error) throw new Error(error.message)
    return data.map(({ albums, ...row }) => ({ ...toCategory(row), albumCount: albums[0]?.count ?? 0 }))
  })

export const createCategory = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(categorySchema)
  .handler(async ({ data, context: { db } }) => {
    const { count } = await db.from('categories').select('id', { count: 'exact', head: true })
    const { error } = await db.from('categories').insert({ ...data, sort_order: (count ?? 0) + 1 })
    if (error) throw friendlyDbError(error, 'category')
    return { ok: true as const }
  })

export const updateCategory = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(categoryUpdateSchema)
  .handler(async ({ data: { id, ...data }, context: { db } }) => {
    const { error } = await db.from('categories').update(data).eq('id', id)
    if (error) throw friendlyDbError(error, 'category')
    return { ok: true as const }
  })

/** Albums in a deleted category stay published but become uncategorised. */
export const deleteCategory = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(idOnly)
  .handler(async ({ data, context: { db } }) => {
    const { error } = await db.from('categories').delete().eq('id', data.id)
    if (error) throw friendlyDbError(error, 'category')
    return { ok: true as const }
  })

export const reorderCategories = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(reorderSchema)
  .handler(async ({ data, context: { db } }) => {
    await applyOrder((id, sort_order) => db.from('categories').update({ sort_order }).eq('id', id), data.ids)
    return { ok: true as const }
  })
