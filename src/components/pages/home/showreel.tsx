import { useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight, Play } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import { VideoEmbed } from '@/components/shared/video-embed'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Reveal } from '@/components/ui/custom/reveal'
import { parseVideoUrl } from '@/lib/media'
import type { ShowreelContent } from '@/types'

/**
 * Full-bleed cinematic still that slowly settles as you scroll. When the owner
 * adds a YouTube/Vimeo link in the admin, a play button opens the film.
 */
export default function Showreel({ content }: { content: ShowreelContent }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1])
  const hasVideo = Boolean(content.videoUrl && parseVideoUrl(content.videoUrl))

  return (
    <section ref={ref} className="relative isolate flex min-h-[90dvh] items-end overflow-hidden">
      <m.div className="absolute inset-0 -z-10" style={{ scale: reduce ? 1 : scale }}>
        <MediaImage image={content.poster} fill sizes="100vw" />
      </m.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/30 to-ink/40" />

      <div className="container-site flex w-full flex-col gap-10 pt-32 pb-16 md:flex-row md:items-end md:justify-between md:pb-20">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-5xl leading-[1.02] md:text-8xl">{content.heading}</h2>
          <p className="mt-6 max-w-md text-lg text-paper/80">{content.caption}</p>
        </Reveal>

        {hasVideo ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group flex items-center gap-4 self-start md:self-end"
          >
            <span className="flex size-20 items-center justify-center rounded-full border border-paper/40 bg-ink/30 backdrop-blur-sm transition-transform duration-500 ease-out-expo group-hover:scale-110">
              <Play className="ml-1 size-6 fill-paper" strokeWidth={1.5} />
            </span>
            <span className="text-sm">Play the film</span>
          </button>
        ) : (
          <Link
            to="/work"
            search={{ category: 'aerial' }}
            className="link-underline group inline-flex items-center gap-1 self-start text-paper/90 md:self-end"
          >
            See aerial work
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        )}
      </div>

      {hasVideo ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-[min(92vw,1280px)] border-none bg-ink p-0 sm:max-w-[min(92vw,1280px)]">
            <DialogTitle className="sr-only">{content.heading}</DialogTitle>
            {open ? <VideoEmbed url={content.videoUrl} poster={content.poster} title={content.heading} /> : null}
          </DialogContent>
        </Dialog>
      ) : null}
    </section>
  )
}
