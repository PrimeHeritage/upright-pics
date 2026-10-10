import { queryOptions } from '@tanstack/react-query'

import { getAlbum, getAlbums, getCategories } from '@/server/functions/portfolio'

const FIVE_MINUTES = 5 * 60 * 1000

export const categoriesQuery = () =>
  queryOptions({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
    staleTime: FIVE_MINUTES,
  })

export const albumsQuery = (filter: { category?: string; featured?: boolean } = {}) =>
  queryOptions({
    queryKey: ['albums', filter],
    queryFn: () => getAlbums({ data: filter }),
    staleTime: FIVE_MINUTES,
  })

export const albumQuery = (slug: string) =>
  queryOptions({
    queryKey: ['album', slug],
    queryFn: () => getAlbum({ data: { slug } }),
    staleTime: FIVE_MINUTES,
  })
