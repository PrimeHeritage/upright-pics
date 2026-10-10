/**
 * Data access for public content (Supabase, publishable key + RLS).
 *
 * Every function returns app domain types, so server functions, query
 * options and components are unaware of the database. Editable page sections
 * fall back to the seed defaults if a row is missing, so the site never
 * renders an empty section.
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
import {
  toAlbum,
  toAlbumSummary,
  toCategory,
  toPackage,
  toService,
  toSettings,
  toTestimonial,
} from '@/server/mappers'
import { getPublicClient } from '@/server/supabase'
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

function fail(scope: string, error: { message: string }): never {
  throw new Error(`[repository:${scope}] ${error.message}`)
}

export async function findSettings(): Promise<SiteSettings> {
  const { data, error } = await getPublicClient().from('site_settings').select('*').eq('id', 1).maybeSingle()
  if (error) fail('settings', error)
  return data ? toSettings(data) : seedSettings
}

/** Loads all sections of a page as a { section: data } map. */
async function findPageSections(page: string): Promise<Record<string, unknown>> {
  const { data, error } = await getPublicClient().from('page_content').select('section, data').eq('page', page)
  if (error) fail(`page:${page}`, error)
  return Object.fromEntries(data.map((row) => [row.section, row.data]))
}

/** Shallow-merges stored section data over the seed default (new fields stay filled). */
function section<T extends object>(stored: unknown, fallback: T): T {
  return stored && typeof stored === 'object' ? { ...fallback, ...(stored as Partial<T>) } : fallback
}

export async function findHomeContent(): Promise<HomeContent> {
  const s = await findPageSections('home')
  return {
    hero: section(s.hero, seedHome.hero),
    intro: section(s.intro, seedHome.intro),
    process: section(s.process, seedHome.process),
    showreel: section(s.showreel, seedHome.showreel),
    cta: section(s.cta, seedHome.cta),
  }
}

export async function findAboutContent(): Promise<AboutContent> {
  const s = await findPageSections('about')
  return section(s.main, seedAbout)
}

export async function findContactContent(): Promise<ContactContent> {
  const s = await findPageSections('contact')
  return section(s.main, seedContact)
}

export async function findPageHeader(page: 'work' | 'services'): Promise<PageHeaderContent> {
  const s = await findPageSections(page)
  return section(s.header, page === 'work' ? seedWorkHeader : seedServicesHeader)
}

export async function findCategories(): Promise<Array<Category>> {
  const { data, error } = await getPublicClient().from('categories').select('*').order('sort_order')
  if (error) fail('categories', error)
  return data.map(toCategory)
}

export async function findAlbums(filter: {
  categorySlug?: string
  featured?: boolean
}): Promise<Array<AlbumSummary>> {
  const db = getPublicClient()
  let query = db.from('albums').select('*, media(count)').eq('published', true).order('sort_order')

  if (filter.featured) query = query.eq('featured', true)
  if (filter.categorySlug) {
    const { data: category, error } = await db
      .from('categories')
      .select('id')
      .eq('slug', filter.categorySlug)
      .maybeSingle()
    if (error) fail('albums:category', error)
    if (!category) return []
    query = query.eq('category_id', category.id)
  }

  const { data, error } = await query
  if (error) fail('albums', error)
  return data.map(({ media, ...row }) => toAlbumSummary(row, media[0]?.count ?? 0))
}

export async function findAlbumBySlug(
  slug: string,
): Promise<{ album: Album; category: Category | null; next: AlbumSummary | null } | null> {
  const db = getPublicClient()
  const { data: row, error } = await db
    .from('albums')
    .select('*, media(*), categories(*)')
    .eq('slug', slug)
    .eq('published', true)
    .order('sort_order', { referencedTable: 'media' })
    .maybeSingle()
  if (error) fail('album', error)
  if (!row) return null

  const { media, categories, ...albumRow } = row

  // Next album in display order, wrapping around to the first.
  const { data: siblings, error: siblingsError } = await db
    .from('albums')
    .select('*, media(count)')
    .eq('published', true)
    .order('sort_order')
  if (siblingsError) fail('album:next', siblingsError)
  const index = siblings.findIndex((a) => a.id === albumRow.id)
  const nextRow = siblings.length > 1 ? siblings[(index + 1) % siblings.length] : undefined

  return {
    album: toAlbum(albumRow, media),
    category: categories ? toCategory(categories) : null,
    next: nextRow ? toAlbumSummary(nextRow, nextRow.media[0]?.count ?? 0) : null,
  }
}

export async function findServices(): Promise<Array<Service>> {
  const { data, error } = await getPublicClient()
    .from('services')
    .select('*')
    .eq('visible', true)
    .order('sort_order')
  if (error) fail('services', error)
  return data.map(toService)
}

/** RLS already hides packages when switched off; prices are blanked here when hidden. */
export async function findPackages(): Promise<Array<Package>> {
  const [settings, { data, error }] = await Promise.all([
    findSettings(),
    getPublicClient().from('packages').select('*').eq('visible', true).order('sort_order'),
  ])
  if (error) fail('packages', error)
  if (!settings.showPackages) return []
  return data.map(toPackage).map((p) => (settings.showPrices ? p : { ...p, priceLabel: '' }))
}

export async function findTestimonials(): Promise<Array<Testimonial>> {
  const [settings, { data, error }] = await Promise.all([
    findSettings(),
    getPublicClient().from('testimonials').select('*').eq('visible', true).order('sort_order'),
  ])
  if (error) fail('testimonials', error)
  if (!settings.showTestimonials) return []
  return data.map(toTestimonial)
}
