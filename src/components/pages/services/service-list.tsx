import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { ArrowRight } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import { CONTACT_CTA } from '@/constants/navigation'
import type { Service } from '@/types'

/**
 * Desktop: a sticky photo on the left swaps to whichever service is in view.
 * Mobile: each service carries its own photo inline.
 */
export default function ServiceList({ services }: { services: Array<Service> }) {
  const [activeId, setActiveId] = useState(services[0]?.id)
  const active = services.find((s) => s.id === activeId) ?? services.at(0)
  if (!active) return null

  return (
    <section className="container-site pb-24 md:pb-32">
      <div className="grid md:grid-cols-12 md:gap-8">
        <div className="hidden md:col-span-5 md:block">
          <div className="sticky top-28 aspect-[4/5] overflow-hidden">
            <AnimatePresence initial={false}>
              {active.cover ? (
                <motion.div
                  key={active.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <MediaImage image={active.cover} fill sizes="40vw" />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <ol className="md:col-span-6 md:col-start-7">
          {services.map((service, i) => (
            <ServiceRow
              key={service.id}
              service={service}
              index={i}
              onActive={() => setActiveId(service.id)}
            />
          ))}
        </ol>
      </div>
    </section>
  )
}

function ServiceRow({
  service,
  index,
  onActive,
}: {
  service: Service
  index: number
  onActive: () => void
}) {
  const ref = useRef<HTMLLIElement>(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })

  useEffect(() => {
    if (inView) onActive()
  }, [inView, onActive])

  return (
    <li ref={ref} id={service.slug} className="scroll-mt-32 border-t border-line py-14 first:border-t-0 first:pt-0 md:py-20">
      {service.cover ? (
        <MediaImage image={service.cover} sizes="100vw" className="mb-8 aspect-[4/3] md:hidden" />
      ) : null}
      <span className="font-mono text-xs text-gold tabular-nums">{String(index + 1).padStart(2, '0')}</span>
      <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">{service.title}</h2>
      <p className="mt-5 text-lg text-paper/85">{service.summary}</p>
      {service.body ? <p className="mt-4 leading-relaxed text-ash">{service.body}</p> : null}
      <Link
        to="/contact"
        search={{ service: service.title }}
        className="link-underline group mt-8 inline-flex items-center gap-2 text-sm text-paper/90"
      >
        {CONTACT_CTA}
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </li>
  )
}
