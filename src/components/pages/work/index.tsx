import { useSuspenseQuery } from '@tanstack/react-query'

import AlbumGrid from './album-grid'
import CategoryFilter from './category-filter'
import { RevealWords } from '@/components/ui/custom/reveal'
import { albumsQuery, categoriesQuery } from '@/hooks/api/portfolio'
import { pageHeaderQuery } from '@/hooks/api/site'

export default function Work({ category }: { category?: string }) {
  const { data: header } = useSuspenseQuery(pageHeaderQuery('work'))
  const { data: categories } = useSuspenseQuery(categoriesQuery())
  const { data: albums } = useSuspenseQuery(albumsQuery({ category }))

  return (
    <>
      <section className="container-site pt-20 pb-12 md:pt-28 md:pb-16">
        <h1 className="font-display text-6xl leading-none md:text-8xl lg:text-9xl">
          <RevealWords text={header.heading} />
        </h1>
        <p className="mt-8 max-w-lg text-lg text-ash">{header.body}</p>
      </section>
      <CategoryFilter categories={categories} active={category} />
      <AlbumGrid albums={albums} categories={categories} />
    </>
  )
}
