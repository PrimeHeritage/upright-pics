import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { PageSection } from '@/components/ui/custom/page-section'
import { cn } from '@/lib/utils'
import type { Testimonial } from '@/types'

/** One quote at a time; client names act as the selector. */
export default function Testimonials({ testimonials }: { testimonials: Array<Testimonial> }) {
  const [index, setIndex] = useState(0)
  if (testimonials.length === 0) return null
  const current = testimonials[index]

  return (
    <PageSection spacing="lg" className="border-t border-line">
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <h2 className="text-label text-gold">Kind words</h2>
          <ul className="mt-8 flex gap-6 overflow-x-auto md:flex-col md:gap-4" role="tablist">
            {testimonials.map((t, i) => (
              <li key={t.id} className="shrink-0">
                <button
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  onClick={() => setIndex(i)}
                  className={cn(
                    'text-left transition-colors duration-300',
                    i === index ? 'text-paper' : 'text-smoke hover:text-ash',
                  )}
                >
                  <span className="block font-display text-xl md:text-2xl">{t.clientName}</span>
                  <span className="mt-1 hidden text-sm md:block">{t.context}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <figure className="relative min-h-[16rem] md:col-span-8 md:min-h-[20rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <blockquote className="font-display text-3xl leading-[1.25] md:text-5xl md:leading-[1.15]">
                <span className="text-gold">“</span>
                {current.quote}
                <span className="text-gold">”</span>
              </blockquote>
              <figcaption className="mt-8 text-ash md:hidden">
                {current.clientName}, {current.context}
              </figcaption>
            </motion.div>
          </AnimatePresence>
        </figure>
      </div>
    </PageSection>
  )
}
