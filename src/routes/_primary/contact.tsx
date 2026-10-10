import { createFileRoute } from '@tanstack/react-router'
import type { SearchSchemaInput } from '@tanstack/react-router'

import Contact from '@/components/pages/contact'
import { servicesQuery } from '@/hooks/api/services'
import { contactContentQuery, settingsQuery } from '@/hooks/api/site'
import { optionalString } from '@/lib/search'
import { breadcrumbJsonLd, jsonLd, seo } from '@/lib/seo'


export const Route = createFileRoute('/_primary/contact')({
  validateSearch: (search: { service?: string } & SearchSchemaInput) => ({ service: optionalString(search.service, 80) }),
  loader: async ({ context: { queryClient } }) => {
    const [settings, content] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery()),
      queryClient.ensureQueryData(contactContentQuery()),
      queryClient.ensureQueryData(servicesQuery()),
    ])
    return { settings, body: content.body }
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          ...seo({
            settings: loaderData.settings,
            title: 'Book a Photoshoot or Event Coverage',
            description: loaderData.body,
            path: '/contact',
          }),
          scripts: [jsonLd(breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Book a shoot', path: '/contact' }]))],
        }
      : {},
  component: ContactRoute,
})

function ContactRoute() {
  const { service } = Route.useSearch()
  return <Contact service={service} />
}
