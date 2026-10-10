import { createFileRoute } from '@tanstack/react-router'

import { ComingSoon } from '@/components/shared/admin/coming-soon'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/packages')({
  head: () => adminHead('Packages'),
  component: () => (
    <ComingSoon
      title="Packages"
      description="Package names, prices and what is included."
    />
  ),
})
