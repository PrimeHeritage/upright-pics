import { imageUrl, ogImageUrl } from '@/lib/media'
import { toInternationalPhone } from '@/lib/utils'
import type { Album, ImageAsset, Service, SiteSettings } from '@/types'

const PRODUCTION_URL = 'https://uprightconceptsmedia.com'

/** Canonical origin. Falls back to the production domain so a missing env var never leaks localhost. */
export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined) || (import.meta.env.PROD ? PRODUCTION_URL : 'http://localhost:3000')
).replace(/\/$/, '')

/**
 * Other names people search for. Declared as schema.org `alternateName` so
 * Google can connect them to this site.
 */
export const ALTERNATE_NAMES = [
  'Upright Pictures',
  'Upright Picture Concept',
  'Upright Pictures Concept',
  'Upright Picture Concepts',
  'Upright Studio',
  'Upright Concepts Media',
  'UPC Photography',
]

export function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl
  return `${SITE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}

interface SeoInput {
  title?: string
  description?: string
  image?: ImageAsset | null
  path?: string
  settings?: SiteSettings
  type?: 'website' | 'article' | 'profile'
  noindex?: boolean
}

/** Builds `head()` meta + links for a route. Titles get the business name appended. */
export function seo({ title, description, image, path = '/', settings, type = 'website', noindex }: SeoInput) {
  const brand = settings?.businessName ?? 'Upright Pictures Concepts'
  const fullTitle = title ? `${title} | ${brand}` : (settings?.seo.title ?? brand)
  const desc = (description ?? settings?.seo.description ?? '').slice(0, 300)
  const img = image ?? settings?.seo.image ?? null
  const ogImage = img ? absoluteUrl(ogImageUrl(img.src)) : undefined
  const url = absoluteUrl(path)

  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: desc },
      ...(noindex ? [{ name: 'robots', content: 'noindex, follow' }] : [{ name: 'robots', content: 'index, follow, max-image-preview:large' }]),
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: brand },
      { property: 'og:locale', content: 'en_NG' },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: desc },
      { property: 'og:url', content: url },
      ...(ogImage
        ? [
            { property: 'og:image', content: ogImage },
            { property: 'og:image:width', content: '1200' },
            { property: 'og:image:height', content: '630' },
            { property: 'og:image:alt', content: img?.alt ?? brand },
          ]
        : []),
      { name: 'twitter:card', content: ogImage ? 'summary_large_image' : 'summary' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: desc },
      ...(ogImage ? [{ name: 'twitter:image', content: ogImage }] : []),
      ...(settings?.socials.x ? [{ name: 'twitter:site', content: `@${settings.socials.x.split('/').filter(Boolean).pop()}` }] : []),
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}

/** Serialises JSON-LD for a `scripts` entry in `head()`. */
export function jsonLd(data: unknown) {
  return { type: 'application/ld+json', children: JSON.stringify(data) }
}

const businessId = `${SITE_URL}/#business`
const websiteId = `${SITE_URL}/#website`

/** Business + website graph for the homepage (and referenced by other pages). */
export function businessJsonLd(settings: SiteSettings, services: Array<Service> = []) {
  const phone = settings.phones.at(0)
  const logo = settings.logo ? absoluteUrl(imageUrl(settings.logo.src, 512)) : undefined
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'ProfessionalService'],
        '@id': businessId,
        name: settings.businessName,
        alternateName: [settings.shortName, ...ALTERNATE_NAMES].filter(Boolean),
        slogan: settings.tagline,
        description: settings.seo.description,
        url: SITE_URL,
        logo,
        image: settings.seo.image ? absoluteUrl(ogImageUrl(settings.seo.image.src)) : logo,
        email: settings.email || undefined,
        telephone: phone ? `+${toInternationalPhone(phone)}` : undefined,
        address: { '@type': 'PostalAddress', addressLocality: settings.location.split(',')[0]?.trim(), addressCountry: 'NG' },
        areaServed: [{ '@type': 'City', name: 'Lagos' }, { '@type': 'Country', name: 'Nigeria' }],
        sameAs: Object.values(settings.socials).filter(Boolean),
        knowsAbout: ['Photography', 'Videography', 'Wedding photography', 'Portrait photography', 'Drone photography', 'Photo framing'],
        hasOfferCatalog: services.length
          ? {
              '@type': 'OfferCatalog',
              name: 'Photography and video services',
              itemListElement: services.map((s) => ({
                '@type': 'Offer',
                itemOffered: { '@type': 'Service', name: s.title, description: s.summary, url: `${SITE_URL}/services#${s.slug}` },
              })),
            }
          : undefined,
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: SITE_URL,
        name: settings.businessName,
        alternateName: [settings.shortName, ...ALTERNATE_NAMES].filter(Boolean),
        publisher: { '@id': businessId },
        inLanguage: 'en-NG',
      },
    ],
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

/** Album page: an image gallery credited to the business. */
export function albumJsonLd(album: Album, categoryName?: string | null) {
  const images = album.media.flatMap((m) => (m.kind === 'image' ? [m] : []))
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: album.title,
    description: album.summary,
    url: absoluteUrl(`/work/${album.slug}`),
    genre: categoryName ?? undefined,
    dateCreated: album.shotOn ?? undefined,
    contentLocation: album.location ? { '@type': 'Place', name: album.location } : undefined,
    author: { '@id': businessId },
    publisher: { '@id': businessId },
    primaryImageOfPage: { '@type': 'ImageObject', contentUrl: imageUrl(album.cover.src, 1600) },
    image: images.slice(0, 20).map((m) => ({
      '@type': 'ImageObject',
      contentUrl: imageUrl(m.image.src, 1600),
      caption: m.caption ?? m.image.alt,
      creator: { '@id': businessId },
      creditText: m.image.credit ?? undefined,
    })),
  }
}

export function servicesJsonLd(services: Array<Service>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.title,
        description: s.summary,
        url: absoluteUrl(`/services#${s.slug}`),
        provider: { '@id': businessId },
        areaServed: 'Lagos, Nigeria',
      },
    })),
  }
}
