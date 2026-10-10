import { createFileRoute } from '@tanstack/react-router'

import About from '@/components/pages/about'
import { aboutContentQuery, settingsQuery } from '@/hooks/api/site'
import { breadcrumbJsonLd, jsonLd, seo } from '@/lib/seo'

export const Route = createFileRoute('/_primary/about')({
  loader: async ({ context: { queryClient } }) => {
    const [settings, content] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery()),
      queryClient.ensureQueryData(aboutContentQuery()),
    ])
    return { settings, lead: content.lead, portrait: content.portrait }
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          ...seo({
            settings: loaderData.settings,
            title: 'About the Studio',
            description: loaderData.lead,
            image: loaderData.portrait,
            path: '/about',
            type: 'profile',
          }),
          scripts: [jsonLd(breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }]))],
        }
      : {},
  component: About,
})
