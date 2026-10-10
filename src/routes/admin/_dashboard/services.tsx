import { createFileRoute } from '@tanstack/react-router'

import { ComingSoon } from '@/components/shared/admin/coming-soon'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/services')({
  head: () => adminHead('Services'),
  component: () => (
    <ComingSoon
      title="Services"
      description="The services listed on the website, with photos and descriptions."
    />
  ),
})
