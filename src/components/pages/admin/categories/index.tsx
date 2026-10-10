import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { FolderOpen, Plus } from 'lucide-react'

import { CategoryForm } from './category-form'
import { EditSheet } from '@/components/shared/admin/edit-sheet'
import { AdminPageHeader } from '@/components/shared/admin/page-header'
import { EmptyState, SortableRows } from '@/components/shared/admin/sortable-rows'
import { Button } from '@/components/ui/button'
import { adminCategoriesQuery, useCategoryMutations } from '@/hooks/api/admin/catalog'
import { withToast } from '@/hooks/use-crud-toast'
import type { AdminCategory } from '@/hooks/api/admin/catalog'

export default function Categories() {
  const { data: categories } = useSuspenseQuery(adminCategoriesQuery())
  const m = useCategoryMutations()
  const [editing, setEditing] = useState<AdminCategory | 'new' | null>(null)
  const isNew = editing === 'new'

  const addButton = (
    <Button onClick={() => setEditing('new')}>
      <Plus /> Add category
    </Button>
  )

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        title="Categories"
        description="The filters on the Work page. Drag to change their order."
        actions={addButton}
      />
      <SortableRows
        items={categories}
        onReorder={(items) => m.reorder.mutate(items)}
        onEdit={setEditing}
        onDelete={(c) => void withToast(m.remove.mutateAsync({ data: { id: c.id } }), 'Category deleted')}
        deleteCopy={(c) => ({
          title: `Delete "${c.name}"?`,
          description:
            c.albumCount > 0
              ? `${c.albumCount} album${c.albumCount === 1 ? '' : 's'} will stay on the website without a category.`
              : 'This category has no albums.',
        })}
        renderMain={(c) => (
          <>
            <p className="truncate font-medium">{c.name}</p>
            <p className="truncate text-xs text-ash">
              {c.albumCount} album{c.albumCount === 1 ? '' : 's'} · /{c.slug}
            </p>
          </>
        )}
        empty={<EmptyState icon={FolderOpen} title="No categories yet" body="Categories group your albums on the Work page." action={addButton} />}
      />

      <EditSheet
        open={editing !== null}
        onOpenChange={(o) => !o && setEditing(null)}
        title={isNew ? 'New category' : 'Edit category'}
      >
        {editing ? (
          <CategoryForm
            key={isNew ? 'new' : editing.id}
            isNew={isNew}
            initial={isNew ? { name: '', slug: '', description: '' } : { name: editing.name, slug: editing.slug, description: editing.description ?? '' }}
            onSubmit={async (value) => {
              const done = await withToast(
                isNew ? m.create.mutateAsync({ data: value }) : m.update.mutateAsync({ data: { ...value, id: editing.id } }),
                isNew ? 'Category added' : 'Category saved',
              )
              if (done) setEditing(null)
            }}
          />
        ) : null}
      </EditSheet>
    </div>
  )
}
