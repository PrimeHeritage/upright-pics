import { createFileRoute, notFound } from '@tanstack/react-router'

import AlbumEditor from '@/components/pages/admin/albums/editor'
import { adminAlbumQuery } from '@/hooks/api/admin/albums'
import { adminCategoriesQuery } from '@/hooks/api/admin/catalog'
import { isUuid } from '@/lib/search'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/albums/$albumId')({
  loader: async ({ context, params }) => {
    if (!isUuid(params.albumId)) throw notFound()
    const [album] = await Promise.all([
      context.queryClient.ensureQueryData(adminAlbumQuery(params.albumId)),
      context.queryClient.ensureQueryData(adminCategoriesQuery()),
    ])
    return { title: album.title }
  },
  head: ({ loaderData }) => adminHead(loaderData?.title ?? 'Album'),
  component: AlbumEditorRoute,
})

function AlbumEditorRoute() {
  const { albumId } = Route.useParams()
  return <AlbumEditor albumId={albumId} />
}
