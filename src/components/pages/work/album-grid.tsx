import { Link } from '@tanstack/react-router'
import { Images } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import { Reveal } from '@/components/ui/custom/reveal'
import { formatMonthYear } from '@/lib/utils'
import type { AlbumSummary, Category } from '@/types'

/** Masonry via CSS columns so every cover keeps its natural aspect ratio. */
export default function AlbumGrid({
  albums,
  categories,
}: {
  albums: Array<AlbumSummary>
  categories: Array<Category>
}) {
  const categoryName = (id: string | null) => categories.find((c) => c.id === id)?.name

  if (albums.length === 0) {
    return (
      <section className="container-site flex min-h-[40dvh] flex-col items-start justify-center py-24">
        <Images className="size-8 text-smoke" strokeWidth={1.25} />
        <h2 className="mt-6 font-display text-3xl">Nothing here yet</h2>
        <p className="mt-3 max-w-sm text-ash">New albums in this category are on the way. Browse the rest of the work in the meantime.</p>
        <Link to="/work" className="link-underline mt-6 text-paper/90">
          See all work
        </Link>
      </section>
    )
  }

  return (
    <section className="container-site py-14 md:py-20">
      <ul className="columns-1 gap-6 sm:columns-2 lg:columns-3 lg:gap-8">
        {albums.map((album, i) => (
          <li key={album.id} className="mb-12 break-inside-avoid lg:mb-16">
            <Reveal delay={(i % 3) * 0.06} amount={0.15}>
              <Link to="/work/$slug" params={{ slug: album.slug }} className="group block">
                <div className="overflow-hidden">
                  <MediaImage
                    image={album.cover}
                    sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw"
                    imgClassName="group-hover:scale-[1.04] duration-[1.2s]"
                    maxWidth={1440}
                  />
                </div>
                <div className="mt-5">
                  <h2 className="font-display text-2xl transition-colors duration-300 group-hover:text-gold md:text-3xl">
                    {album.title}
                  </h2>
                  <p className="mt-2 flex flex-wrap gap-x-4 text-sm text-ash">
                    <span>{categoryName(album.categoryId)}</span>
                    {formatMonthYear(album.shotOn) ? <span>{formatMonthYear(album.shotOn)}</span> : null}
                    <span>{album.mediaCount} photos</span>
                  </p>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
