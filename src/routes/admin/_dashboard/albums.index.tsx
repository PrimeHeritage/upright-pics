import { createFileRoute } from '@tanstack/react-router'

import Albums from '@/components/pages/admin/albums'
import { adminAlbumsQuery } from '@/hooks/api/admin/albums'
import { adminCategoriesQuery } from '@/hooks/api/admin/catalog'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/albums/')({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(adminAlbumsQuery()),
      context.queryClient.ensureQueryData(adminCategoriesQuery()),
    ]),
  head: () => adminHead('Albums'),
  component: Albums,
})
