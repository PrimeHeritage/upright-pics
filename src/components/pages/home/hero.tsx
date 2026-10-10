import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { ArrowRight } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import { Button } from '@/components/ui/button'
import { RevealWords } from '@/components/ui/custom/reveal'
import { cn } from '@/lib/utils'
import type { HeroContent } from '@/types'

const SLIDE_MS = 6500

export default function Hero({ content }: { content: HeroContent }) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const slides = content.slides
  const current = slides.at(index) ?? slides.at(0)

  useEffect(() => {
    if (slides.length < 2) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS)
    return () => window.clearTimeout(id)
  }, [index, slides.length])

  return (
    <section className="relative isolate flex min-h-[100dvh] flex-col justify-end overflow-hidden">
      {/* Image panel: full-bleed on mobile, right 60% on desktop */}
      <div className="absolute inset-0 -z-10 overflow-hidden md:left-[38%]">
        <AnimatePresence initial={false}>
          {current ? (
            <m.div
              key={current.src}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
            >
              <m.div
                className="absolute inset-0"
                initial={reduce ? false : { scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: SLIDE_MS / 1000 + 1.6, ease: 'linear' }}
              >
                <MediaImage
                  image={current}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 768px) 62vw, 100vw"
                  imgClassName="object-[50%_25%]"
                />
              </m.div>
            </m.div>
          ) : null}
        </AnimatePresence>
        {/* Scrims keep type legible over any photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10 md:bg-gradient-to-r md:from-ink md:via-ink/20 md:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink via-ink/80 to-transparent md:h-1/3 md:via-transparent" />
      </div>

      <div className="container-site relative pt-28 pb-12 md:pb-16 lg:pb-20">
        <h1 className="max-w-[12ch] font-display text-[3.4rem] leading-[1.02] tracking-[-0.03em] sm:text-7xl lg:text-[7.5rem]">
          <RevealWords text={content.headline} delay={0.15} />{' '}
          <span className="pb-2 text-gold italic">
            <RevealWords text={content.headlineEmphasis} delay={0.35} />
          </span>
        </h1>

        <div
          style={{ animationDelay: '0.5s' }}
          className="animate-fade-up mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-md">
            <p className="text-lg leading-relaxed text-paper/80 md:text-xl">{content.subheadline}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="group">
                <Link to="/work">
                  {content.primaryCta}
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-ink/30 backdrop-blur-sm">
                <Link to="/contact">{content.secondaryCta}</Link>
              </Button>
            </div>
          </div>

          {slides.length > 1 ? (
            <div className="flex gap-2" role="tablist" aria-label="Hero images">
              {slides.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show image ${i + 1}: ${slide.alt}`}
                  onClick={() => setIndex(i)}
                  className="group relative h-6 w-10 md:w-14"
                >
                  <span className="absolute inset-x-0 top-1/2 h-px bg-paper/25" />
                  <span
                    key={`${i}-${index}`}
                    className={cn(
                      'absolute top-1/2 left-0 h-px origin-left bg-paper',
                      i === index ? 'w-full animate-[hero-progress_linear_forwards]' : i < index ? 'w-full' : 'w-0',
                    )}
                    style={i === index ? { animationDuration: `${SLIDE_MS}ms` } : undefined}
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
