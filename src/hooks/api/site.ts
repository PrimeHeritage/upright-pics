import { queryOptions } from '@tanstack/react-query'

import {
  getAboutContent,
  getContactContent,
  getHomeContent,
  getPageHeader,
  getSettings,
} from '@/server/functions/site'

const FIVE_MINUTES = 5 * 60 * 1000

export const settingsQuery = () =>
  queryOptions({
    queryKey: ['settings'],
    queryFn: () => getSettings(),
    staleTime: FIVE_MINUTES,
  })

export const homeContentQuery = () =>
  queryOptions({
    queryKey: ['content', 'home'],
    queryFn: () => getHomeContent(),
    staleTime: FIVE_MINUTES,
  })

export const aboutContentQuery = () =>
  queryOptions({
    queryKey: ['content', 'about'],
    queryFn: () => getAboutContent(),
    staleTime: FIVE_MINUTES,
  })

export const contactContentQuery = () =>
  queryOptions({
    queryKey: ['content', 'contact'],
    queryFn: () => getContactContent(),
    staleTime: FIVE_MINUTES,
  })

export const pageHeaderQuery = (page: 'work' | 'services') =>
  queryOptions({
    queryKey: ['content', 'header', page],
    queryFn: () => getPageHeader({ data: { page } }),
    staleTime: FIVE_MINUTES,
  })
