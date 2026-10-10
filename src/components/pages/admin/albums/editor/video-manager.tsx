import { PlayCircle, Plus, Trash2 } from 'lucide-react'
import { z } from 'zod'

import { ConfirmDelete } from '@/components/shared/admin/confirm-delete'
import { Button } from '@/components/ui/button'
import { useAppForm } from '@/components/ui/custom/form'
import { useMediaMutations } from '@/hooks/api/admin/albums'
import { withToast } from '@/hooks/use-crud-toast'
import { parseVideoUrl, videoThumbnail } from '@/lib/media'
import type { AdminAlbum } from '@/hooks/api/admin/albums'

const schema = z.object({
  url: z
    .string()
    .trim()
    .max(300)
    .refine((v) => parseVideoUrl(v) !== null, 'Paste a YouTube or Vimeo link'),
  caption: z.string().trim().max(160),
})

export function VideoManager({ album }: { album: AdminAlbum }) {
  const m = useMediaMutations(album.id)
  const videos = album.media.filter((x) => x.kind === 'video')

  const form = useAppForm({
    defaultValues: { url: '', caption: '' },
    validators: { onSubmit: schema },
    onSubmit: async ({ value, formApi }) => {
      const ok = await withToast(m.addVideo.mutateAsync({ data: { albumId: album.id, ...value } }), 'Video added')
      if (ok) formApi.reset()
    },
  })

  return (
    <section className="rounded-lg border border-line bg-surface">
      <div className="border-b border-line px-5 py-4">
        <h3 className="font-medium">Videos</h3>
        <p className="mt-1 text-sm text-ash">Add films from YouTube or Vimeo. They play above the photos.</p>
      </div>
      <div className="grid gap-5 p-5">
        {videos.length > 0 ? (
          <ul className="grid gap-3">
            {videos.map((v) => {
              const source = parseVideoUrl(v.videoUrl)
              const thumb = source ? videoThumbnail(source) : null
              return (
                <li key={v.id} className="flex items-center gap-3 rounded-md border border-line p-2">
                  <div className="relative flex aspect-video w-28 shrink-0 items-center justify-center overflow-hidden rounded bg-surface-2">
                    {thumb ? <img src={thumb} alt="" className="absolute inset-0 size-full object-cover" loading="lazy" /> : null}
                    <PlayCircle className="relative size-6 text-paper drop-shadow" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{v.caption || 'Untitled video'}</p>
                    <a href={v.videoUrl} target="_blank" rel="noreferrer" className="truncate text-xs text-ash hover:text-paper">
                      {v.videoUrl}
                    </a>
                  </div>
                  <ConfirmDelete
                    title="Remove this video?"
                    description="The video stays on YouTube or Vimeo; it is only removed from this album."
                    confirmLabel="Remove"
                    onConfirm={() => void withToast(m.remove.mutateAsync({ data: { id: v.id } }), 'Video removed')}
                    trigger={
                      <Button type="button" variant="ghost" size="icon" className="text-ash hover:text-destructive" aria-label="Remove video">
                        <Trash2 />
                      </Button>
                    }
                  />
                </li>
              )
            })}
          </ul>
        ) : null}
        <form
          noValidate
          className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,14rem)_auto] sm:items-start"
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
        >
          <form.AppField name="url">
            {(f) => <f.TextField label="Video link" type="url" inputMode="url" placeholder="https://youtu.be/..." />}
          </form.AppField>
          <form.AppField name="caption">{(f) => <f.TextField label="Caption" maxLength={160} hint="Optional" />}</form.AppField>
          <form.AppForm>
            <form.SubmitButton className="sm:mt-[1.85rem]" pendingLabel="Adding…">
              <Plus /> Add
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </div>
    </section>
  )
}
