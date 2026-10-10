import { createFileRoute } from '@tanstack/react-router'

import { ComingSoon } from '@/components/shared/admin/coming-soon'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/content')({
  head: () => adminHead('Page content'),
  component: () => (
    <ComingSoon
      title="Page content"
      description="Headlines, text and images for the homepage, About and Contact pages."
    />
  ),
})
