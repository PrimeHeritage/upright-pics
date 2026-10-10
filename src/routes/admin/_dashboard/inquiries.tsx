import { createFileRoute } from '@tanstack/react-router'
import type { SearchSchemaInput } from '@tanstack/react-router'

import Inquiries from '@/components/pages/admin/inquiries'
import { adminInquiriesQuery } from '@/hooks/api/admin/inquiries'
import { adminSettingsQuery } from '@/hooks/api/admin/settings'
import { oneOf } from '@/lib/search'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/inquiries')({
  validateSearch: (search: { status?: 'all' | 'new' | 'read' | 'replied' | 'archived' } & SearchSchemaInput) => ({
    status: oneOf(search.status, ['all', 'new', 'read', 'replied', 'archived'], 'all'),
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
