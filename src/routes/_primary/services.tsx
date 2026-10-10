import { createFileRoute } from '@tanstack/react-router'

import Services from '@/components/pages/services'
import { packagesQuery, servicesQuery } from '@/hooks/api/services'
import { pageHeaderQuery, settingsQuery } from '@/hooks/api/site'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/_primary/services')({
  loader: async ({ context: { queryClient } }) => {
    const [settings, header] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery()),
      queryClient.ensureQueryData(pageHeaderQuery('services')),
      queryClient.ensureQueryData(servicesQuery()),
      queryClient.ensureQueryData(packagesQuery()),
    ])
    return { settings, header }
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo({ settings: loaderData.settings, title: 'Services', description: loaderData.header.body, path: '/services' })
      : {},
  component: Services,
})
