import { useAppForm } from '@/components/ui/custom/form'
import { testimonialSchema } from '@/lib/schemas/catalog'
import type { TestimonialInput } from '@/lib/schemas/catalog'

export function TestimonialForm({
  initial,
  isNew,
  onSubmit,
}: {
  initial: TestimonialInput
  isNew: boolean
  onSubmit: (value: TestimonialInput) => Promise<unknown>
}) {
  const form = useAppForm({
    defaultValues: initial,
    validators: { onSubmit: testimonialSchema },
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
      <form.AppField name="quote">
        {(f) => <f.TextareaField label="Quote" rows={4} maxLength={300} description="Short quotes read best: two or three sentences." />}
      </form.AppField>
      <form.AppField name="clientName">
        {(f) => <f.TextField label="Client name" maxLength={60} placeholder="e.g. Adaeze & Tunde" />}
      </form.AppField>
      <form.AppField name="context">
        {(f) => <f.TextField label="Occasion" maxLength={80} placeholder="e.g. Traditional wedding" hint="Optional" />}
      </form.AppField>
      <form.AppField name="visible">{(f) => <f.SwitchField label="Show on website" />}</form.AppField>
      <form.AppForm>
        <form.SubmitButton className="w-fit">{isNew ? 'Add testimonial' : 'Save testimonial'}</form.SubmitButton>
      </form.AppForm>
    </form>
  )
}
