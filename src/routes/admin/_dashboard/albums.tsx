import { createFileRoute } from '@tanstack/react-router'

import { ComingSoon } from '@/components/shared/admin/coming-soon'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/albums')({
  head: () => adminHead('Albums'),
  component: () => (
    <ComingSoon
      title="Albums"
      description="Create albums, upload photos, add video links and choose what is featured."
    />
  ),
})
