import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import Contact from '@/components/pages/contact'
import { servicesQuery } from '@/hooks/api/services'
import { contactContentQuery, settingsQuery } from '@/hooks/api/site'
import { seo } from '@/lib/seo'

const searchSchema = z.object({
  service: z.string().max(80).optional().catch(undefined),
})

export const Route = createFileRoute('/_primary/contact')({
  validateSearch: searchSchema,
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
      ? seo({ settings: loaderData.settings, title: 'Book a shoot', description: loaderData.body, path: '/contact' })
      : {},
  component: ContactRoute,
})

function ContactRoute() {
  const { service } = Route.useSearch()
  return <Contact service={service} />
}
