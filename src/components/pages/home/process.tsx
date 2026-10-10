import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

import { MediaImage } from '@/components/shared/media-image'
import { Reveal } from '@/components/ui/custom/reveal'
import type { ProcessContent, ProcessStep } from '@/types'

/**
 * "From shoot to frame": the studio's end-to-end story. On desktop the
 * section pins and vertical scroll pans the steps sideways; on mobile and
 * under reduced motion it becomes a native swipeable row.
 */
export default function Process({ content }: { content: ProcessContent }) {
  const reduce = useReducedMotion()
  return (
    <section className="border-t border-line">
      {reduce ? null : <PinnedPan content={content} />}
      <div className={reduce ? 'block' : 'md:hidden'}>
        <SwipeRow content={content} />
      </div>
    </section>
  )
}

function PinnedPan({ content }: { content: ProcessContent }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return
      setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth))
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (trackRef.current) observer.observe(trackRef.current)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div ref={sectionRef} className="relative hidden md:block" style={{ height: `calc(100dvh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x }} className="flex w-max items-stretch gap-8 pr-[8vw] pl-[max(3rem,calc((100vw-1440px)/2+3rem))]">
          <div className="flex w-[32vw] max-w-md shrink-0 flex-col justify-center pr-8">
            <h2 className="font-display text-6xl leading-[1.02] lg:text-7xl">{content.heading}</h2>
            <p className="mt-8 text-lg leading-relaxed text-ash">{content.intro}</p>
          </div>
          {content.steps.map((step, i) => (
            <StepPanel key={step.title} step={step} index={i} />
          ))}
        </motion.div>
        <div className="container-site mt-12">
          <div className="relative h-px bg-line">
            <motion.div style={{ width: progress }} className="absolute inset-y-0 left-0 bg-gold" />
          </div>
        </div>
      </div>
    </div>
  )
}

function StepPanel({ step, index }: { step: ProcessStep; index: number }) {
  return (
    <article className="flex w-[34vw] max-w-[30rem] shrink-0 flex-col">
      <div className="relative h-[52dvh] overflow-hidden">
        <MediaImage image={step.image} fill sizes="34vw" />
      </div>
      <div className="mt-6 flex items-baseline gap-4">
        <span className="font-mono text-xs text-gold tabular-nums">{String(index + 1).padStart(2, '0')}</span>
        <div>
          <h3 className="font-display text-3xl italic">{step.title}</h3>
          <p className="mt-3 max-w-sm text-ash">{step.body}</p>
        </div>
      </div>
    </article>
  )
}

function SwipeRow({ content }: { content: ProcessContent }) {
  return (
    <div className="py-24">
      <Reveal className="container-site">
        <h2 className="font-display text-5xl leading-[1.05]">{content.heading}</h2>
        <p className="mt-6 max-w-md text-lg text-ash">{content.intro}</p>
      </Reveal>
      <ol className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none]">
        {content.steps.map((step, i) => (
          <li key={step.title} className="w-[78vw] max-w-sm shrink-0 snap-start">
            <MediaImage image={step.image} sizes="80vw" className="aspect-[4/5]" />
            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-mono text-xs text-gold tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="font-display text-2xl italic">{step.title}</h3>
                <p className="mt-2 text-ash">{step.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
