/**
 * Data access for public content.
 *
 * Phase 1: returns typed seed data so the whole site renders without a backend.
 * Phase 3: each function's body is replaced with a Supabase query (same return
 * types), so server functions, query options and components do not change.
 *
 * Server-only: import this from `src/server/functions/*` only.
 */
import {
  seedAbout,
  seedContact,
  seedHome,
  seedServicesHeader,
  seedSettings,
  seedWorkHeader,
} from '@/lib/seed/site'
import { seedAlbums, seedCategories } from '@/lib/seed/portfolio'
import { seedPackages, seedServices, seedTestimonials } from '@/lib/seed/services'
import type {
  AboutContent,
  Album,
  AlbumSummary,
  Category,
  ContactContent,
  HomeContent,
  Package,
  PageHeaderContent,
  Service,
  SiteSettings,
  Testimonial,
} from '@/types'

const bySortOrder = <T extends { sortOrder: number }>(a: T, b: T) => a.sortOrder - b.sortOrder

export async function findSettings(): Promise<SiteSettings> {
  return seedSettings
}

export async function findHomeContent(): Promise<HomeContent> {
  return seedHome
}

export async function findAboutContent(): Promise<AboutContent> {
  return seedAbout
}

export async function findContactContent(): Promise<ContactContent> {
  return seedContact
}

export async function findPageHeader(page: 'work' | 'services'): Promise<PageHeaderContent> {
  return page === 'work' ? seedWorkHeader : seedServicesHeader
}

export async function findCategories(): Promise<Array<Category>> {
  return [...seedCategories].sort(bySortOrder)
}

export async function findAlbums(filter: {
  categorySlug?: string
  featured?: boolean
}): Promise<Array<AlbumSummary>> {
  const category = filter.categorySlug
    ? seedCategories.find((c) => c.slug === filter.categorySlug)
    : undefined
  return seedAlbums
    .filter((a) => a.published)
    .filter((a) => (filter.featured ? a.featured : true))
    .filter((a) => (filter.categorySlug ? a.categoryId === category?.id : true))
    .sort(bySortOrder)
    .map(({ media, ...album }) => ({ ...album, mediaCount: media.length }))
}

export async function findAlbumBySlug(
  slug: string,
): Promise<{ album: Album; category: Category | null; next: AlbumSummary | null } | null> {
  const published = seedAlbums.filter((a) => a.published).sort(bySortOrder)
  const index = published.findIndex((a) => a.slug === slug)
  if (index === -1) return null
  const album = published[index]
  const nextAlbum = published[(index + 1) % published.length]
  const { media, ...nextRest } = nextAlbum
  return {
    album: { ...album, media: [...album.media].sort(bySortOrder) },
    category: seedCategories.find((c) => c.id === album.categoryId) ?? null,
    next: nextAlbum.id === album.id ? null : { ...nextRest, mediaCount: media.length },
  }
}

export async function findServices(): Promise<Array<Service>> {
  return seedServices.filter((s) => s.visible).sort(bySortOrder)
}

/** Returns [] when packages are switched off site-wide, so nothing can leak. */
export async function findPackages(): Promise<Array<Package>> {
  const settings = await findSettings()
  if (!settings.showPackages) return []
  return seedPackages
    .filter((p) => p.visible)
    .sort(bySortOrder)
    .map((p) => (settings.showPrices ? p : { ...p, priceLabel: '' }))
}

export async function findTestimonials(): Promise<Array<Testimonial>> {
  const settings = await findSettings()
  if (!settings.showTestimonials) return []
  return seedTestimonials.filter((t) => t.visible).sort(bySortOrder)
}
