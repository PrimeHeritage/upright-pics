import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import AuthLayout from '@/components/layout/auth'
import Login from '@/components/pages/admin/auth/login'
import { adminSessionQuery } from '@/hooks/api/admin/auth'
import { adminHead, adminHeaders } from '@/lib/admin-route'

export const Route = createFileRoute('/admin/login')({
  validateSearch: z.object({ redirect: z.string().max(300).optional().catch(undefined) }),
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.fetchQuery({ ...adminSessionQuery(), staleTime: 0 })
    if (session) throw redirect({ to: '/admin' })
  },
  head: () => adminHead('Sign in'),
  headers: adminHeaders,
  component: LoginRoute,
})

function LoginRoute() {
  const { redirect: to } = Route.useSearch()
  return (
    <AuthLayout>
      <Login redirect={to} />
    </AuthLayout>
  )
}
