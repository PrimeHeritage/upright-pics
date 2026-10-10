import { m, useReducedMotion } from 'motion/react'
import type { HTMLMotionProps } from 'motion/react'

const EASE = [0.16, 1, 0.3, 1] as const

interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number
  y?: number
  amount?: number
}

/** Fades content up once as it enters the viewport. Static under reduced motion. */
export function Reveal({ delay = 0, y = 28, amount = 0.25, children, ...props }: RevealProps) {
  const reduce = useReducedMotion()
  return (
    <m.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      {...props}
    >
      {children}
    </m.div>
  )
}

/**
 * Splits a line of display text into words that rise in sequence. Pure CSS so
 * headlines animate from first paint without waiting for JavaScript.
 */
export function RevealWords({
  text,
  className,
  delay = 0,
  stagger = 0.06,
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
}) {
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <span
            className="inline-block"
            style={{ animation: `word-rise 1s var(--ease-out-expo) ${delay + i * stagger}s both` }}
          >
            {word}
            {i < words.length - 1 ? '\u00a0' : ''}
          </span>
        </span>
      ))}
    </span>
  )
}
