import { createFileRoute } from '@tanstack/react-router'

import Services from '@/components/pages/admin/services'
import { adminServicesQuery } from '@/hooks/api/admin/catalog'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/services')({
  loader: ({ context }) =>
    Promise.all([context.queryClient.ensureQueryData(adminServicesQuery())]),
  head: () => adminHead('Services'),
  component: Services,
})
