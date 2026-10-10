import { createServerFn } from '@tanstack/react-start'

import { applyOrder, friendlyDbError } from './helpers'
import { idOnly, reorderSchema, serviceSchema, visibilitySchema, serviceUpdateSchema } from '@/lib/schemas/catalog'
import { destroyRemovedImages } from '@/server/cloudinary'
import { toService } from '@/server/mappers'
import { adminMiddleware } from '@/server/middleware'

export const listServices = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async ({ context: { db } }) => {
    const { data, error } = await db.from('services').select('*').order('sort_order')
    if (error) throw new Error(error.message)
    return data.map(toService)
  })

export const createService = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(serviceSchema)
  .handler(async ({ data, context: { db } }) => {
    const { count } = await db.from('services').select('id', { count: 'exact', head: true })
    const { error } = await db.from('services').insert({ ...data, sort_order: (count ?? 0) + 1 })
    if (error) throw friendlyDbError(error, 'service')
    return { ok: true as const }
  })

export const updateService = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(serviceUpdateSchema)
  .handler(async ({ data: { id, ...data }, context: { db } }) => {
    const { data: before } = await db.from('services').select('cover').eq('id', id).single()
    const { error } = await db.from('services').update(data).eq('id', id)
    if (error) throw friendlyDbError(error, 'service')
    await destroyRemovedImages(before, { cover: data.cover })
    return { ok: true as const }
  })

export const setServiceVisibility = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(visibilitySchema)
  .handler(async ({ data, context: { db } }) => {
    const { error } = await db.from('services').update({ visible: data.visible }).eq('id', data.id)
    if (error) throw new Error(error.message)
    return { ok: true as const }
  })

export const deleteService = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(idOnly)
  .handler(async ({ data, context: { db } }) => {
    const { data: before } = await db.from('services').select('cover').eq('id', data.id).single()
    const { error } = await db.from('services').delete().eq('id', data.id)
    if (error) throw friendlyDbError(error, 'service')
    await destroyRemovedImages(before, null)
    return { ok: true as const }
  })

export const reorderServices = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(reorderSchema)
  .handler(async ({ data, context: { db } }) => {
    await applyOrder((id, sort_order) => db.from('services').update({ sort_order }).eq('id', id), data.ids)
    return { ok: true as const }
  })
