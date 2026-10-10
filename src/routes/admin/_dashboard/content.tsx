import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import Content from '@/components/pages/admin/content'
import { adminContentQuery } from '@/hooks/api/admin/content'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/content')({
  validateSearch: z.object({
    tab: z.enum(['home', 'about', 'contact', 'work', 'services']).catch('home').default('home'),
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(adminContentQuery()),
  head: () => adminHead('Page content'),
  component: ContentRoute,
})

function ContentRoute() {
  const { tab } = Route.useSearch()
  const navigate = Route.useNavigate()
  return <Content tab={tab} onTabChange={(next) => navigate({ search: { tab: next }, replace: true })} />
}
