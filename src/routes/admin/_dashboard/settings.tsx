import { createFileRoute } from '@tanstack/react-router'

import Settings from '@/components/pages/admin/settings'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/settings')({
  head: () => adminHead('Settings'),
  component: SettingsRoute,
})

function SettingsRoute() {
  const { admin } = Route.useRouteContext()
  return <Settings email={admin.email} />
}
