import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Plus, Sparkles } from 'lucide-react'

import { ServiceForm } from './service-form'
import { MediaImage } from '@/components/shared/media-image'
import { EditSheet } from '@/components/shared/admin/edit-sheet'
import { AdminPageHeader } from '@/components/shared/admin/page-header'
import { EmptyState, SortableRows } from '@/components/shared/admin/sortable-rows'
import { Button } from '@/components/ui/button'
import { adminServicesQuery, useServiceMutations } from '@/hooks/api/admin/catalog'
import { withToast } from '@/hooks/use-crud-toast'
import type { AdminService } from '@/hooks/api/admin/catalog'

export default function Services() {
  const { data: services } = useSuspenseQuery(adminServicesQuery())
  const m = useServiceMutations()
  const [editing, setEditing] = useState<AdminService | 'new' | null>(null)
  const isNew = editing === 'new'

  const addButton = (
    <Button onClick={() => setEditing('new')}>
      <Plus /> Add service
    </Button>
  )

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        title="Services"
        description="What you offer. Drag to reorder, switch off to hide a service without deleting it."
        actions={addButton}
      />
      <SortableRows
        items={services}
        onReorder={(items) => m.reorder.mutate(items)}
        onEdit={setEditing}
        onDelete={(s) => void withToast(m.remove.mutateAsync({ data: { id: s.id } }), 'Service deleted')}
        deleteCopy={(s) => ({
          title: `Delete "${s.title}"?`,
          description: 'Packages linked to this service will be kept. To hide it for now, use the switch instead.',
        })}
        visibility={{
          isVisible: (s) => s.visible,
          onChange: (s, visible) =>
            void withToast(m.setVisible.mutateAsync({ data: { id: s.id, visible } }), visible ? 'Service shown' : 'Service hidden'),
        }}
        renderLeading={(s) => (
          <div className="relative size-12 overflow-hidden rounded bg-surface-2">
            {s.cover ? <MediaImage image={s.cover} fill sizes="48px" /> : null}
          </div>
        )}
        renderMain={(s) => (
          <>
            <p className="truncate font-medium">{s.title}</p>
            <p className="truncate text-xs text-ash">{s.summary}</p>
          </>
        )}
        empty={<EmptyState icon={Sparkles} title="No services yet" body="Add the services you offer." action={addButton} />}
      />

      <EditSheet open={editing !== null} onOpenChange={(o) => !o && setEditing(null)} title={isNew ? 'New service' : 'Edit service'}>
        {editing ? (
          <ServiceForm
            key={isNew ? 'new' : editing.id}
            isNew={isNew}
            initial={
              isNew
                ? { title: '', slug: '', summary: '', body: '', cover: null, visible: true }
                : {
                    title: editing.title,
                    slug: editing.slug,
                    summary: editing.summary,
                    body: editing.body ?? '',
                    cover: editing.cover,
                    visible: editing.visible,
                  }
            }
            onSubmit={async (value) => {
              const done = await withToast(
                isNew ? m.create.mutateAsync({ data: value }) : m.update.mutateAsync({ data: { ...value, id: editing.id } }),
                isNew ? 'Service added' : 'Service saved',
              )
              if (done) setEditing(null)
            }}
          />
        ) : null}
      </EditSheet>
    </div>
  )
}
