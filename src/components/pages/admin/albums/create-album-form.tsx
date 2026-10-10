import { Field } from '@tanstack/react-form'

import { FieldShell, useAppForm } from '@/components/ui/custom/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createAlbumSchema } from '@/lib/schemas/albums'
import type { CreateAlbumInput } from '@/lib/schemas/albums'
import type { Category } from '@/types'

const NONE = 'none'

export function CategorySelect({
  id,
  value,
  onChange,
  categories,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  categories: Array<Category>
}) {
  return (
    <Select value={value || NONE} onValueChange={(v) => onChange(v === NONE ? '' : v)}>
      <SelectTrigger id={id} className="h-11 w-full border-line-strong bg-surface">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE}>No category</SelectItem>
        {categories.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function CreateAlbumForm({
  categories,
  onSubmit,
}: {
  categories: Array<Category>
  onSubmit: (value: CreateAlbumInput) => Promise<unknown>
}) {
  const form = useAppForm({
    defaultValues: { title: '', categoryId: '' },
    validators: { onSubmit: createAlbumSchema },
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
      <form.AppField name="title">
        {(f) => <f.TextField label="Album title" maxLength={80} placeholder="e.g. Tolu & Femi's Engagement" autoFocus />}
      </form.AppField>
      <Field form={form} name="categoryId">
        {(field) => (
          <FieldShell label="Category" htmlFor="new-album-category" errors={[]}>
            <CategorySelect id="new-album-category" value={field.state.value} onChange={field.handleChange} categories={categories} />
          </FieldShell>
        )}
      </Field>
      <p className="text-sm text-ash">You will add photos on the next screen. New albums stay hidden until you publish them.</p>
      <form.AppForm>
        <form.SubmitButton className="w-fit" pendingLabel="Creating…">
          Create album
        </form.SubmitButton>
      </form.AppForm>
    </form>
  )
}
