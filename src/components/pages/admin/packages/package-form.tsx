import { Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { FieldShell, useAppForm } from '@/components/ui/custom/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { packageSchema } from '@/lib/schemas/catalog'
import type { PackageInput } from '@/lib/schemas/catalog'
import type { Service } from '@/types'

const NONE = 'none'

export function PackageForm({
  initial,
  isNew,
  services,
  onSubmit,
}: {
  initial: PackageInput
  isNew: boolean
  services: Array<Service>
  onSubmit: (value: PackageInput) => Promise<unknown>
}) {
  const form = useAppForm({
    defaultValues: initial,
    validators: { onSubmit: packageSchema },
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
      <form.AppField name="name">{(f) => <f.TextField label="Package name" maxLength={60} />}</form.AppField>
      <form.AppField name="description">
        {(f) => <f.TextField label="Who it is for" maxLength={160} hint="Optional" />}
      </form.AppField>
      <form.AppField name="priceLabel">
        {(f) => (
          <f.TextField
            label="Price"
            maxLength={40}
            placeholder="From ₦150,000"
            description='Free text, e.g. "From ₦150,000". Leave blank for "Price on request".'
          />
        )}
      </form.AppField>

      <form.Field name="serviceId">
        {(field) => (
          <FieldShell label="Linked service" htmlFor="serviceId" errors={[]} description="Pre-selects this service when someone books from the package.">
            <Select value={field.state.value || NONE} onValueChange={(v) => field.handleChange(v === NONE ? '' : v)}>
              <SelectTrigger id="serviceId" className="h-11 w-full border-line-strong bg-surface">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>No linked service</SelectItem>
                {services.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldShell>
        )}
      </form.Field>

      <form.Field name="features" mode="array">
        {(features) => (
          <div className="grid gap-2">
            <p className="text-sm font-medium">What is included</p>
            {features.state.value.map((_, i) => (
              <div key={i} className="flex items-start gap-2">
                <form.AppField name={`features[${i}]`}>
                  {(f) => <f.TextField label={`Item ${i + 1}`} maxLength={80} className="flex-1 [&_label]:sr-only" />}
                </form.AppField>
                <Button type="button" variant="ghost" size="icon" className="mt-1 text-ash" onClick={() => features.removeValue(i)} aria-label={`Remove item ${i + 1}`}>
                  <X />
                </Button>
              </div>
            ))}
            {features.state.value.length < 8 ? (
              <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => features.pushValue('')}>
                <Plus /> Add item
              </Button>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.AppField name="highlighted">
        {(f) => <f.SwitchField label="Highlight this package" description="Adds a gold accent so it stands out." />}
      </form.AppField>
      <form.AppField name="visible">{(f) => <f.SwitchField label="Show on website" />}</form.AppField>
      <form.AppForm>
        <form.SubmitButton className="w-fit">{isNew ? 'Add package' : 'Save package'}</form.SubmitButton>
      </form.AppForm>
    </form>
  )
}
