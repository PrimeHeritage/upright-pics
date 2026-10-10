import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { EyeOff, MessageSquareQuote, Plus } from 'lucide-react'

import { TestimonialForm } from './testimonial-form'
import { EditSheet } from '@/components/shared/admin/edit-sheet'
import { AdminPageHeader } from '@/components/shared/admin/page-header'
import { EmptyState, SortableRows } from '@/components/shared/admin/sortable-rows'
import { Button } from '@/components/ui/button'
import { adminTestimonialsQuery, useTestimonialMutations } from '@/hooks/api/admin/catalog'
import { adminSettingsQuery } from '@/hooks/api/admin/settings'
import { withToast } from '@/hooks/use-crud-toast'
import type { AdminTestimonial } from '@/hooks/api/admin/catalog'

export default function Testimonials() {
  const { data: testimonials } = useSuspenseQuery(adminTestimonialsQuery())
  const { data: settings } = useSuspenseQuery(adminSettingsQuery())
  const m = useTestimonialMutations()
  const [editing, setEditing] = useState<AdminTestimonial | 'new' | null>(null)
  const isNew = editing === 'new'

  const addButton = (
    <Button onClick={() => setEditing('new')}>
      <Plus /> Add testimonial
    </Button>
  )

  return (
    <div className="max-w-3xl">
      <AdminPageHeader title="Testimonials" description="Client quotes on the homepage. Drag to choose which shows first." actions={addButton} />

      {!settings.showTestimonials ? (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-gold/30 bg-gold/5 p-4 text-sm">
          <EyeOff className="mt-0.5 size-4 shrink-0 text-gold" />
          <p className="text-paper/85">
            Testimonials are currently hidden on the website.{' '}
            <Link to="/admin/settings" hash="visibility" className="text-gold underline-offset-4 hover:underline">
              Change in Settings
            </Link>
          </p>
        </div>
      ) : null}

      <SortableRows
        items={testimonials}
        onReorder={(items) => m.reorder.mutate(items)}
        onEdit={setEditing}
        onDelete={(t) => void withToast(m.remove.mutateAsync({ data: { id: t.id } }), 'Testimonial deleted')}
        deleteCopy={(t) => ({ title: `Delete the quote from ${t.clientName}?`, description: 'This cannot be undone.' })}
        visibility={{
          isVisible: (t) => t.visible,
          onChange: (t, visible) =>
            void withToast(m.setVisible.mutateAsync({ data: { id: t.id, visible } }), visible ? 'Testimonial shown' : 'Testimonial hidden'),
        }}
        renderMain={(t) => (
          <>
            <p className="truncate font-medium">{t.clientName}</p>
            <p className="line-clamp-1 text-xs text-ash">“{t.quote}”</p>
          </>
        )}
        empty={<EmptyState icon={MessageSquareQuote} title="No testimonials yet" body="Add a quote from a happy client." action={addButton} />}
      />

      <EditSheet open={editing !== null} onOpenChange={(o) => !o && setEditing(null)} title={isNew ? 'New testimonial' : 'Edit testimonial'}>
        {editing ? (
          <TestimonialForm
            key={isNew ? 'new' : editing.id}
            isNew={isNew}
            initial={
              isNew
                ? { clientName: '', context: '', quote: '', visible: true }
                : { clientName: editing.clientName, context: editing.context, quote: editing.quote, visible: editing.visible }
            }
            onSubmit={async (value) => {
              const done = await withToast(
                isNew ? m.create.mutateAsync({ data: value }) : m.update.mutateAsync({ data: { ...value, id: editing.id } }),
                isNew ? 'Testimonial added' : 'Testimonial saved',
              )
              if (done) setEditing(null)
            }}
          />
        ) : null}
      </EditSheet>
    </div>
  )
}
