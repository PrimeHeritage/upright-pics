import { createFileRoute } from '@tanstack/react-router'

import Dashboard from '@/components/pages/admin/dashboard'
import { dashboardQuery } from '@/hooks/api/admin/dashboard'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(dashboardQuery()),
  head: () => adminHead('Dashboard'),
  component: DashboardRoute,
})

function DashboardRoute() {
  const { admin } = Route.useRouteContext()
  return <Dashboard email={admin.email} />
}
