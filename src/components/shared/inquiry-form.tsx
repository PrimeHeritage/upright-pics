import { useRef, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { ArrowRight, Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSubmitInquiry } from '@/hooks/api/services'
import { emptyInquiry, inquirySchema } from '@/lib/schemas/inquiry'
import { cn, whatsappLink } from '@/lib/utils'
import type { AnyFieldApi } from '@tanstack/react-form'

const fieldClass =
  'h-12 rounded-none border-0 border-b border-line-strong bg-transparent px-0 text-base shadow-none md:text-base dark:bg-transparent placeholder:text-smoke focus-visible:border-gold focus-visible:ring-0'

interface InquiryFormProps {
  services: Array<string>
  defaultService?: string
  whatsapp: string
  businessName: string
}

export function InquiryForm({ services, defaultService, whatsapp, businessName }: InquiryFormProps) {
  const openedAt = useRef(Date.now())
  const [submittedName, setSubmittedName] = useState<string | null>(null)
  const mutation = useSubmitInquiry()

  const form = useForm({
    defaultValues: {
      ...emptyInquiry,
      service: defaultService && services.includes(defaultService) ? defaultService : '',
    },
    validators: { onSubmit: inquirySchema, onBlur: inquirySchema },
    onSubmit: async ({ value }) => {
      // Errors are shown via mutation.isError; don't leave the rejection unhandled.
      const ok = await mutation
        .mutateAsync({ ...value, elapsedMs: Date.now() - openedAt.current })
        .then(() => true, () => false)
      if (ok) setSubmittedName(value.name.split(' ')[0])
    },
  })

  if (submittedName) {
    return (
      <div className="border border-line bg-surface p-8 md:p-12" role="status">
        <span className="flex size-12 items-center justify-center rounded-full border border-gold/50 text-gold">
          <Check className="size-5" />
        </span>
        <h3 className="mt-8 font-display text-3xl md:text-4xl">Thank you, {submittedName}.</h3>
        <p className="mt-4 max-w-md text-ash">
          Your message is with us. We usually reply within a few hours. If your date is close,
          send us a quick WhatsApp too.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <a
              href={whatsappLink(whatsapp, `Hello ${businessName}, I just sent an enquiry on your website.`)}
              target="_blank"
              rel="noreferrer"
            >
              Chat on WhatsApp
            </a>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              form.reset()
              openedAt.current = Date.now()
              setSubmittedName(null)
            }}
          >
            Send another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
      className="grid gap-x-8 gap-y-8 md:grid-cols-2"
    >
      <form.Field name="name">
        {(field) => (
          <FormField field={field} label="Your name">
            <Input
              id={field.name}
              autoComplete="name"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={hasError(field)}
              className={fieldClass}
            />
          </FormField>
        )}
      </form.Field>

      <form.Field name="phone">
        {(field) => (
          <FormField field={field} label="Phone or WhatsApp">
            <Input
              id={field.name}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={hasError(field)}
              className={fieldClass}
            />
          </FormField>
        )}
      </form.Field>

      <form.Field name="email">
        {(field) => (
          <FormField field={field} label="Email" hint="Optional">
            <Input
              id={field.name}
              type="email"
              autoComplete="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={hasError(field)}
              className={fieldClass}
            />
          </FormField>
        )}
      </form.Field>

      <form.Field name="service">
        {(field) => (
          <FormField field={field} label="Service" hint="Optional">
            <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
              <SelectTrigger
                id={field.name}
                onBlur={field.handleBlur}
                className={cn(fieldClass, 'w-full data-[size=default]:h-12 [&_svg]:opacity-60')}
              >
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        )}
      </form.Field>

      <form.Field name="eventDate">
        {(field) => (
          <FormField field={field} label="Date" hint="Optional">
            <Input
              id={field.name}
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={cn(fieldClass, '[color-scheme:dark]')}
            />
          </FormField>
        )}
      </form.Field>

      <form.Field name="location">
        {(field) => (
          <FormField field={field} label="Location" hint="Optional">
            <Input
              id={field.name}
              placeholder="Venue, area or studio"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={fieldClass}
            />
          </FormField>
        )}
      </form.Field>

      <form.Field name="message">
        {(field) => (
          <FormField field={field} label="Tell us about it" className="md:col-span-2">
            <Textarea
              id={field.name}
              rows={4}
              placeholder="Type of shoot, number of guests, anything we should know"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={hasError(field)}
              className={cn(fieldClass, 'min-h-28 resize-none py-3')}
            />
          </FormField>
        )}
      </form.Field>

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <form.Field name="website">
        {(field) => (
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              tabIndex={-1}
              autoComplete="off"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>

      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-ash">We reply with availability and a quote. No spam, ever.</p>
        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" size="lg" disabled={isSubmitting} className="group">
              {isSubmitting ? 'Sending…' : 'Send enquiry'}
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          )}
        </form.Subscribe>
      </div>

      {mutation.isError ? (
        <p role="alert" className="text-sm text-destructive md:col-span-2">
          {mutation.error.message || 'We couldn’t send that. Please try again or message us on WhatsApp.'}
        </p>
      ) : null}
    </form>
  )
}

function fieldErrors(field: AnyFieldApi): Array<string> {
  return (field.state.meta.errors as Array<unknown>)
    .map((e) => (typeof e === 'string' ? e : (e as { message?: string } | undefined)?.message))
    .filter((m): m is string => Boolean(m))
}

function hasError(field: AnyFieldApi) {
  const attempted = field.state.meta.isBlurred || field.form.state.submissionAttempts > 0
  return attempted && fieldErrors(field).length > 0
}

function FormField({
  field,
  label,
  hint,
  className,
  children,
}: {
  field: AnyFieldApi
  label: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  const errors = hasError(field) ? fieldErrors(field) : []
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={field.name} className="text-label flex justify-between font-normal text-ash">
        <span>{label}</span>
        {hint ? <span className="text-smoke normal-case tracking-normal">{hint}</span> : null}
      </Label>
      {children}
      {errors[0] ? (
        <p className="text-sm text-destructive" role="alert">
          {errors[0]}
        </p>
      ) : null}
    </div>
  )
}
