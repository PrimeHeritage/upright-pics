import { useState } from 'react'
import { Play } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import { parseVideoUrl, videoEmbedUrl, videoThumbnail } from '@/lib/media'
import { cn } from '@/lib/utils'
import type { ImageAsset } from '@/types'

/**
 * Click-to-play YouTube/Vimeo facade: shows a poster and only mounts the
 * iframe after the visitor asks for it, keeping pages light.
 */
export function VideoEmbed({
  url,
  poster,
  title,
  className,
}: {
  url: string
  poster?: ImageAsset | null
  title: string
  className?: string
}) {
  const [playing, setPlaying] = useState(false)
  const source = parseVideoUrl(url)
  if (!source) return null

  const thumb = videoThumbnail(source)

  return (
    <div className={cn('relative aspect-video overflow-hidden bg-surface-2', className)}>
      {playing ? (
        <iframe
          src={videoEmbedUrl(source)}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 size-full text-left"
          aria-label={`Play video: ${title}`}
        >
          {poster ? (
            <MediaImage image={poster} fill sizes="100vw" />
          ) : thumb ? (
            <img src={thumb} alt="" className="absolute inset-0 size-full object-cover" loading="lazy" />
          ) : null}
          <span className="absolute inset-0 bg-ink/30 transition-colors duration-500 group-hover:bg-ink/10" />
          <span className="absolute top-1/2 left-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-paper/40 bg-ink/40 backdrop-blur-sm transition-transform duration-500 ease-out-expo group-hover:scale-110 md:size-24">
            <Play className="ml-1 size-6 fill-paper text-paper" strokeWidth={1.5} />
          </span>
        </button>
      )}
    </div>
  )
}
