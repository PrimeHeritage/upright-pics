import { useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AnimatePresence, m, useMotionValue, useSpring } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import { PageSection } from '@/components/ui/custom/page-section'
import { Reveal } from '@/components/ui/custom/reveal'
import type { Service } from '@/types'

/**
 * Typographic index of services. On fine pointers, hovering a row floats that
 * service's photo beside the cursor; touch devices get the plain list.
 */
export default function ServicesIndex({ services }: { services: Array<Service> }) {
  const listRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState<Service | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 220, damping: 28, mass: 0.6 })
  const springY = useSpring(y, { stiffness: 220, damping: 28, mass: 0.6 })

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !listRef.current) return
    const rect = listRef.current.getBoundingClientRect()
    x.set(e.clientX - rect.left)
    y.set(e.clientY - rect.top)
  }

  return (
    <PageSection spacing="md" className="border-t border-line">
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-4">
          <h2 className="font-display text-5xl leading-none md:sticky md:top-32 md:text-6xl">
            What we <span className="italic">do</span>
          </h2>
        </Reveal>

        <ul
          ref={listRef}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setActive(null)}
          className="relative md:col-span-8"
        >
          {services.map((service, i) => (
            <li key={service.id} className="border-t border-line last:border-b">
              <Link
                to="/services"
                hash={service.slug}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(service)}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 py-6 md:grid-cols-[3rem_1fr_auto] md:py-7"
              >
                <span className="font-mono text-xs text-smoke tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="block font-display text-[1.75rem] leading-tight transition-[color,transform] duration-500 ease-out-expo group-hover:translate-x-2 group-hover:text-gold md:text-4xl">
                    {service.title}
                  </span>
                  <span className="mt-2 block max-w-md text-sm text-ash md:text-base">
                    {service.summary}
                  </span>
                </span>
                <ArrowUpRight className="size-5 text-smoke transition-all duration-300 group-hover:text-gold" />
              </Link>
            </li>
          ))}

          <AnimatePresence>
            {active?.cover ? (
              <m.div
                key="preview"
                aria-hidden
                className="pointer-events-none absolute top-0 left-0 z-10 hidden w-56 md:block lg:w-64"
                style={{ x: springX, y: springY, translateX: '24px', translateY: '-50%' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <m.div
                    key={active.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <MediaImage image={active.cover} sizes="256px" className="aspect-[4/5]" />
                  </m.div>
                </AnimatePresence>
              </m.div>
            ) : null}
          </AnimatePresence>
        </ul>
      </div>
    </PageSection>
  )
}
