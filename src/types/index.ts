/**
 * Domain types. These mirror the Supabase tables in
 * `supabase/migrations` (snake_case columns are mapped to camelCase in the
 * server layer) so seed data and live data share one shape.
 */

/**
 * An image reference. `src` is an absolute URL (Cloudinary secure_url or any
 * external CDN) and is resized at render time by `lib/media.ts`.
 * `publicId` is set for Cloudinary uploads so they can be destroyed later.
 */
export interface ImageAsset {
  src: string
  width: number
  height: number
  alt: string
  publicId?: string | null
  color?: string | null
}

export interface SocialLinks {
  instagram?: string
  tiktok?: string
  youtube?: string
  x?: string
  facebook?: string
}

export interface SiteSettings {
  businessName: string
  shortName: string
  tagline: string
  logo: ImageAsset | null
  email: string
  phones: Array<string>
  whatsapp: string
  location: string
  socials: SocialLinks
  footerNote: string
  showPackages: boolean
  showPrices: boolean
  showTestimonials: boolean
  seo: {
    title: string
    description: string
    image: ImageAsset | null
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  sortOrder: number
}

export type MediaItem =
  | {
      id: string
      kind: 'image'
      image: ImageAsset
      caption?: string | null
      sortOrder: number
    }
  | {
      id: string
      kind: 'video'
      videoUrl: string
      poster?: ImageAsset | null
      caption?: string | null
      sortOrder: number
    }

export interface Album {
  id: string
  slug: string
  title: string
  categoryId: string | null
  summary: string
  story?: string | null
  location?: string | null
  shotOn?: string | null
  cover: ImageAsset
  published: boolean
  featured: boolean
  sortOrder: number
  media: Array<MediaItem>
}

/** Album list item without media (smaller payloads for grids). */
export type AlbumSummary = Omit<Album, 'media'> & { mediaCount: number }

export interface Service {
  id: string
  slug: string
  title: string
  summary: string
  body?: string | null
  cover: ImageAsset | null
  visible: boolean
  sortOrder: number
}

export interface Package {
  id: string
  serviceId: string | null
  name: string
  description?: string | null
  priceLabel: string
  features: Array<string>
  highlighted: boolean
  visible: boolean
  sortOrder: number
}

export interface Testimonial {
  id: string
  clientName: string
  context: string
  quote: string
  avatar?: ImageAsset | null
  visible: boolean
  sortOrder: number
}

export const INQUIRY_STATUSES = ['new', 'read', 'replied', 'archived'] as const

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number]

export interface Inquiry {
  id: string
  name: string
  email?: string | null
  phone: string
  service?: string | null
  eventDate?: string | null
  location?: string | null
  budget?: string | null
  message: string
  status: InquiryStatus
  createdAt: string
}

/* ---------- Editable page sections (page_content table) ---------- */

export interface HeroContent {
  headline: string
  headlineEmphasis: string
  subheadline: string
  primaryCta: string
  secondaryCta: string
  slides: Array<ImageAsset>
}

export interface IntroContent {
  statement: string
  body: string
  image: ImageAsset | null
}

export interface ProcessStep {
  title: string
  body: string
  image: ImageAsset
}

export interface ProcessContent {
  heading: string
  intro: string
  steps: Array<ProcessStep>
}

export interface ShowreelContent {
  heading: string
  caption: string
  videoUrl: string
  poster: ImageAsset
}

export interface CtaContent {
  heading: string
  body: string
  image: ImageAsset | null
}

export interface AboutContent {
  heading: string
  lead: string
  story: Array<string>
  portrait: ImageAsset
  secondaryImage: ImageAsset | null
  stats: Array<{ value: string; label: string }>
  values: Array<{ title: string; body: string }>
}

export interface ContactContent {
  heading: string
  body: string
  responseNote: string
}

export interface PageHeaderContent {
  heading: string
  body: string
}

export interface HomeContent {
  hero: HeroContent
  intro: IntroContent
  process: ProcessContent
  showreel: ShowreelContent
  cta: CtaContent
}
