/** Maps snake_case database rows to the app's camelCase domain types. */
import type { Tables } from '@/types/database'
import type {
  Album,
  AlbumSummary,
  Category,
  ImageAsset,
  MediaItem,
  Package,
  Service,
  SiteSettings,
  SocialLinks,
  Testimonial,
} from '@/types'

const image = (value: unknown): ImageAsset | null =>
  value && typeof value === 'object' && 'src' in value ? (value as ImageAsset) : null

export function toSettings(row: Tables<'site_settings'>): SiteSettings {
  const seo = (row.seo ?? {}) as { title?: string; description?: string; image?: unknown }
  return {
    businessName: row.business_name,
    shortName: row.short_name,
    tagline: row.tagline,
    logo: image(row.logo),
    email: row.email,
    phones: row.phones,
    whatsapp: row.whatsapp,
    location: row.location,
    socials: (row.socials ?? {}) as SocialLinks,
    footerNote: row.footer_note,
    showPackages: row.show_packages,
    showPrices: row.show_prices,
    showTestimonials: row.show_testimonials,
    seo: {
      title: seo.title ?? row.business_name,
      description: seo.description ?? '',
      image: image(seo.image),
    },
  }
}

export function toCategory(row: Tables<'categories'>): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    sortOrder: row.sort_order,
  }
}

export function toAlbumSummary(row: Tables<'albums'>, mediaCount: number): AlbumSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    categoryId: row.category_id,
    summary: row.summary,
    story: row.story,
    location: row.location,
    shotOn: row.shot_on,
    cover: image(row.cover) ?? { src: '', width: 4, height: 5, alt: row.title },
    published: row.published,
    featured: row.featured,
    sortOrder: row.sort_order,
    mediaCount,
  }
}

export function toMedia(row: Tables<'media'>): MediaItem | null {
  if (row.kind === 'image') {
    const img = image(row.image)
    return img ? { id: row.id, kind: 'image', image: img, caption: row.caption, sortOrder: row.sort_order } : null
  }
  if (!row.video_url) return null
  return {
    id: row.id,
    kind: 'video',
    videoUrl: row.video_url,
    poster: image(row.poster),
    caption: row.caption,
    sortOrder: row.sort_order,
  }
}

export function toAlbum(row: Tables<'albums'>, media: Array<Tables<'media'>>): Album {
  const { mediaCount: _count, ...summary } = toAlbumSummary(row, media.length)
  return { ...summary, media: media.map(toMedia).filter((m): m is MediaItem => m !== null) }
}

export function toService(row: Tables<'services'>): Service {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    body: row.body,
    cover: image(row.cover),
    visible: row.visible,
    sortOrder: row.sort_order,
  }
}

export function toPackage(row: Tables<'packages'>): Package {
  return {
    id: row.id,
    serviceId: row.service_id,
    name: row.name,
    description: row.description,
    priceLabel: row.price_label,
    features: row.features,
    highlighted: row.highlighted,
    visible: row.visible,
    sortOrder: row.sort_order,
  }
}

export function toTestimonial(row: Tables<'testimonials'>): Testimonial {
  return {
    id: row.id,
    clientName: row.client_name,
    context: row.context,
    quote: row.quote,
    avatar: image(row.avatar),
    visible: row.visible,
    sortOrder: row.sort_order,
  }
}
