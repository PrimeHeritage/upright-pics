import { cn } from '@/lib/utils'

/** Main content area. Pages under an overlay header start at the very top. */
export default function PageBody({
  overlay,
  children,
}: {
  overlay: boolean
  children: React.ReactNode
}) {
  return (
    <main id="main" className={cn('min-h-[60dvh]', !overlay && 'pt-16 md:pt-[4.5rem]')}>
      {children}
    </main>
  )
}
