import { createServerFn } from '@tanstack/react-start'

import { updateContentSchema } from '@/lib/schemas/content'
import { destroyRemovedImages } from '@/server/cloudinary'
import { adminMiddleware } from '@/server/middleware'
import {
  findAboutContent,
  findContactContent,
  findHomeContent,
  findPageHeader,
} from '@/server/repository'

/** All editable sections, with seed defaults filled in for anything missing. */
export const getAdminContent = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async () => {
    const [home, about, contact, work, services] = await Promise.all([
      findHomeContent(),
      findAboutContent(),
      findContactContent(),
      findPageHeader('work'),
      findPageHeader('services'),
    ])
    return {
      'home.hero': home.hero,
      'home.intro': home.intro,
      'home.process': home.process,
      'home.showreel': home.showreel,
      'home.cta': home.cta,
      'about.main': about,
      'contact.main': contact,
      'work.header': work,
      'services.header': services,
    }
  })

export const updateContent = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(updateContentSchema)
  .handler(async ({ data: { key, data }, context: { db } }) => {
    const [page, section] = key.split('.')
    const { data: before } = await db
      .from('page_content')
      .select('data')
      .eq('page', page)
      .eq('section', section)
      .maybeSingle()

    const { error } = await db.from('page_content').upsert({ page, section, data }, { onConflict: 'page,section' })
    if (error) throw new Error(error.message)

    await destroyRemovedImages(before?.data, data)
    return { ok: true as const }
  })
