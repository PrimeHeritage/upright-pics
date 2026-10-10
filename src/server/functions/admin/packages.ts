import { createServerFn } from '@tanstack/react-start'

import { applyOrder, friendlyDbError } from './helpers'
import { idOnly, packageSchema, reorderSchema, visibilitySchema, packageUpdateSchema } from '@/lib/schemas/catalog'
import { toPackage } from '@/server/mappers'
import { adminMiddleware } from '@/server/middleware'
import type { PackageInput } from '@/lib/schemas/catalog'

const toRow = (p: PackageInput) => ({
  name: p.name,
  service_id: p.serviceId || null,
  description: p.description || null,
  price_label: p.priceLabel,
  features: p.features,
  highlighted: p.highlighted,
  visible: p.visible,
})

export const listPackages = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async ({ context: { db } }) => {
    const { data, error } = await db.from('packages').select('*').order('sort_order')
    if (error) throw new Error(error.message)
    return data.map(toPackage)
  })

export const createPackage = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(packageSchema)
  .handler(async ({ data, context: { db } }) => {
    const { count } = await db.from('packages').select('id', { count: 'exact', head: true })
    const { error } = await db.from('packages').insert({ ...toRow(data), sort_order: (count ?? 0) + 1 })
    if (error) throw friendlyDbError(error, 'package')
    return { ok: true as const }
  })

export const updatePackage = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(packageUpdateSchema)
  .handler(async ({ data: { id, ...data }, context: { db } }) => {
    const { error } = await db.from('packages').update(toRow(data)).eq('id', id)
    if (error) throw friendlyDbError(error, 'package')
    return { ok: true as const }
  })

export const setPackageVisibility = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(visibilitySchema)
  .handler(async ({ data, context: { db } }) => {
    const { error } = await db.from('packages').update({ visible: data.visible }).eq('id', data.id)
    if (error) throw new Error(error.message)
    return { ok: true as const }
  })

export const deletePackage = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(idOnly)
  .handler(async ({ data, context: { db } }) => {
    const { error } = await db.from('packages').delete().eq('id', data.id)
    if (error) throw friendlyDbError(error, 'package')
    return { ok: true as const }
  })

export const reorderPackages = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(reorderSchema)
  .handler(async ({ data, context: { db } }) => {
    await applyOrder((id, sort_order) => db.from('packages').update({ sort_order }).eq('id', id), data.ids)
    return { ok: true as const }
  })
