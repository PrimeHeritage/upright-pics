import { z } from 'zod'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAppForm } from '@/components/ui/custom/form'

const schema = z.object({ alt: z.string().trim().max(200), caption: z.string().trim().max(160) })

export function EditMediaDialog({
  open,
  onOpenChange,
  initial,
  isVideo,
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial: { alt: string; caption: string }
  isVideo: boolean
  onSave: (value: { alt: string; caption: string }) => Promise<unknown>
}) {
  const form = useAppForm({
    defaultValues: initial,
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      await onSave(value)
      onOpenChange(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-line bg-ink">
        <DialogHeader>
          <DialogTitle>{isVideo ? 'Video caption' : 'Photo details'}</DialogTitle>
          <DialogDescription>Captions show under the photo in the full-screen viewer.</DialogDescription>
        </DialogHeader>
        <form
          noValidate
          className="grid gap-5"
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
        >
          {!isVideo ? (
            <form.AppField name="alt">
              {(f) => <f.TextField label="Description" maxLength={200} description="What is in the photo. Helps Google and screen readers." />}
            </form.AppField>
          ) : null}
          <form.AppField name="caption">{(f) => <f.TextField label="Caption" maxLength={160} hint="Optional" />}</form.AppField>
          <form.AppForm>
            <form.SubmitButton className="w-fit">Save</form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  )
}
