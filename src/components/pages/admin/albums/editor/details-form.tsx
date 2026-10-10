import { Field } from '@tanstack/react-form'

import { CategorySelect } from '../create-album-form'
import { FieldShell, useAppForm } from '@/components/ui/custom/form'
import { useAlbumMutations } from '@/hooks/api/admin/albums'
import { withToast } from '@/hooks/use-crud-toast'
import { albumDetailsSchema } from '@/lib/schemas/albums'
import type { AdminAlbum } from '@/hooks/api/admin/albums'
import type { Category } from '@/types'

export function DetailsForm({ album, categories }: { album: AdminAlbum; categories: Array<Category> }) {
  const m = useAlbumMutations()
  const form = useAppForm({
    defaultValues: {
      id: album.id,
      title: album.title,
      slug: album.slug,
      categoryId: album.categoryId ?? '',
      summary: album.summary,
      story: album.story,
      location: album.location,
      shotOn: album.shotOn,
    },
    validators: { onSubmit: albumDetailsSchema },
    onSubmit: async ({ value, formApi }) => {
      const ok = await withToast(m.updateDetails.mutateAsync({ data: value }), 'Album details saved')
      if (ok) formApi.reset(value)
    },
  })

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
      className="rounded-lg border border-line bg-surface"
    >
      <div className="border-b border-line px-5 py-4">
        <h3 className="font-medium">Details</h3>
      </div>
      <div className="grid gap-5 p-5">
        <form.AppField name="title">{(f) => <f.TextField label="Title" maxLength={80} />}</form.AppField>
        <form.AppField name="slug">
          {(f) => <f.TextField label="Web address" maxLength={80} description={`/work/${f.state.value || '...'}`} />}
        </form.AppField>
        <Field form={form} name="categoryId">
          {(field) => (
            <FieldShell label="Category" htmlFor="album-category" errors={[]}>
              <CategorySelect id="album-category" value={field.state.value} onChange={field.handleChange} categories={categories} />
            </FieldShell>
          )}
        </Field>
        <form.AppField name="summary">
          {(f) => <f.TextareaField label="Summary" rows={3} maxLength={240} description="One or two sentences shown at the top of the album." />}
        </form.AppField>
        <form.AppField name="story">
          {(f) => <f.TextareaField label="The story" rows={5} maxLength={1200} hint="Optional" />}
        </form.AppField>
        <div className="grid gap-5 sm:grid-cols-2">
          <form.AppField name="location">{(f) => <f.TextField label="Location" maxLength={80} placeholder="Lekki, Lagos" />}</form.AppField>
          <form.AppField name="shotOn">
            {(f) => <f.TextField label="Date" type="date" className="[&_input]:[color-scheme:dark]" />}
          </form.AppField>
        </div>
      </div>
      <div className="flex justify-end border-t border-line px-5 py-3">
        <form.AppForm>
          <form.UnsavedChangesGuard />
          <form.SubmitButton disableWhenPristine>Save details</form.SubmitButton>
        </form.AppForm>
      </div>
    </form>
  )
}
