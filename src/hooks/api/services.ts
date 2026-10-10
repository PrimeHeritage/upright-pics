import { queryOptions, useMutation } from '@tanstack/react-query'

import { submitInquiry } from '@/server/functions/inquiries'
import { getPackages, getServices, getTestimonials } from '@/server/functions/services'
import type { InquiryInput } from '@/lib/schemas/inquiry'

const FIVE_MINUTES = 5 * 60 * 1000

export const servicesQuery = () =>
  queryOptions({
    queryKey: ['services'],
    queryFn: () => getServices(),
    staleTime: FIVE_MINUTES,
  })

export const packagesQuery = () =>
  queryOptions({
    queryKey: ['packages'],
    queryFn: () => getPackages(),
    staleTime: FIVE_MINUTES,
  })

export const testimonialsQuery = () =>
  queryOptions({
    queryKey: ['testimonials'],
    queryFn: () => getTestimonials(),
    staleTime: FIVE_MINUTES,
  })

export function useSubmitInquiry() {
  return useMutation({
    mutationFn: (data: InquiryInput) => submitInquiry({ data }),
  })
}
