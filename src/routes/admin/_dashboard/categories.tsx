import { createFileRoute } from '@tanstack/react-router'

import { ComingSoon } from '@/components/shared/admin/coming-soon'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/categories')({
  head: () => adminHead('Categories'),
  component: () => (
    <ComingSoon
      title="Categories"
      description="The filters shown on the Work page."
    />
  ),
})
