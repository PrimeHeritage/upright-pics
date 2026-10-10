import { toast } from 'sonner'

import { useUpdateContent } from '@/hooks/api/admin/content'
import type { UpdateContentInput } from '@/lib/schemas/content'

/** Card wrapper for one independently-saved content section. */
export function SectionCard({
  title,
  description,
  onSubmit,
  footer,
  children,
}: {
  title: string
  description?: string
  onSubmit: () => void
  footer: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className="rounded-lg border border-line bg-surface"
    >
      <div className="border-b border-line px-5 py-4">
        <h3 className="font-medium">{title}</h3>
        {description ? <p className="mt-1 text-sm text-ash">{description}</p> : null}
      </div>
      <div className="grid gap-5 p-5">{children}</div>
      <div className="flex justify-end border-t border-line px-5 py-3">{footer}</div>
    </form>
  )
}

/** Returns a submit handler that saves one section and resets the form to the saved values. */
export function useSaveSection<TKey extends UpdateContentInput['key']>(key: TKey) {
  const update = useUpdateContent()
  return async (data: Extract<UpdateContentInput, { key: TKey }>['data'], reset: () => void) => {
    try {
      await update.mutateAsync({ key, data } as UpdateContentInput)
      reset()
      toast.success('Saved. The website updates within a minute.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save')
    }
  }
}
