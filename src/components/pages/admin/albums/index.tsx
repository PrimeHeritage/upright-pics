import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Images, Plus, Star } from 'lucide-react'

import { CreateAlbumForm } from './create-album-form'
import { MediaImage } from '@/components/shared/media-image'
import { EditSheet } from '@/components/shared/admin/edit-sheet'
import { AdminPageHeader } from '@/components/shared/admin/page-header'
import { EmptyState, SortableRows } from '@/components/shared/admin/sortable-rows'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { adminAlbumsQuery, useAlbumMutations } from '@/hooks/api/admin/albums'
import { adminCategoriesQuery } from '@/hooks/api/admin/catalog'
import { withToast } from '@/hooks/use-crud-toast'
import { cn } from '@/lib/utils'

export default function Albums() {
  const { data: albums } = useSuspenseQuery(adminAlbumsQuery())
  const { data: categories } = useSuspenseQuery(adminCategoriesQuery())
  const m = useAlbumMutations()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)

  const addButton = (
    <Button onClick={() => setCreating(true)}>
      <Plus /> New album
    </Button>
  )

  return (
    <div className="max-w-4xl">
      <AdminPageHeader
        title="Albums"
        description="Drag to set the order on the Work page. Starred albums appear on the homepage."
        actions={addButton}
      />

      <SortableRows
        items={albums}
        onReorder={(rows) => m.reorder.mutate(rows)}
        onEdit={(a) => void navigate({ to: '/admin/albums/$albumId', params: { albumId: a.id } })}
        onDelete={(a) => void withToast(m.remove.mutateAsync({ data: { id: a.id } }), 'Album deleted')}
        deleteCopy={(a) => ({
          title: `Delete "${a.title}"?`,
          description: `This permanently deletes the album and its ${a.mediaCount} photo${a.mediaCount === 1 ? '' : 's'}/video${a.mediaCount === 1 ? '' : 's'}. This cannot be undone.`,
        })}
        visibility={{
          isVisible: (a) => a.published,
          onChange: (a, published) =>
            void withToast(m.setFlags.mutateAsync({ data: { id: a.id, published } }), published ? 'Album published' : 'Album hidden'),
        }}
        renderActions={(a) => (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-pressed={a.featured}
            aria-label={a.featured ? 'Remove from homepage' : 'Feature on homepage'}
            title={a.featured ? 'Featured on homepage' : 'Feature on homepage'}
            onClick={() =>
              void withToast(
                m.setFlags.mutateAsync({ data: { id: a.id, featured: !a.featured } }),
                a.featured ? 'Removed from homepage' : 'Featured on homepage',
              )
            }
            className={a.featured ? 'text-gold' : 'text-smoke'}
          >
            <Star className={cn(a.featured && 'fill-gold')} />
          </Button>
        )}
        renderLeading={(a) => (
          <div className="relative h-14 w-11 overflow-hidden rounded bg-surface-2">
            {a.cover ? <MediaImage image={a.cover} fill sizes="44px" /> : <Images className="m-auto mt-4 size-5 text-smoke" />}
          </div>
        )}
        renderMain={(a) => (
          <>
            <p className="flex items-center gap-2 truncate font-medium">
              {a.title}
              {!a.published ? <Badge variant="outline" className="border-line-strong text-ash">Hidden</Badge> : null}
            </p>
            <p className="truncate text-xs text-ash">
              {[a.categoryName ?? 'No category', `${a.mediaCount} item${a.mediaCount === 1 ? '' : 's'}`].join(' · ')}
            </p>
          </>
        )}
        empty={<EmptyState icon={Images} title="No albums yet" body="Create your first album and upload photos to it." action={addButton} />}
      />

      <EditSheet open={creating} onOpenChange={setCreating} title="New album">
        {creating ? (
          <CreateAlbumForm
            categories={categories}
            onSubmit={async (value) => {
              const result = await withToast(m.create.mutateAsync({ data: value }), 'Album created')
              if (result) {
                setCreating(false)
                await navigate({ to: '/admin/albums/$albumId', params: { albumId: result.id } })
              }
            }}
          />
        ) : null}
      </EditSheet>
    </div>
  )
}
