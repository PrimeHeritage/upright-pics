import { createFileRoute } from '@tanstack/react-router'

import Services from '@/components/pages/services'
import { packagesQuery, servicesQuery } from '@/hooks/api/services'
import { pageHeaderQuery, settingsQuery } from '@/hooks/api/site'
import { breadcrumbJsonLd, jsonLd, seo, servicesJsonLd } from '@/lib/seo'

export const Route = createFileRoute('/_primary/services')({
  loader: async ({ context: { queryClient } }) => {
    const [settings, header, services] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery()),
      queryClient.ensureQueryData(pageHeaderQuery('services')),
      queryClient.ensureQueryData(servicesQuery()),
      queryClient.ensureQueryData(packagesQuery()),
    ])
    return { settings, header, services }
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          ...seo({
            settings: loaderData.settings,
            title: 'Photography, Video & Framing Services in Lagos',
            description: loaderData.header.body,
            path: '/services',
          }),
          scripts: [
            jsonLd(servicesJsonLd(loaderData.services)),
            jsonLd(breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])),
          ],
        }
      : {},
  component: Services,
})
