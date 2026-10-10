import { createFileRoute } from '@tanstack/react-router'

import Categories from '@/components/pages/admin/categories'
import { adminCategoriesQuery } from '@/hooks/api/admin/catalog'
import { adminHead } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/_dashboard/categories')({
  loader: ({ context }) => context.queryClient.ensureQueryData(adminCategoriesQuery()),
  head: () => adminHead('Categories'),
  component: Categories,
})
