import { createFileRoute } from '@tanstack/react-router'

import Testimonials from '@/components/pages/admin/testimonials'
import { adminTestimonialsQuery } from '@/hooks/api/admin/catalog'
import { adminSettingsQuery } from '@/hooks/api/admin/settings'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/testimonials')({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(adminTestimonialsQuery()),
      context.queryClient.ensureQueryData(adminSettingsQuery()),
    ]),
  head: () => adminHead('Testimonials'),
  component: Testimonials,
})
