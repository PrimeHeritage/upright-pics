import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import Inquiries from '@/components/pages/admin/inquiries'
import { adminInquiriesQuery } from '@/hooks/api/admin/inquiries'
import { adminSettingsQuery } from '@/hooks/api/admin/settings'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/inquiries')({
  validateSearch: z.object({
    status: z.enum(['all', 'new', 'read', 'replied', 'archived']).catch('all').default('all'),
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(adminInquiriesQuery()),
      context.queryClient.ensureQueryData(adminSettingsQuery()),
    ]),
  head: () => adminHead('Enquiries'),
  component: InquiriesRoute,
})

function InquiriesRoute() {
  const { status } = Route.useSearch()
  const navigate = Route.useNavigate()
  return <Inquiries tab={status} onTabChange={(next) => navigate({ search: { status: next }, replace: true })} />
}
