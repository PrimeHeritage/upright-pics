import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import WorkDetail from '@/components/pages/work-detail'
import { albumQuery } from '@/hooks/api/portfolio'
import { settingsQuery } from '@/hooks/api/site'
import { seo } from '@/lib/seo'

const searchSchema = z.object({
  photo: z.number().int().min(0).optional().catch(undefined),
})

export const Route = createFileRoute('/_primary/work/$slug')({
  validateSearch: searchSchema,
  loader: async ({ context: { queryClient }, params }) => {
    const [settings, data] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery()),
      queryClient.ensureQueryData(albumQuery(params.slug)),
    ])
    return { settings, album: { title: data.album.title, summary: data.album.summary, cover: data.album.cover } }
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {}
    return seo({
      settings: loaderData.settings,
      title: loaderData.album.title,
      description: loaderData.album.summary,
      image: loaderData.album.cover,
      path: `/work/${params.slug}`,
    })
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
