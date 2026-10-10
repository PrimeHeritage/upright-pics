import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ExternalLink, Star, Trash2 } from 'lucide-react'

import { DetailsForm } from './details-form'
import { PhotoManager } from './photo-manager'
import { VideoManager } from './video-manager'
import { ConfirmDelete } from '@/components/shared/admin/confirm-delete'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { adminAlbumQuery, useAlbumMutations } from '@/hooks/api/admin/albums'
import { adminCategoriesQuery } from '@/hooks/api/admin/catalog'
import { withToast } from '@/hooks/use-crud-toast'
import { cn } from '@/lib/utils'

export default function AlbumEditor({ albumId }: { albumId: string }) {
  const { data: album } = useSuspenseQuery(adminAlbumQuery(albumId))
  const { data: categories } = useSuspenseQuery(adminCategoriesQuery())
  const m = useAlbumMutations()
  const navigate = useNavigate()
  const photoCount = album.media.filter((x) => x.kind === 'image').length

  return (
    <div className="max-w-6xl">
      <Link to="/admin/albums" className="inline-flex items-center gap-1.5 text-sm text-ash hover:text-paper">
        <ArrowLeft className="size-4" /> All albums
      </Link>

      <div className="mt-4 mb-8 flex flex-col gap-5 2xl:flex-row 2xl:items-end 2xl:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-3xl text-balance md:text-4xl">{album.title}</h2>
          <p className="mt-2 text-sm text-ash">
            {album.published ? 'Published on the website.' : 'Hidden from the website.'}{' '}
            {album.featured ? 'Featured on the homepage.' : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2">
            <Switch
              id="album-published"
              checked={album.published}
              disabled={photoCount === 0 && !album.published}
              onCheckedChange={(published) =>
                void withToast(m.setFlags.mutateAsync({ data: { id: album.id, published } }), published ? 'Album published' : 'Album hidden')
              }
            />
            <Label htmlFor="album-published" className="text-sm">
              {photoCount === 0 && !album.published ? 'Add photos to publish' : 'Published'}
            </Label>
          </div>
          <Button
            type="button"
            variant="outline"
            aria-pressed={album.featured}
            onClick={() =>
              void withToast(
                m.setFlags.mutateAsync({ data: { id: album.id, featured: !album.featured } }),
                album.featured ? 'Removed from homepage' : 'Featured on homepage',
              )
            }
            className={cn(album.featured && 'border-gold/50 text-gold')}
          >
            <Star className={cn(album.featured && 'fill-gold')} /> {album.featured ? 'Featured' : 'Feature'}
          </Button>
          {album.published ? (
            <Button asChild variant="ghost">
              <a href={`/work/${album.slug}`} target="_blank" rel="noreferrer">
                <ExternalLink /> View
              </a>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="grid min-w-0 content-start gap-6">
          <PhotoManager album={album} />
          <VideoManager album={album} />
        </div>
        <div className="grid min-w-0 content-start gap-6">
          <DetailsForm key={album.id} album={album} categories={categories} />
          <section className="rounded-lg border border-destructive/30 p-5">
            <h3 className="font-medium">Delete album</h3>
            <p className="mt-1 text-sm text-ash">Permanently removes the album and all of its photos.</p>
            <ConfirmDelete
              title={`Delete "${album.title}"?`}
              description={`All ${album.media.length} photos and videos in this album will be deleted. This cannot be undone.`}
              onConfirm={async () => {
                const ok = await withToast(m.remove.mutateAsync({ data: { id: album.id } }), 'Album deleted')
                if (ok) await navigate({ to: '/admin/albums' })
              }}
              trigger={
                <Button type="button" variant="outline" className="mt-4 border-destructive/40 text-destructive hover:bg-destructive/10">
                  <Trash2 /> Delete album
                </Button>
              }
            />
          </section>
        </div>
      </div>
    </div>
  )
}
