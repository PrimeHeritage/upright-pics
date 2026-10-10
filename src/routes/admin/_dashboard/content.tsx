import { createFileRoute } from '@tanstack/react-router'
import type { SearchSchemaInput } from '@tanstack/react-router'

import Content from '@/components/pages/admin/content'
import { adminContentQuery } from '@/hooks/api/admin/content'
import { oneOf } from '@/lib/search'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/content')({
  validateSearch: (search: { tab?: 'home' | 'about' | 'contact' | 'work' | 'services' } & SearchSchemaInput) => ({
    tab: oneOf(search.tab, ['home', 'about', 'contact', 'work', 'services'], 'home'),
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
