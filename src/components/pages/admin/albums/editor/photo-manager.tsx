import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { GripVertical, ImagePlus, Loader2, MoreHorizontal, Pencil, Star, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { EditMediaDialog } from './edit-media-dialog'
import { MediaImage } from '@/components/shared/media-image'
import { ConfirmDelete } from '@/components/shared/admin/confirm-delete'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SortableList } from '@/components/ui/custom/sortable-list'
import { useMediaMutations } from '@/hooks/api/admin/albums'
import { withToast } from '@/hooks/use-crud-toast'
import { ACCEPT_ATTR, uploadImage } from '@/lib/cloudinary-upload'
import { cn } from '@/lib/utils'
import { addPhotos } from '@/server/functions/admin/albums'
import type { AdminAlbum } from '@/hooks/api/admin/albums'
import type { ImageAsset } from '@/types'

type Photo = Extract<AdminAlbum['media'][number], { kind: 'image' }>

export function PhotoManager({ album }: { album: AdminAlbum }) {
  const queryClient = useQueryClient()
  const m = useMediaMutations(album.id)
  const input = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<{ done: number; total: number; fraction: number } | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [editing, setEditing] = useState<Photo | null>(null)

  const photos = album.media.filter((item): item is Photo => item.kind === 'image')
  const others = album.media.filter((item) => item.kind !== 'image')
  const isCover = (p: Photo) =>
    !!album.cover && (album.cover.publicId ? album.cover.publicId === p.image.publicId : album.cover.src === p.image.src)

  const uploadFiles = async (files: Array<File>) => {
    const images = files.filter((f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name))
    if (images.length === 0) return
    let failed = 0
    setStatus({ done: 0, total: images.length, fraction: 0 })
    for (const [i, file] of images.entries()) {
      try {
        const asset: ImageAsset = await uploadImage(file, `albums/${album.id}`, (fraction) =>
          setStatus({ done: i, total: images.length, fraction }),
        )
        // Save each photo as soon as it uploads so nothing is lost if the page closes.
        await addPhotos({ data: { albumId: album.id, images: [{ ...asset, alt: album.title }] } })
      } catch (err) {
        failed++
        toast.error(`${file.name}: ${err instanceof Error ? err.message : 'upload failed'}`)
      }
      setStatus({ done: i + 1, total: images.length, fraction: 0 })
      if ((i + 1) % 4 === 0) void queryClient.invalidateQueries({ queryKey: ['admin', 'album', album.id] })
    }
    setStatus(null)
    await Promise.all(
      [['admin', 'album', album.id], ['admin', 'albums'], ['albums'], ['album']].map((queryKey) =>
        queryClient.invalidateQueries({ queryKey }),
      ),
    )
    const added = images.length - failed
    if (added > 0) toast.success(`${added} photo${added === 1 ? '' : 's'} added`)
  }

  return (
    <section className="rounded-lg border border-line bg-surface">
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <div>
          <h3 className="font-medium">Photos</h3>
          <p className="mt-1 text-sm text-ash">
            {photos.length} photo{photos.length === 1 ? '' : 's'}. Drag to reorder.
          </p>
        </div>
        <Button type="button" onClick={() => input.current?.click()} disabled={status !== null}>
          <ImagePlus /> Add photos
        </Button>
      </div>

      <input
        ref={input}
        type="file"
        accept={ACCEPT_ATTR}
        multiple
        hidden
        onChange={(e) => {
          void uploadFiles(Array.from(e.target.files ?? []))
          e.target.value = ''
        }}
      />

      <div
        className="p-5"
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes('Files')) {
            e.preventDefault()
            setDragOver(true)
          }
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          if (!e.dataTransfer.files.length) return
          e.preventDefault()
          setDragOver(false)
          void uploadFiles(Array.from(e.dataTransfer.files))
        }}
      >
        {status ? (
          <div className="mb-5 rounded-md border border-gold/30 bg-gold/5 p-4" role="status">
            <div className="flex items-center gap-3 text-sm">
              <Loader2 className="size-4 animate-spin text-gold" />
              Uploading photo {Math.min(status.done + 1, status.total)} of {status.total}… keep this page open.
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-paper/10">
              <div
                className="h-full bg-gold transition-[width]"
                style={{ width: `${((status.done + status.fraction) / status.total) * 100}%` }}
              />
            </div>
          </div>
        ) : null}

        {photos.length === 0 && !status ? (
          <button
            type="button"
            onClick={() => input.current?.click()}
            className={cn(
              'flex w-full flex-col items-center justify-center gap-3 rounded-md border border-dashed border-line-strong px-6 py-16 text-center text-ash transition-colors hover:border-gold/60 hover:text-paper',
              dragOver && 'border-gold bg-gold/5 text-paper',
            )}
          >
            <Upload className="size-7" strokeWidth={1.5} />
            <span className="font-medium text-paper">Drop photos here or click to choose</span>
            <span className="text-sm">JPG, PNG, WebP or HEIC. Large files are resized automatically.</span>
          </button>
        ) : (
          <div className={cn('rounded-md transition-colors', dragOver && 'outline-2 outline-gold outline-dashed')}>
            <SortableList
              items={photos}
              getId={(p) => p.id}
              layout="grid"
              onReorder={(next) => m.reorder.mutate([...next, ...others])}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4"
              renderItem={(photo, handle) => (
                <div className="group relative aspect-[4/5] overflow-hidden rounded-md border border-line bg-surface-2">
                  <MediaImage image={photo.image} fill sizes="240px" />
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-1.5">
                    <button
                      type="button"
                      {...handle.attributes}
                      {...handle.listeners}
                      aria-label="Drag to reorder"
                      className="flex size-8 cursor-grab touch-none items-center justify-center rounded-md bg-ink/70 text-paper active:cursor-grabbing"
                    >
                      <GripVertical className="size-4" />
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          aria-label="Photo options"
                          className="flex size-8 items-center justify-center rounded-md bg-ink/70 text-paper"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          disabled={isCover(photo)}
                          onSelect={() =>
                            void withToast(m.setCover.mutateAsync({ data: { albumId: album.id, image: photo.image } }), 'Cover updated')
                          }
                        >
                          <Star /> Set as cover
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setEditing(photo)}>
                          <Pencil /> Description & caption
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <ConfirmDelete
                          title="Delete this photo?"
                          description={isCover(photo) ? 'It stays as the album cover until you choose another.' : 'This cannot be undone.'}
                          onConfirm={() => void withToast(m.remove.mutateAsync({ data: { id: photo.id } }), 'Photo deleted')}
                          trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                              <Trash2 /> Delete
                            </DropdownMenuItem>
                          }
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {isCover(photo) ? (
                    <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded bg-gold px-1.5 py-0.5 text-[0.65rem] text-ink">
                      <Star className="size-3 fill-ink" /> Cover
                    </span>
                  ) : null}
                  {photo.caption ? (
                    <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-ink/90 px-2 pt-6 pb-1.5 text-xs">
                      {photo.caption}
                    </span>
                  ) : null}
                </div>
              )}
            />
          </div>
        )}
      </div>

      {editing ? (
        <EditMediaDialog
          key={editing.id}
          open
          onOpenChange={(o) => !o && setEditing(null)}
          isVideo={false}
          initial={{ alt: editing.image.alt, caption: editing.caption ?? '' }}
          onSave={(v) => withToast(m.update.mutateAsync({ data: { id: editing.id, ...v } }), 'Photo updated')}
        />
      ) : null}
    </section>
  )
}
