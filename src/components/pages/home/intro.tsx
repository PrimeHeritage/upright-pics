import { useRef } from 'react'
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'

import { MediaImage } from '@/components/shared/media-image'
import { PageSection } from '@/components/ui/custom/page-section'
import { Reveal } from '@/components/ui/custom/reveal'
import type { IntroContent } from '@/types'

/** Statement that "develops" word by word as it scrolls through the viewport. */
export default function Intro({ content }: { content: IntroContent }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const words = content.statement.split(' ')

  return (
    <PageSection spacing="lg">
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        <p
          ref={ref}
          className="font-display text-[2rem] leading-[1.18] tracking-[-0.02em] md:col-span-11 md:text-5xl lg:text-[4rem]"
        >
          {words.map((word, i) => (
            <Word
              key={`${word}-${i}`}
              progress={scrollYProgress}
              range={[i / words.length, (i + 1) / words.length]}
              still={!!reduce}
            >
              {word}
            </Word>
          ))}
        </p>

        <div className="grid gap-10 md:col-span-12 md:grid-cols-12 md:gap-8">
          {content.image ? (
            <Reveal className="md:col-span-4 md:col-start-2">
              <MediaImage
                image={content.image}
                sizes="(min-width: 768px) 30vw, 100vw"
                className="aspect-[4/5]"
              />
            </Reveal>
          ) : null}
          <Reveal delay={0.1} className="self-end md:col-span-5 md:col-start-7">
            <p className="text-lg leading-relaxed text-ash md:text-xl">{content.body}</p>
          </Reveal>
        </div>
      </div>
    </PageSection>
  )
}

function Word({
  children,
  progress,
  range,
  still,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
  still: boolean
}) {
  // Starts at #6b665f (3.46:1, AA for large text) so the copy stays readable before it "develops".
  const color = useTransform(progress, range, ['#6b665f', '#eae6df'])
  return (
    <>
      <m.span style={{ color: still ? undefined : color }}>{children}</m.span>{' '}
    </>
  )
}
