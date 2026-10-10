import { createFileRoute } from '@tanstack/react-router'

import Home from '@/components/pages/home'
import { albumsQuery, categoriesQuery } from '@/hooks/api/portfolio'
import { packagesQuery, servicesQuery, testimonialsQuery } from '@/hooks/api/services'
import { homeContentQuery, settingsQuery } from '@/hooks/api/site'
import { imageUrl } from '@/lib/media'
import { businessJsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/_primary/')({
  loader: async ({ context: { queryClient } }) => {
    const [settings, content] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery()),
      queryClient.ensureQueryData(homeContentQuery()),
      queryClient.ensureQueryData(albumsQuery({ featured: true })),
      queryClient.ensureQueryData(categoriesQuery()),
      queryClient.ensureQueryData(servicesQuery()),
      queryClient.ensureQueryData(testimonialsQuery()),
      queryClient.ensureQueryData(packagesQuery()),
    ])
    return { settings, heroImage: content.hero.slides.at(0) ?? null }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { settings, heroImage } = loaderData
    const base = seo({ settings, path: '/' })
    return {
      ...base,
      links: [
        ...base.links,
        ...(heroImage
          ? [{ rel: 'preload', as: 'image', href: imageUrl(heroImage.src, 1080), fetchPriority: 'high' }]
          : []),
      ],
      scripts: [{ type: 'application/ld+json', children: JSON.stringify(businessJsonLd(settings)) }],
    }
  },
  component: Home,
})
