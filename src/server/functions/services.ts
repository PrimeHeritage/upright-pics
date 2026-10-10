import { createServerFn } from '@tanstack/react-start'

import { findPackages, findServices, findTestimonials } from '@/server/repository'

export const getServices = createServerFn({ method: 'GET' }).handler(() => findServices())

export const getPackages = createServerFn({ method: 'GET' }).handler(() => findPackages())

export const getTestimonials = createServerFn({ method: 'GET' }).handler(() => findTestimonials())
