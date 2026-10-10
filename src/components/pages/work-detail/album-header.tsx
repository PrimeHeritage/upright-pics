import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import { RevealWords } from '@/components/ui/custom/reveal'
import { formatMonthYear } from '@/lib/utils'
import type { Album, Category } from '@/types'

export default function AlbumHeader({ album, category }: { album: Album; category: Category | null }) {
  const photoCount = album.media.filter((m) => m.kind === 'image').length
  const meta = [
    category?.name,
    album.location,
    formatMonthYear(album.shotOn),
    `${photoCount} photos`,
  ].filter(Boolean)

  return (
    <section className="relative isolate flex min-h-[88dvh] items-end overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <MediaImage image={album.cover} fill priority sizes="100vw" imgClassName="object-[50%_30%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/30" />
      </div>
      <div className="container-site pt-32 pb-12 md:pb-16">
        <Link
          to="/work"
          className="link-underline group mb-10 inline-flex items-center gap-2 text-sm text-paper/80 hover:text-paper"
        >
          <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
          All work
        </Link>
        <h1 className="max-w-5xl font-display text-5xl leading-[1.02] md:text-8xl">
          <RevealWords text={album.title} />
        </h1>
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-paper/75">
          {meta.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
