import { useAppForm } from '@/components/ui/custom/form'
import { serviceSchema } from '@/lib/schemas/catalog'
import { slugify } from '@/lib/utils'
import type { ServiceInput } from '@/lib/schemas/catalog'

export function ServiceForm({
  initial,
  isNew,
  onSubmit,
}: {
  initial: ServiceInput
  isNew: boolean
  onSubmit: (value: ServiceInput) => Promise<unknown>
}) {
  const form = useAppForm({
    defaultValues: initial,
    validators: { onSubmit: serviceSchema },
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
        name="title"
        listeners={{
          onChange: ({ value }) => {
            if (isNew && !form.getFieldMeta('slug')?.isDirty) form.setFieldValue('slug', slugify(value), { dontUpdateMeta: true })
          },
        }}
      >
        {(f) => <f.TextField label="Service name" maxLength={60} />}
      </form.AppField>
      <form.AppField name="slug">
        {(f) => <f.TextField label="Web address" description="Links straight to this service, e.g. /services#drone-piloting" maxLength={60} />}
      </form.AppField>
      <form.AppField name="summary">
        {(f) => <f.TextareaField label="One-line summary" rows={2} maxLength={160} description="Shown in the services list on the homepage." />}
      </form.AppField>
      <form.AppField name="body">
        {(f) => <f.TextareaField label="More detail" rows={4} maxLength={600} hint="Optional" description="Shown on the Services page." />}
      </form.AppField>
      <form.AppField name="cover">
        {(f) => <f.ImageField label="Photo" folder="services" aspect="portrait" />}
      </form.AppField>
      <form.AppField name="visible">
        {(f) => <f.SwitchField label="Show on website" />}
      </form.AppField>
      <form.AppForm>
        <form.SubmitButton className="w-fit">{isNew ? 'Add service' : 'Save service'}</form.SubmitButton>
      </form.AppForm>
    </form>
  )
}
