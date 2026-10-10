import { Plus, Trash2 } from 'lucide-react'

import { SectionCard, useSaveSection } from './section-card'
import { Button } from '@/components/ui/button'
import { useAppForm } from '@/components/ui/custom/form'
import { aboutSchema, contactSchema, pageHeaderSchema } from '@/lib/schemas/content'
import type { AboutContent, ContactContent, PageHeaderContent } from '@/types'

export function AboutSection({ value }: { value: AboutContent }) {
  const save = useSaveSection('about.main')
  const form = useAppForm({
    defaultValues: value,
    validators: { onSubmit: aboutSchema },
    onSubmit: ({ value: v, formApi }) => save(v, () => formApi.reset(v)),
  })
  return (
    <SectionCard
      title="About page"
      description="Your story, portrait, key facts and how you work."
      onSubmit={() => void form.handleSubmit()}
      footer={
        <form.AppForm>
          <form.UnsavedChangesGuard />
          <form.SubmitButton disableWhenPristine>Save About page</form.SubmitButton>
        </form.AppForm>
      }
    >
      <form.AppField name="heading">{(f) => <f.TextField label="Heading" maxLength={60} />}</form.AppField>
      <form.AppField name="lead">{(f) => <f.TextareaField label="Introduction" rows={3} maxLength={240} />}</form.AppField>
      <div className="grid gap-5 md:grid-cols-2">
        <form.AppField name="portrait">
          {(f) => <f.ImageField label="Portrait" folder="site/about" aspect="portrait" removable={false} description="A photo of you." />}
        </form.AppField>
        <form.AppField name="secondaryImage">
          {(f) => <f.ImageField label="Wide photo" folder="site/about" aspect="landscape" description="Shown between sections." />}
        </form.AppField>
      </div>

      <form.Field name="story" mode="array">
        {(story) => (
          <div className="grid gap-3">
            <p className="text-sm font-medium">Your story</p>
            {story.state.value.map((_, i) => (
              <div key={i} className="flex items-start gap-2">
                <form.AppField name={`story[${i}]`}>
                  {(f) => <f.TextareaField label={`Paragraph ${i + 1}`} rows={4} maxLength={700} className="flex-1" />}
                </form.AppField>
                {story.state.value.length > 1 ? (
                  <Button type="button" variant="ghost" size="icon" className="mt-7 text-ash" onClick={() => story.removeValue(i)} aria-label={`Remove paragraph ${i + 1}`}>
                    <Trash2 />
                  </Button>
                ) : null}
              </div>
            ))}
            {story.state.value.length < 6 ? (
              <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => story.pushValue('')}>
                <Plus /> Add paragraph
              </Button>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field name="stats" mode="array">
        {(stats) => (
          <div className="grid gap-3">
            <p className="text-sm font-medium">Key facts</p>
            <p className="-mt-2 text-xs text-ash">Short highlights, e.g. "10+" and "Years behind the camera".</p>
            {stats.state.value.map((_, i) => (
              <div key={i} className="grid items-end gap-2 sm:grid-cols-[8rem_1fr_auto]">
                <form.AppField name={`stats[${i}].value`}>{(f) => <f.TextField label="Value" maxLength={16} />}</form.AppField>
                <form.AppField name={`stats[${i}].label`}>{(f) => <f.TextField label="Label" maxLength={60} />}</form.AppField>
                <Button type="button" variant="ghost" size="icon" className="text-ash" onClick={() => stats.removeValue(i)} aria-label={`Remove fact ${i + 1}`}>
                  <Trash2 />
                </Button>
              </div>
            ))}
            {stats.state.value.length < 4 ? (
              <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => stats.pushValue({ value: '', label: '' })}>
                <Plus /> Add fact
              </Button>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field name="values" mode="array">
        {(values) => (
          <div className="grid gap-3">
            <p className="text-sm font-medium">How you work</p>
            {values.state.value.map((_, i) => (
              <div key={i} className="grid items-start gap-2 rounded-md border border-line p-3 sm:grid-cols-[12rem_1fr_auto]">
                <form.AppField name={`values[${i}].title`}>{(f) => <f.TextField label="Title" maxLength={40} />}</form.AppField>
                <form.AppField name={`values[${i}].body`}>{(f) => <f.TextareaField label="Text" rows={2} maxLength={200} />}</form.AppField>
                <Button type="button" variant="ghost" size="icon" className="mt-7 text-ash" onClick={() => values.removeValue(i)} aria-label={`Remove ${i + 1}`}>
                  <Trash2 />
                </Button>
              </div>
            ))}
            {values.state.value.length < 4 ? (
              <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => values.pushValue({ title: '', body: '' })}>
                <Plus /> Add point
              </Button>
            ) : null}
          </div>
        )}
      </form.Field>
    </SectionCard>
  )
}

export function ContactSection({ value }: { value: ContactContent }) {
  const save = useSaveSection('contact.main')
  const form = useAppForm({
    defaultValues: value,
    validators: { onSubmit: contactSchema },
    onSubmit: ({ value: v, formApi }) => save(v, () => formApi.reset(v)),
  })
  return (
    <SectionCard
      title="Contact page"
      description="Phone numbers, email and socials come from Settings."
      onSubmit={() => void form.handleSubmit()}
      footer={
        <form.AppForm>
          <form.UnsavedChangesGuard />
          <form.SubmitButton disableWhenPristine>Save Contact page</form.SubmitButton>
        </form.AppForm>
      }
    >
      <form.AppField name="heading">{(f) => <f.TextField label="Heading" maxLength={40} />}</form.AppField>
      <form.AppField name="body">{(f) => <f.TextareaField label="Text" rows={3} maxLength={240} />}</form.AppField>
      <form.AppField name="responseNote">
        {(f) => <f.TextField label="WhatsApp note" maxLength={160} description="Shown above the WhatsApp button." />}
      </form.AppField>
    </SectionCard>
  )
}

export function PageHeaderSection({
  value,
  contentKey,
  title,
}: {
  value: PageHeaderContent
  contentKey: 'work.header' | 'services.header'
  title: string
}) {
  const save = useSaveSection(contentKey)
  const form = useAppForm({
    defaultValues: value,
    validators: { onSubmit: pageHeaderSchema },
    onSubmit: ({ value: v, formApi }) => save(v, () => formApi.reset(v)),
  })
  return (
    <SectionCard
      title={title}
      description="The large heading and short line at the top of the page."
      onSubmit={() => void form.handleSubmit()}
      footer={
        <form.AppForm>
          <form.UnsavedChangesGuard />
          <form.SubmitButton disableWhenPristine>Save</form.SubmitButton>
        </form.AppForm>
      }
    >
      <form.AppField name="heading">{(f) => <f.TextField label="Heading" maxLength={40} />}</form.AppField>
      <form.AppField name="body">{(f) => <f.TextareaField label="Text" rows={2} maxLength={200} />}</form.AppField>
    </SectionCard>
  )
}
