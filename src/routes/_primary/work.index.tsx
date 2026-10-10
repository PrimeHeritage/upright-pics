import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import Work from '@/components/pages/work'
import { albumsQuery, categoriesQuery } from '@/hooks/api/portfolio'
import { pageHeaderQuery, settingsQuery } from '@/hooks/api/site'
import { seo } from '@/lib/seo'

const searchSchema = z.object({
  category: z.string().max(60).optional().catch(undefined),
})

export const Route = createFileRoute('/_primary/work/')({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ category: search.category }),
  loader: async ({ context: { queryClient }, deps }) => {
    const [settings, header, categories] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery()),
      queryClient.ensureQueryData(pageHeaderQuery('work')),
      queryClient.ensureQueryData(categoriesQuery()),
      queryClient.ensureQueryData(albumsQuery({ category: deps.category })),
    ])
    const category = categories.find((c) => c.slug === deps.category)
    return { settings, header, category: category?.name }
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo({
          settings: loaderData.settings,
          title: loaderData.category ? `${loaderData.category} photography` : 'Work',
          description: loaderData.header.body,
          path: '/work',
        })
      : {},
  component: WorkRoute,
})

function WorkRoute() {
  const { category } = Route.useSearch()
  return <Work category={category} />
}
