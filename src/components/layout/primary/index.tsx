import { useRouterState } from '@tanstack/react-router'
import { LazyMotion } from 'motion/react'

import Footer from './footer'
import Header from './header'
import PageBody from './body'
import { WhatsAppButton } from '@/components/shared/whatsapp-button'
import { SmoothScroll } from '@/components/ui/custom/smooth-scroll'
import type { SiteSettings } from '@/types'

const loadMotionFeatures = () => import('@/lib/motion-features').then((mod) => mod.default)

/** Routes whose first section is a full-bleed visual the header floats over. */
const OVERLAY_ROUTES = ['/', '/about']

export default function PrimaryLayout({
  settings,
  children,
}: {
  settings: SiteSettings
  children: React.ReactNode
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const overlay = OVERLAY_ROUTES.includes(pathname) || pathname.startsWith('/work/')

  return (
    // Lightweight `m` components render immediately; animation features load after.
    <LazyMotion features={loadMotionFeatures}>
      <a
        href="#main"
        className="fixed top-2 left-2 z-[100] -translate-y-20 bg-gold px-4 py-2 text-sm text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <SmoothScroll />
      <Header overlay={overlay} settings={settings} />
      <PageBody overlay={overlay}>{children}</PageBody>
      <Footer settings={settings} />
      <WhatsAppButton phone={settings.whatsapp} businessName={settings.businessName} />
    </LazyMotion>
  )
}
