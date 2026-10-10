import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import { PageSection } from '@/components/ui/custom/page-section'
import { Reveal } from '@/components/ui/custom/reveal'
import { cn } from '@/lib/utils'
import type { AlbumSummary, Category } from '@/types'

/**
 * Editorial, asymmetric placement for up to six featured albums. Most of the
 * work is portrait orientation, so tall frames dominate the rhythm.
 */
const LAYOUT = [
  { cell: 'md:col-span-7', frame: 'aspect-[4/5]', sizes: '(min-width: 768px) 55vw, 100vw' },
  { cell: 'md:col-span-4 md:col-start-9 md:mt-40', frame: 'aspect-[3/4]', sizes: '(min-width: 768px) 32vw, 100vw' },
  { cell: 'md:col-span-4 md:col-start-2 md:-mt-12', frame: 'aspect-[3/4]', sizes: '(min-width: 768px) 32vw, 100vw' },
  { cell: 'md:col-span-6 md:col-start-7 md:mt-24', frame: 'aspect-[4/3]', sizes: '(min-width: 768px) 48vw, 100vw' },
  { cell: 'md:col-span-5', frame: 'aspect-[4/5]', sizes: '(min-width: 768px) 40vw, 100vw' },
  { cell: 'md:col-span-5 md:col-start-8 md:mt-48', frame: 'aspect-[3/4]', sizes: '(min-width: 768px) 40vw, 100vw' },
]

export default function SelectedWork({
  albums,
  categories,
}: {
  albums: Array<AlbumSummary>
  categories: Array<Category>
}) {
  const items = albums.slice(0, LAYOUT.length)
  if (items.length === 0) return null
  const categoryName = (id: string | null) => categories.find((c) => c.id === id)?.name

  return (
    <PageSection spacing="md" className="pt-0 md:pt-0">
      <div className="mb-14 flex items-end justify-between gap-6 md:mb-20">
        <Reveal>
          <h2 className="font-display text-5xl leading-none md:text-7xl">
            Selected <span className="italic">work</span>
          </h2>
        </Reveal>
        <Link
          to="/work"
          className="link-underline group mb-2 hidden shrink-0 items-center gap-1 text-sm text-paper/80 hover:text-paper sm:inline-flex"
        >
          All work
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <ul className="grid grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-8 md:gap-y-24">
        {items.map((album, i) => {
          const layout = LAYOUT[i]
          return (
            <li key={album.id} className={layout.cell}>
              <Reveal delay={(i % 2) * 0.08}>
                <Link
                  to="/work/$slug"
                  params={{ slug: album.slug }}
                  className="group block"
                  aria-label={`${album.title}, ${categoryName(album.categoryId) ?? 'album'}`}
                >
                  <div className={cn('relative overflow-hidden', layout.frame)}>
                    <MediaImage
                      image={album.cover}
                      fill
                      sizes={layout.sizes}
                      imgClassName="object-[50%_30%] group-hover:scale-[1.04] duration-[1.2s]"
                    />
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl transition-colors duration-300 group-hover:text-gold md:text-3xl">
                      {album.title}
                    </h3>
                    <span className="shrink-0 text-sm text-ash">{categoryName(album.categoryId)}</span>
                  </div>
                </Link>
              </Reveal>
            </li>
          )
        })}
      </ul>

      <div className="mt-16 sm:hidden">
        <Link to="/work" className="link-underline inline-flex items-center gap-1 text-paper/80">
          All work <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </PageSection>
  )
}
