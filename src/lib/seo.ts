import { imageUrl } from '@/lib/media'
import type { ImageAsset, SiteSettings } from '@/types'

export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'http://localhost:3000'

interface SeoInput {
  title?: string
  description?: string
  image?: ImageAsset | null
  path?: string
  settings?: SiteSettings
}

/** Builds `head()` meta + links for a route. Titles get the business name appended. */
export function seo({ title, description, image, path = '/', settings }: SeoInput) {
  const brand = settings?.businessName ?? 'Upright Pictures Concepts'
  const fullTitle = title ? `${title} | ${brand}` : (settings?.seo.title ?? brand)
  const desc = description ?? settings?.seo.description ?? ''
  const img = image ?? settings?.seo.image ?? null
  const ogImage = img ? absolute(imageUrl(img.src, 1200)) : undefined
  const url = absolute(path)

  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: desc },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: brand },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: desc },
      { property: 'og:url', content: url },
      ...(ogImage ? [{ property: 'og:image', content: ogImage }] : []),
      { name: 'twitter:card', content: ogImage ? 'summary_large_image' : 'summary' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: desc },
      ...(ogImage ? [{ name: 'twitter:image', content: ogImage }] : []),
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}

function absolute(pathOrUrl: string) {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl
  return new URL(pathOrUrl, SITE_URL).toString()
}

/** schema.org LocalBusiness/ProfessionalService JSON-LD for the home page. */
export function businessJsonLd(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: settings.businessName,
    slogan: settings.tagline,
    url: SITE_URL,
    email: settings.email,
    telephone: settings.phones[0] ? `+234${settings.phones[0].replace(/^0/, '')}` : undefined,
    image: settings.seo.image ? imageUrl(settings.seo.image.src, 1200) : undefined,
    address: { '@type': 'PostalAddress', addressLocality: settings.location },
    sameAs: Object.values(settings.socials).filter(Boolean),
  }
}
