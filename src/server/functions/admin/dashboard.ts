import { createServerFn } from '@tanstack/react-start'

import { adminMiddleware } from '@/server/middleware'
import type { Inquiry, InquiryStatus } from '@/types'

export const getDashboard = createServerFn({ method: 'GET' })
  .middleware([adminMiddleware])
  .handler(async ({ context: { db } }) => {
    const head = { count: 'exact' as const, head: true }
    const [albums, published, photos, newInquiries, services, recent, settings] = await Promise.all([
      db.from('albums').select('id', head),
      db.from('albums').select('id', head).eq('published', true),
      db.from('media').select('id', head).eq('kind', 'image'),
      db.from('inquiries').select('id', head).eq('status', 'new'),
      db.from('services').select('id', head).eq('visible', true),
      db.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5),
      db.from('site_settings').select('show_packages, show_testimonials, show_prices').eq('id', 1).maybeSingle(),
    ])

    const firstError = [albums, published, photos, newInquiries, services, recent, settings].find((r) => r.error)?.error
    if (firstError) throw new Error(firstError.message)

    const recentInquiries: Array<Inquiry> = (recent.data ?? []).map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      service: r.service,
      eventDate: r.event_date,
      location: r.location,
      message: r.message,
      status: r.status as InquiryStatus,
      createdAt: r.created_at,
    }))

    return {
      counts: {
        albums: albums.count ?? 0,
        publishedAlbums: published.count ?? 0,
        photos: photos.count ?? 0,
        newInquiries: newInquiries.count ?? 0,
        services: services.count ?? 0,
      },
      toggles: {
        showPackages: settings.data?.show_packages ?? true,
        showTestimonials: settings.data?.show_testimonials ?? true,
        showPrices: settings.data?.show_prices ?? true,
      },
      recentInquiries,
    }
  })
