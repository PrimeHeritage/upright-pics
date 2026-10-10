import { createFileRoute } from '@tanstack/react-router'

import Home from '@/components/pages/home'
import { albumsQuery, categoriesQuery } from '@/hooks/api/portfolio'
import { packagesQuery, servicesQuery, testimonialsQuery } from '@/hooks/api/services'
import { homeContentQuery, settingsQuery } from '@/hooks/api/site'
import { businessJsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/_primary/')({
  loader: async ({ context: { queryClient } }) => {
    const [settings] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery()),
      queryClient.ensureQueryData(homeContentQuery()),
      queryClient.ensureQueryData(albumsQuery({ featured: true })),
      queryClient.ensureQueryData(categoriesQuery()),
      queryClient.ensureQueryData(servicesQuery()),
      queryClient.ensureQueryData(testimonialsQuery()),
      queryClient.ensureQueryData(packagesQuery()),
    ])
    // The hero <img> is priority, so React emits its responsive preload itself.
    return { settings }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { settings } = loaderData
    return {
      ...seo({ settings, path: '/' }),
      scripts: [{ type: 'application/ld+json', children: JSON.stringify(businessJsonLd(settings)) }],
    }
  },
  component: Home,
})
