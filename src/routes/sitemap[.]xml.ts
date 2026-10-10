import { createFileRoute } from '@tanstack/react-router'

import { imageUrl } from '@/lib/media'
import { SITE_URL } from '@/lib/seo'
import { getPublicClient } from '@/server/supabase'

const xml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

interface Entry {
  path: string
  lastmod?: string
  changefreq: 'daily' | 'weekly' | 'monthly'
  priority: number
  images?: Array<{ src: string; title: string }>
}

/**
 * Dynamic sitemap: static pages + every published album (with its photos via
 * the Google image-sitemap extension), so new albums are discoverable without
 * a redeploy.
 */
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const db = getPublicClient()
        const [{ data: albums }, { data: categories }, { data: settings }] = await Promise.all([
          db
            .from('albums')
            .select('slug, title, updated_at, cover, media(kind, image, sort_order)')
            .eq('published', true)
            .order('sort_order'),
          db.from('categories').select('slug'),
          db.from('site_settings').select('updated_at').eq('id', 1).maybeSingle(),
        ])

        const latest = [settings?.updated_at, ...(albums ?? []).map((a) => a.updated_at)].filter(Boolean).sort().at(-1)

        const entries: Array<Entry> = [
          { path: '/', lastmod: latest, changefreq: 'weekly', priority: 1 },
          { path: '/work', lastmod: latest, changefreq: 'weekly', priority: 0.9 },
          { path: '/services', changefreq: 'monthly', priority: 0.8 },
          { path: '/about', changefreq: 'monthly', priority: 0.7 },
          { path: '/contact', changefreq: 'monthly', priority: 0.8 },
          ...(categories ?? []).map((c) => ({ path: `/work?category=${c.slug}`, changefreq: 'weekly' as const, priority: 0.6 })),
          ...(albums ?? []).map((a) => ({
            path: `/work/${a.slug}`,
            lastmod: a.updated_at,
            changefreq: 'monthly' as const,
            priority: 0.7,
            images: (a.media as Array<{ kind: string; image: { src: string; alt?: string } | null }>)
              .filter((m) => m.kind === 'image' && m.image?.src)
              .slice(0, 50)
              .map((m) => ({ src: imageUrl(m.image!.src, 1600), title: m.image!.alt || a.title })),
          })),
        ]

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries
  .map(
    (e) => `  <url>
    <loc>${xml(`${SITE_URL}${e.path}`)}</loc>${e.lastmod ? `\n    <lastmod>${new Date(e.lastmod).toISOString()}</lastmod>` : ''}
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>${(e.images ?? [])
      .map((img) => `\n    <image:image><image:loc>${xml(img.src)}</image:loc><image:title>${xml(img.title)}</image:title></image:image>`)
      .join('')}
  </url>`,
  )
  .join('\n')}
</urlset>
`
        return new Response(body, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
          },
        })
      },
    },
  },
})
