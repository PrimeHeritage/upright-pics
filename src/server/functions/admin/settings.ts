import { createServerFn } from '@tanstack/react-start'

import { settingsSchema } from '@/lib/schemas/settings'
import { destroyRemovedImages } from '@/server/cloudinary'
import { toSettings } from '@/server/mappers'
import { adminMiddleware } from '@/server/middleware'
import type { SettingsInput } from '@/lib/schemas/settings'

/** Settings in the editable form shape (socials always have every key). */
export const getAdminSettings = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async ({ context: { db } }): Promise<SettingsInput> => {
    const { data, error } = await db.from('site_settings').select('*').eq('id', 1).single()
    if (error) throw new Error(error.message)
    const s = toSettings(data)
    return {
      businessName: s.businessName,
      shortName: s.shortName,
      tagline: s.tagline,
      logo: s.logo,
      email: s.email,
      phones: s.phones,
      whatsapp: s.whatsapp,
      location: s.location,
      socials: {
        instagram: s.socials.instagram ?? '',
        tiktok: s.socials.tiktok ?? '',
        youtube: s.socials.youtube ?? '',
        x: s.socials.x ?? '',
        facebook: s.socials.facebook ?? '',
      },
      footerNote: s.footerNote,
      showPackages: s.showPackages,
      showPrices: s.showPrices,
      showTestimonials: s.showTestimonials,
      seo: { title: s.seo.title, description: s.seo.description, image: s.seo.image },
    }
  })

export const updateSettings = createServerFn({ method: 'POST' })
  .middleware([adminMiddleware])
  .validator(settingsSchema)
  .handler(async ({ data, context: { db } }) => {
    const { data: before } = await db.from('site_settings').select('logo, seo').eq('id', 1).single()

    const socials = Object.fromEntries(Object.entries(data.socials).filter(([, v]) => v))
    const { error } = await db
      .from('site_settings')
      .update({
        business_name: data.businessName,
        short_name: data.shortName,
        tagline: data.tagline,
        logo: data.logo,
        email: data.email,
        phones: data.phones.filter((p) => p.trim()),
        whatsapp: data.whatsapp,
        location: data.location,
        socials,
        footer_note: data.footerNote,
        show_packages: data.showPackages,
        show_prices: data.showPrices,
        show_testimonials: data.showTestimonials,
        seo: data.seo,
      })
      .eq('id', 1)
    if (error) throw new Error(error.message)

    await destroyRemovedImages(before, { logo: data.logo, seo: data.seo })
    return { ok: true as const }
  })
