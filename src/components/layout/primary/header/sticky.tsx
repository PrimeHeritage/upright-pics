import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'

import { cn } from '@/lib/utils'

/**
 * Header shell. Transparent over the home hero, solid once scrolled, and
 * tucks away while scrolling down (comes back on scroll up).
 */
export default function HeaderShell({
  overlay,
  children,
}: {
  overlay: boolean
  children: React.ReactNode
}) {
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(!overlay)
  const [hidden, setHidden] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    const nextSolid = !overlay || y > 40
    const nextHidden = y > 320 && y > prev + 2
    const nextShown = y < prev - 2
    if (nextSolid !== solid) setSolid(nextSolid)
    if (nextHidden && !hidden) setHidden(true)
    else if (nextShown && hidden) setHidden(false)
  })

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500',
        solid
          ? 'border-b border-line bg-ink/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-gradient-to-b from-ink/70 to-transparent',
      )}
    >
      {children}
    </motion.header>
  )
}
