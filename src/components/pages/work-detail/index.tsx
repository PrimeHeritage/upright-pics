import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import AlbumHeader from './album-header'
import Gallery from './gallery'
import Lightbox from './lightbox'
import { MediaImage } from '@/components/shared/media-image'
import { VideoEmbed } from '@/components/shared/video-embed'
import { Reveal } from '@/components/ui/custom/reveal'
import { CONTACT_CTA } from '@/constants/navigation'
import { albumQuery } from '@/hooks/api/portfolio'

interface WorkDetailProps {
  slug: string
  photo?: number
  onPhotoChange: (index: number | null) => void
}

export default function WorkDetail({ slug, photo, onPhotoChange }: WorkDetailProps) {
  const { data } = useSuspenseQuery(albumQuery(slug))
  const { album, category, next } = data

  const images = album.media.flatMap((m) =>
    m.kind === 'image' ? [{ ...m.image, caption: m.caption }] : [],
  )
  const videos = album.media.flatMap((m) => (m.kind === 'video' ? [m] : []))

  return (
    <>
      <AlbumHeader album={album} category={category} />

      <section className="container-site grid gap-10 py-20 md:grid-cols-12 md:gap-8 md:py-28">
        <Reveal className="md:col-span-7">
          <p className="font-display text-3xl leading-[1.25] md:text-[2.75rem]">{album.summary}</p>
        </Reveal>
        <Reveal delay={0.1} className="self-end md:col-span-4 md:col-start-9">
          {album.story ? <p className="text-lg leading-relaxed text-ash">{album.story}</p> : null}
          <Link
            to="/contact"
            className="link-underline mt-6 inline-flex items-center gap-2 text-paper/90"
          >
            {CONTACT_CTA}
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </section>

      {videos.length > 0 ? (
        <section className="container-site grid gap-6 pb-16 md:pb-24">
          {videos.map((v) => (
            <VideoEmbed key={v.id} url={v.videoUrl} poster={v.poster} title={v.caption ?? album.title} />
          ))}
        </section>
      ) : null}

      <Gallery images={images} onOpen={(i) => onPhotoChange(i)} />

      <Lightbox images={images} index={photo ?? null} onIndexChange={onPhotoChange} title={album.title} />

      {next ? (
        <Link
          to="/work/$slug"
          params={{ slug: next.slug }}
          className="group relative isolate flex min-h-[60dvh] items-end overflow-hidden border-t border-line"
        >
          <div className="absolute inset-0 -z-10 opacity-50 transition-opacity duration-700 group-hover:opacity-70">
            <MediaImage image={next.cover} fill sizes="100vw" imgClassName="group-hover:scale-[1.03] duration-[1.4s]" />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/50 to-ink/60" />
          <div className="container-site pb-14 md:pb-20">
            <p className="text-sm text-ash">Next album</p>
            <p className="mt-3 flex items-center gap-4 font-display text-5xl leading-none md:text-8xl">
              {next.title}
              <ArrowRight className="size-8 shrink-0 transition-transform duration-500 ease-out-expo group-hover:translate-x-3 md:size-12" strokeWidth={1.25} />
            </p>
          </div>
        </Link>
      ) : null}
    </>
  )
}
