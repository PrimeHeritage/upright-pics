import { Suspense, lazy } from 'react'
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

import appCss from '@/styles.css?url'
import { Toaster } from '@/components/ui/sonner'

interface RouterContext {
  queryClient: QueryClient
}

// Opt-in (VITE_DEVTOOLS=true): the overlay interferes with in-app browser screenshots.
const Devtools =
  import.meta.env.DEV && import.meta.env.VITE_DEVTOOLS === 'true'
    ? lazy(() => import('@/lib/devtools'))
    : () => null

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { name: 'theme-color', content: '#0c0b0a' },
      { title: 'Upright Pictures Concepts' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/brand/upc-logo.jpg' },
      { rel: 'preconnect', href: 'https://images.unsplash.com' },
      { rel: 'preconnect', href: 'https://res.cloudinary.com' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster position="bottom-center" />
        <Suspense>
          <Devtools />
        </Suspense>
        <Scripts />
      </body>
    </html>
  )
}
