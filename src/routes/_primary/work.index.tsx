import { createFileRoute } from '@tanstack/react-router'
import type { SearchSchemaInput } from '@tanstack/react-router'

import Work from '@/components/pages/work'
import { albumsQuery, categoriesQuery } from '@/hooks/api/portfolio'
import { pageHeaderQuery, settingsQuery } from '@/hooks/api/site'
import { optionalString } from '@/lib/search'
import { breadcrumbJsonLd, jsonLd, seo } from '@/lib/seo'


export const Route = createFileRoute('/_primary/work/')({
  validateSearch: (search: { category?: string } & SearchSchemaInput) => ({ category: optionalString(search.category, 60) }),
  loaderDeps: ({ search }) => ({ category: search.category }),
  loader: async ({ context: { queryClient }, deps }) => {
    const [settings, header, categories] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery()),
      queryClient.ensureQueryData(pageHeaderQuery('work')),
      queryClient.ensureQueryData(categoriesQuery()),
      queryClient.ensureQueryData(albumsQuery({ category: deps.category })),
    ])
    const category = categories.find((c) => c.slug === deps.category)
    return { settings, header, category: category?.name, slug: category?.slug }
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          ...seo({
            settings: loaderData.settings,
            title: loaderData.category
              ? `${loaderData.category} | Photography in Lagos`
              : 'Photography Portfolio: Weddings, Portraits & Events',
            description: loaderData.header.body,
            path: loaderData.category ? `/work?category=${loaderData.slug}` : '/work',
          }),
          scripts: [jsonLd(breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Work', path: '/work' }]))],
        }
      : {},
  component: WorkRoute,
})

function WorkRoute() {
  const { category } = Route.useSearch()
  return <Work category={category} />
}
