import { useSuspenseQuery } from '@tanstack/react-query'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'

import { FormSection } from '@/components/shared/admin/form-section'
import { Button } from '@/components/ui/button'
import { useAppForm } from '@/components/ui/custom/form'
import { adminSettingsQuery, useUpdateSettings } from '@/hooks/api/admin/settings'
import { settingsSchema } from '@/lib/schemas/settings'

const SOCIALS = [
  { key: 'instagram', label: 'Instagram', placeholder: 'https://www.instagram.com/yourname' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://www.tiktok.com/@yourname' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://www.youtube.com/@yourname' },
  { key: 'x', label: 'X (Twitter)', placeholder: 'https://x.com/yourname' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://www.facebook.com/yourpage' },
] as const

export default function GeneralSettings() {
  const { data } = useSuspenseQuery(adminSettingsQuery())
  const update = useUpdateSettings()

  const form = useAppForm({
    defaultValues: data,
    validators: { onSubmit: settingsSchema },
    onSubmit: async ({ value, formApi }) => {
      try {
        await update.mutateAsync(value)
        formApi.reset(value)
        toast.success('Settings saved. The website updates within a minute.')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Could not save settings')
      }
    },
  })

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.AppForm>
        <form.UnsavedChangesGuard />
      </form.AppForm>

      <FormSection title="Business" description="Your name and tagline appear in the header, footer and search results.">
        <form.AppField name="businessName">{(f) => <f.TextField label="Business name" maxLength={80} />}</form.AppField>
        <div className="grid gap-5 sm:grid-cols-[10rem_1fr]">
          <form.AppField name="shortName">
            {(f) => <f.TextField label="Short name" maxLength={12} description="e.g. UPC" />}
          </form.AppField>
          <form.AppField name="tagline">{(f) => <f.TextField label="Tagline" maxLength={120} />}</form.AppField>
        </div>
        <form.AppField name="logo">
          {(f) => (
            <f.ImageField
              label="Logo"
              folder="site"
              aspect="square"
              description="Square image works best. Shown as a small round badge."
            />
          )}
        </form.AppField>
      </FormSection>

      <FormSection title="Contact" description="Shown on the Contact page, in the footer and on every WhatsApp button.">
        <form.AppField name="email">
          {(f) => <f.TextField label="Email" type="email" inputMode="email" autoComplete="off" />}
        </form.AppField>

        <form.Field name="phones" mode="array">
          {(phones) => (
            <div className="grid gap-3">
              {phones.state.value.map((_, i) => (
                <div key={i} className="flex items-end gap-2">
                  <form.AppField name={`phones[${i}]`}>
                    {(f) => <f.TextField label={`Phone ${i + 1}`} type="tel" inputMode="tel" className="flex-1" />}
                  </form.AppField>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mb-0.5 text-ash"
                    onClick={() => phones.removeValue(i)}
                    aria-label={`Remove phone ${i + 1}`}
                  >
                    <X />
                  </Button>
                </div>
              ))}
              {phones.state.value.length < 3 ? (
                <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => phones.pushValue('')}>
                  <Plus /> Add phone number
                </Button>
              ) : null}
            </div>
          )}
        </form.Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <form.AppField name="whatsapp">
            {(f) => (
              <f.TextField label="WhatsApp number" type="tel" inputMode="tel" description="Used for all WhatsApp buttons." />
            )}
          </form.AppField>
          <form.AppField name="location">{(f) => <f.TextField label="Location" placeholder="Lagos, Nigeria" />}</form.AppField>
        </div>
      </FormSection>

      <FormSection title="Social media" description="Paste the full link to each profile. Leave blank to hide it.">
        {SOCIALS.map((s) => (
          <form.AppField key={s.key} name={`socials.${s.key}`}>
            {(f) => <f.TextField label={s.label} type="url" inputMode="url" placeholder={s.placeholder} />}
          </form.AppField>
        ))}
      </FormSection>

      <FormSection
        id="visibility"
        title="On the website"
        description="Switch whole sections on or off. Hidden sections disappear everywhere on the site."
      >
        <form.AppField name="showPackages">
          {(f) => <f.SwitchField label="Show packages" description="The Packages section on the homepage and Services page." />}
        </form.AppField>
        <form.Subscribe selector={(s) => s.values.showPackages}>
          {(on) => (
            <form.AppField name="showPrices">
              {(f) => (
                <f.SwitchField
                  label="Show prices"
                  description={on ? 'Turn off to keep packages but say "Price on request".' : 'Only applies when packages are shown.'}
                  className={on ? undefined : 'opacity-60'}
                />
              )}
            </form.AppField>
          )}
        </form.Subscribe>
        <form.AppField name="showTestimonials">
          {(f) => <f.SwitchField label="Show testimonials" description="The client quotes on the homepage." />}
        </form.AppField>
      </FormSection>

      <FormSection title="Footer" description="A short line under your tagline at the bottom of every page.">
        <form.AppField name="footerNote">{(f) => <f.TextField label="Footer note" maxLength={160} />}</form.AppField>
      </FormSection>

      <FormSection
        title="Search & sharing"
        description="How the homepage looks in Google results and when shared on WhatsApp or social media."
      >
        <form.AppField name="seo.title">{(f) => <f.TextField label="Page title" maxLength={70} />}</form.AppField>
        <form.AppField name="seo.description">
          {(f) => <f.TextareaField label="Description" rows={3} maxLength={170} />}
        </form.AppField>
        <form.AppField name="seo.image">
          {(f) => (
            <f.ImageField
              label="Sharing image"
              folder="site"
              aspect="landscape"
              description="Shown in link previews. A landscape photo works best."
            />
          )}
        </form.AppField>
      </FormSection>

      <form.AppForm>
        <form.SaveBar />
      </form.AppForm>
    </form>
  )
}
