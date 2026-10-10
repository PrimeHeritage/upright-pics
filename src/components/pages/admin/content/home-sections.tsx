import { Plus, Trash2 } from 'lucide-react'

import { SectionCard, useSaveSection } from './section-card'
import { Button } from '@/components/ui/button'
import { useAppForm } from '@/components/ui/custom/form'
import { seedImages } from '@/lib/seed/images'
import { ctaSchema, heroSchema, introSchema, processSchema, showreelSchema } from '@/lib/schemas/content'
import type { CtaContent, HeroContent, IntroContent, ProcessContent, ShowreelContent } from '@/types'


export function HeroSection({ value }: { value: HeroContent }) {
  const save = useSaveSection('home.hero')
  const form = useAppForm({
    defaultValues: value,
    validators: { onSubmit: heroSchema },
    onSubmit: ({ value: v, formApi }) => save(v, () => formApi.reset(v)),
  })
  return (
    <SectionCard
      title="Hero"
      description="The first thing visitors see. Photos rotate every few seconds."
      onSubmit={() => void form.handleSubmit()}
      footer={
        <form.AppForm>
          <form.UnsavedChangesGuard />
          <form.SubmitButton disableWhenPristine>Save hero</form.SubmitButton>
        </form.AppForm>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <form.AppField name="headline">
          {(f) => <f.TextField label="Headline" maxLength={40} description='e.g. "Moments worth"' />}
        </form.AppField>
        <form.AppField name="headlineEmphasis">
          {(f) => <f.TextField label="Highlighted words" maxLength={30} description="Shown in gold italics after the headline." />}
        </form.AppField>
      </div>
      <form.AppField name="subheadline">
        {(f) => <f.TextareaField label="Subheadline" rows={2} maxLength={160} />}
      </form.AppField>
      <div className="grid gap-5 sm:grid-cols-2">
        <form.AppField name="primaryCta">{(f) => <f.TextField label="Main button" maxLength={24} />}</form.AppField>
        <form.AppField name="secondaryCta">{(f) => <f.TextField label="Second button" maxLength={24} />}</form.AppField>
      </div>
      <form.AppField name="slides">
        {(f) => (
          <f.ImageListField
            label="Hero photos"
            folder="site/hero"
            max={8}
            description="Drag to reorder. Portrait photos look best. The first photo loads first."
          />
        )}
      </form.AppField>
    </SectionCard>
  )
}

export function IntroSection({ value }: { value: IntroContent }) {
  const save = useSaveSection('home.intro')
  const form = useAppForm({
    defaultValues: value,
    validators: { onSubmit: introSchema },
    onSubmit: ({ value: v, formApi }) => save(v, () => formApi.reset(v)),
  })
  return (
    <SectionCard
      title="Introduction"
      description="The large statement under the hero."
      onSubmit={() => void form.handleSubmit()}
      footer={
        <form.AppForm>
          <form.UnsavedChangesGuard />
          <form.SubmitButton disableWhenPristine>Save introduction</form.SubmitButton>
        </form.AppForm>
      }
    >
      <form.AppField name="statement">
        {(f) => <f.TextareaField label="Statement" rows={2} maxLength={200} />}
      </form.AppField>
      <form.AppField name="body">{(f) => <f.TextareaField label="Supporting text" rows={3} maxLength={400} />}</form.AppField>
      <form.AppField name="image">
        {(f) => <f.ImageField label="Photo" folder="site/home" aspect="portrait" />}
      </form.AppField>
    </SectionCard>
  )
}

export function ProcessSection({ value }: { value: ProcessContent }) {
  const save = useSaveSection('home.process')
  const form = useAppForm({
    defaultValues: value,
    validators: { onSubmit: processSchema },
    onSubmit: ({ value: v, formApi }) => save(v, () => formApi.reset(v)),
  })
  return (
    <SectionCard
      title="From shoot to frame"
      description="The sideways-scrolling steps that explain how you work."
      onSubmit={() => void form.handleSubmit()}
      footer={
        <form.AppForm>
          <form.UnsavedChangesGuard />
          <form.SubmitButton disableWhenPristine>Save steps</form.SubmitButton>
        </form.AppForm>
      }
    >
      <form.AppField name="heading">{(f) => <f.TextField label="Heading" maxLength={60} />}</form.AppField>
      <form.AppField name="intro">{(f) => <f.TextareaField label="Introduction" rows={2} maxLength={200} />}</form.AppField>
      <form.Field name="steps" mode="array">
        {(steps) => (
          <div className="grid gap-4">
            {steps.state.value.map((_, i) => (
              <fieldset key={i} className="grid gap-4 rounded-md border border-line p-4 md:grid-cols-[minmax(0,1fr)_12rem]">
                <div className="grid content-start gap-4">
                  <div className="flex items-center justify-between">
                    <legend className="text-sm text-gold">Step {i + 1}</legend>
                    {steps.state.value.length > 2 ? (
                      <Button type="button" variant="ghost" size="sm" className="text-ash" onClick={() => steps.removeValue(i)}>
                        <Trash2 /> Remove
                      </Button>
                    ) : null}
                  </div>
                  <form.AppField name={`steps[${i}].title`}>{(f) => <f.TextField label="Title" maxLength={30} />}</form.AppField>
                  <form.AppField name={`steps[${i}].body`}>
                    {(f) => <f.TextareaField label="Text" rows={3} maxLength={200} />}
                  </form.AppField>
                </div>
                <form.AppField name={`steps[${i}].image`}>
                  {(f) => <f.ImageField label="Photo" folder="site/home" aspect="portrait" removable={false} />}
                </form.AppField>
              </fieldset>
            ))}
            {steps.state.value.length < 6 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => steps.pushValue({ title: 'New step', body: 'Describe this step.', image: seedImages.shooting })}
              >
                <Plus /> Add step
              </Button>
            ) : null}
          </div>
        )}
      </form.Field>
    </SectionCard>
  )
}

export function ShowreelSection({ value }: { value: ShowreelContent }) {
  const save = useSaveSection('home.showreel')
  const form = useAppForm({
    defaultValues: value,
    validators: { onSubmit: showreelSchema },
    onSubmit: ({ value: v, formApi }) => save(v, () => formApi.reset(v)),
  })
  return (
    <SectionCard
      title="Showreel"
      description="A full-width photo. Add a YouTube or Vimeo link to show a play button."
      onSubmit={() => void form.handleSubmit()}
      footer={
        <form.AppForm>
          <form.UnsavedChangesGuard />
          <form.SubmitButton disableWhenPristine>Save showreel</form.SubmitButton>
        </form.AppForm>
      }
    >
      <form.AppField name="heading">{(f) => <f.TextField label="Heading" maxLength={50} />}</form.AppField>
      <form.AppField name="caption">{(f) => <f.TextareaField label="Caption" rows={2} maxLength={160} />}</form.AppField>
      <form.AppField name="videoUrl">
        {(f) => (
          <f.TextField
            label="Video link"
            type="url"
            inputMode="url"
            placeholder="https://www.youtube.com/watch?v=..."
            description="Optional. Leave blank to show the photo only."
          />
        )}
      </form.AppField>
      <form.AppField name="poster">
        {(f) => <f.ImageField label="Background photo" folder="site/home" aspect="wide" removable={false} />}
      </form.AppField>
    </SectionCard>
  )
}

export function CtaSection({ value }: { value: CtaContent }) {
  const save = useSaveSection('home.cta')
  const form = useAppForm({
    defaultValues: value,
    validators: { onSubmit: ctaSchema },
    onSubmit: ({ value: v, formApi }) => save(v, () => formApi.reset(v)),
  })
  return (
    <SectionCard
      title="Closing call to action"
      description="The last block on the homepage, inviting visitors to book."
      onSubmit={() => void form.handleSubmit()}
      footer={
        <form.AppForm>
          <form.UnsavedChangesGuard />
          <form.SubmitButton disableWhenPristine>Save section</form.SubmitButton>
        </form.AppForm>
      }
    >
      <form.AppField name="heading">{(f) => <f.TextField label="Heading" maxLength={60} />}</form.AppField>
      <form.AppField name="body">{(f) => <f.TextareaField label="Text" rows={2} maxLength={200} />}</form.AppField>
      <form.AppField name="image">{(f) => <f.ImageField label="Photo" folder="site/home" aspect="portrait" />}</form.AppField>
    </SectionCard>
  )
}
