import { createServerFn } from '@tanstack/react-start'

import { applyOrder, friendlyDbError } from './helpers'
import { idOnly, reorderSchema, testimonialSchema, visibilitySchema, testimonialUpdateSchema } from '@/lib/schemas/catalog'
import { toTestimonial } from '@/server/mappers'
import { adminMiddleware } from '@/server/middleware'
import type { TestimonialInput } from '@/lib/schemas/catalog'

const toRow = (t: TestimonialInput) => ({
  client_name: t.clientName,
  context: t.context,
  quote: t.quote,
  visible: t.visible,
})

export const listTestimonials = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async ({ context: { db } }) => {
    const { data, error } = await db.from('testimonials').select('*').order('sort_order')
    if (error) throw new Error(error.message)
    return data.map(toTestimonial)
  })

export const createTestimonial = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(testimonialSchema)
  .handler(async ({ data, context: { db } }) => {
    const { count } = await db.from('testimonials').select('id', { count: 'exact', head: true })
    const { error } = await db.from('testimonials').insert({ ...toRow(data), sort_order: (count ?? 0) + 1 })
    if (error) throw friendlyDbError(error, 'testimonial')
    return { ok: true as const }
  })

export const updateTestimonial = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(testimonialUpdateSchema)
  .handler(async ({ data: { id, ...data }, context: { db } }) => {
    const { error } = await db.from('testimonials').update(toRow(data)).eq('id', id)
    if (error) throw friendlyDbError(error, 'testimonial')
    return { ok: true as const }
  })

export const setTestimonialVisibility = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(visibilitySchema)
  .handler(async ({ data, context: { db } }) => {
    const { error } = await db.from('testimonials').update({ visible: data.visible }).eq('id', data.id)
    if (error) throw new Error(error.message)
    return { ok: true as const }
  })

export const deleteTestimonial = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(idOnly)
  .handler(async ({ data, context: { db } }) => {
    const { error } = await db.from('testimonials').delete().eq('id', data.id)
    if (error) throw friendlyDbError(error, 'testimonial')
    return { ok: true as const }
  })

export const reorderTestimonials = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(reorderSchema)
  .handler(async ({ data, context: { db } }) => {
    await applyOrder((id, sort_order) => db.from('testimonials').update({ sort_order }).eq('id', id), data.ids)
    return { ok: true as const }
  })
