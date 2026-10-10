import { createFileRoute } from '@tanstack/react-router'
import type { SearchSchemaInput } from '@tanstack/react-router'

import WorkDetail from '@/components/pages/work-detail'
import { albumQuery } from '@/hooks/api/portfolio'
import { settingsQuery } from '@/hooks/api/site'
import { optionalIndex } from '@/lib/search'
import { albumJsonLd, breadcrumbJsonLd, jsonLd, seo } from '@/lib/seo'


export const Route = createFileRoute('/_primary/work/$slug')({
  validateSearch: (search: { photo?: number } & SearchSchemaInput) => ({ photo: optionalIndex(search.photo) }),
  loader: async ({ context: { queryClient }, params }) => {
    const [settings, data] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery()),
      queryClient.ensureQueryData(albumQuery(params.slug)),
    ])
    return { settings, album: data.album, categoryName: data.category?.name ?? null }
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {}
    const { album, categoryName, settings } = loaderData
    return {
      ...seo({
        settings,
        title: categoryName ? `${album.title} | ${categoryName}` : album.title,
        description: album.summary,
        image: album.cover,
        path: `/work/${params.slug}`,
        type: 'article',
      }),
      scripts: [
        jsonLd(albumJsonLd(album, categoryName)),
        jsonLd(
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: album.title, path: `/work/${params.slug}` },
          ]),
        ),
      ],
    }
  },
  component: WorkDetailRoute,
})

function WorkDetailRoute() {
  const { slug } = Route.useParams()
  const { photo } = Route.useSearch()
  const navigate = Route.useNavigate()
  return (
    <WorkDetail
      slug={slug}
      photo={photo}
      onPhotoChange={(index) =>
        navigate({
          search: (prev) => ({ ...prev, photo: index ?? undefined }),
          resetScroll: false,
          replace: photo !== undefined && index !== null,
        })
      }
    />
  )
}
