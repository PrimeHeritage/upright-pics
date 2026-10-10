import { createFileRoute } from '@tanstack/react-router'

import Packages from '@/components/pages/admin/packages'
import {
  adminPackagesQuery,
  adminServicesQuery,
} from '@/hooks/api/admin/catalog'
import { adminSettingsQuery } from '@/hooks/api/admin/settings'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/packages')({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(adminPackagesQuery()),
      context.queryClient.ensureQueryData(adminServicesQuery()),
      context.queryClient.ensureQueryData(adminSettingsQuery()),
    ]),
  head: () => adminHead('Packages'),
  component: Packages,
})
