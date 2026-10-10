import { Outlet, createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import PrimaryLayout from '@/components/layout/primary'
import { settingsQuery } from '@/hooks/api/site'

export const Route = createFileRoute('/_primary')({
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery()),
  component: PrimaryRoute,
})

function PrimaryRoute() {
  const { data: settings } = useSuspenseQuery(settingsQuery())
  return (
    <PrimaryLayout settings={settings}>
      <Outlet />
    </PrimaryLayout>
  )
}
