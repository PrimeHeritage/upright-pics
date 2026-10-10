import { useAppForm } from '@/components/ui/custom/form'
import { categorySchema } from '@/lib/schemas/catalog'
import { slugify } from '@/lib/utils'
import type { CategoryInput } from '@/lib/schemas/catalog'

export function CategoryForm({
  initial,
  isNew,
  onSubmit,
}: {
  initial: CategoryInput
  isNew: boolean
  onSubmit: (value: CategoryInput) => Promise<unknown>
}) {
  const form = useAppForm({
    defaultValues: initial,
    validators: { onSubmit: categorySchema },
    onSubmit: ({ value }) => onSubmit(value),
  })

  return (
    <form
      noValidate
      className="grid gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.AppField
        name="name"
        listeners={{
          onChange: ({ value }) => {
            if (isNew && !form.getFieldMeta('slug')?.isDirty) form.setFieldValue('slug', slugify(value), { dontUpdateMeta: true })
          },
        }}
      >
        {(f) => <f.TextField label="Name" maxLength={40} autoFocus />}
      </form.AppField>
      <form.AppField name="slug">
        {(f) => <f.TextField label="Web address" description="Used in links, e.g. /work?category=weddings" maxLength={60} />}
      </form.AppField>
      <form.AppField name="description">
        {(f) => <f.TextareaField label="Description" rows={2} maxLength={200} hint="Optional" />}
      </form.AppField>
      <form.AppForm>
        <form.SubmitButton className="w-fit">{isNew ? 'Add category' : 'Save category'}</form.SubmitButton>
      </form.AppForm>
    </form>
  )
}
