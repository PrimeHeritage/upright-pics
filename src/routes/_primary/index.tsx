import { createFileRoute } from '@tanstack/react-router'

import Home from '@/components/pages/home'
import { albumsQuery, categoriesQuery } from '@/hooks/api/portfolio'
import { packagesQuery, servicesQuery, testimonialsQuery } from '@/hooks/api/services'
import { homeContentQuery, settingsQuery } from '@/hooks/api/site'
import { businessJsonLd, jsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/_primary/')({
  loader: async ({ context: { queryClient } }) => {
    const [settings, , , , services] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery()),
      queryClient.ensureQueryData(homeContentQuery()),
      queryClient.ensureQueryData(albumsQuery({ featured: true })),
      queryClient.ensureQueryData(categoriesQuery()),
      queryClient.ensureQueryData(servicesQuery()),
      queryClient.ensureQueryData(testimonialsQuery()),
      queryClient.ensureQueryData(packagesQuery()),
    ])
    // The hero <img> is priority, so React emits its responsive preload itself.
    return { settings, services }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { settings, services } = loaderData
    return {
      ...seo({ settings, path: '/' }),
      scripts: [jsonLd(businessJsonLd(settings, services))],
    }
  },
  component: Home,
})
