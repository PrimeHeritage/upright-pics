import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import {
  findAboutContent,
  findContactContent,
  findHomeContent,
  findPageHeader,
  findSettings,
} from '@/server/repository'

export const getSettings = createServerFn({ method: 'GET' }).handler(() => findSettings())

export const getHomeContent = createServerFn({ method: 'GET' }).handler(() => findHomeContent())

export const getAboutContent = createServerFn({ method: 'GET' }).handler(() => findAboutContent())

export const getContactContent = createServerFn({ method: 'GET' }).handler(() =>
  findContactContent(),
)

export const getPageHeader = createServerFn({ method: 'GET' })
  .validator(z.object({ page: z.enum(['work', 'services']) }))
  .handler(({ data }) => findPageHeader(data.page))
