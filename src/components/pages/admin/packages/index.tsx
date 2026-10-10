import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { EyeOff, Package, Plus } from 'lucide-react'

import { PackageForm } from './package-form'
import { EditSheet } from '@/components/shared/admin/edit-sheet'
import { AdminPageHeader } from '@/components/shared/admin/page-header'
import { EmptyState, SortableRows } from '@/components/shared/admin/sortable-rows'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { adminPackagesQuery, adminServicesQuery, usePackageMutations } from '@/hooks/api/admin/catalog'
import { adminSettingsQuery } from '@/hooks/api/admin/settings'
import { withToast } from '@/hooks/use-crud-toast'
import type { AdminPackage } from '@/hooks/api/admin/catalog'

export default function Packages() {
  const { data: packages } = useSuspenseQuery(adminPackagesQuery())
  const { data: services } = useSuspenseQuery(adminServicesQuery())
  const { data: settings } = useSuspenseQuery(adminSettingsQuery())
  const m = usePackageMutations()
  const [editing, setEditing] = useState<AdminPackage | 'new' | null>(null)
  const isNew = editing === 'new'

  const addButton = (
    <Button onClick={() => setEditing('new')}>
      <Plus /> Add package
    </Button>
  )

  return (
    <div className="max-w-3xl">
      <AdminPageHeader title="Packages" description="Your starting packages and prices." actions={addButton} />

      {!settings.showPackages || !settings.showPrices ? (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-gold/30 bg-gold/5 p-4 text-sm">
          <EyeOff className="mt-0.5 size-4 shrink-0 text-gold" />
          <p className="text-paper/85">
            {!settings.showPackages
              ? 'Packages are currently hidden on the website.'
              : 'Prices are hidden on the website; packages show "Price on request".'}{' '}
            <Link to="/admin/settings" hash="visibility" className="text-gold underline-offset-4 hover:underline">
              Change in Settings
            </Link>
          </p>
        </div>
      ) : null}

      <SortableRows
        items={packages}
        onReorder={(items) => m.reorder.mutate(items)}
        onEdit={setEditing}
        onDelete={(p) => void withToast(m.remove.mutateAsync({ data: { id: p.id } }), 'Package deleted')}
        deleteCopy={(p) => ({ title: `Delete "${p.name}"?`, description: 'This cannot be undone. Use the switch to hide it instead.' })}
        visibility={{
          isVisible: (p) => p.visible,
          onChange: (p, visible) =>
            void withToast(m.setVisible.mutateAsync({ data: { id: p.id, visible } }), visible ? 'Package shown' : 'Package hidden'),
        }}
        renderMain={(p) => (
          <>
            <p className="flex items-center gap-2 truncate font-medium">
              {p.name}
              {p.highlighted ? <Badge className="bg-gold text-ink">Highlighted</Badge> : null}
            </p>
            <p className="truncate text-xs text-ash">
              {p.priceLabel || 'Price on request'} · {p.features.length} item{p.features.length === 1 ? '' : 's'}
            </p>
          </>
        )}
        empty={<EmptyState icon={Package} title="No packages yet" body="Add a package to show starting prices." action={addButton} />}
      />

      <EditSheet open={editing !== null} onOpenChange={(o) => !o && setEditing(null)} title={isNew ? 'New package' : 'Edit package'}>
        {editing ? (
          <PackageForm
            key={isNew ? 'new' : editing.id}
            isNew={isNew}
            services={services}
            initial={
              isNew
                ? { name: '', serviceId: '', description: '', priceLabel: '', features: [''], highlighted: false, visible: true }
                : {
                    name: editing.name,
                    serviceId: editing.serviceId ?? '',
                    description: editing.description ?? '',
                    priceLabel: editing.priceLabel,
                    features: editing.features,
                    highlighted: editing.highlighted,
                    visible: editing.visible,
                  }
            }
            onSubmit={async (value) => {
              const done = await withToast(
                isNew ? m.create.mutateAsync({ data: value }) : m.update.mutateAsync({ data: { ...value, id: editing.id } }),
                isNew ? 'Package added' : 'Package saved',
              )
              if (done) setEditing(null)
            }}
          />
        ) : null}
      </EditSheet>
    </div>
  )
}
