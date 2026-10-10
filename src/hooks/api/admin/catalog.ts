import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import type { QueryKey } from '@tanstack/react-query'

import {
  createCategory,
  deleteCategory,
  listCategories,
  reorderCategories,
  updateCategory,
} from '@/server/functions/admin/categories'
import {
  createPackage,
  deletePackage,
  listPackages,
  reorderPackages,
  setPackageVisibility,
  updatePackage,
} from '@/server/functions/admin/packages'
import {
  createService,
  deleteService,
  listServices,
  reorderServices,
  setServiceVisibility,
  updateService,
} from '@/server/functions/admin/services'
import {
  createTestimonial,
  deleteTestimonial,
  listTestimonials,
  reorderTestimonials,
  setTestimonialVisibility,
  updateTestimonial,
} from '@/server/functions/admin/testimonials'

/** Invalidates the admin list plus the matching public queries after a change. */
function useInvalidate(keys: Array<QueryKey>) {
  const queryClient = useQueryClient()
  return () => Promise.all([...keys, ['admin', 'dashboard']].map((queryKey) => queryClient.invalidateQueries({ queryKey })))
}

/** Reorder with an optimistic update so drag-and-drop feels instant. */
function useReorder<TItem extends { id: string }>(
  queryKey: QueryKey,
  mutate: (ids: Array<string>) => Promise<unknown>,
  invalidate: () => Promise<unknown>,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (items: Array<TItem>) => mutate(items.map((i) => i.id)),
    onMutate: async (items) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<Array<TItem>>(queryKey)
      queryClient.setQueryData(queryKey, items)
      return { previous }
    },
    onError: (_err, _items, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous)
    },
    onSettled: invalidate,
  })
}

/* ---------- Categories ---------- */

const categoriesKey = ['admin', 'categories']
export const adminCategoriesQuery = () => queryOptions({ queryKey: categoriesKey, queryFn: () => listCategories() })
export type AdminCategory = Awaited<ReturnType<typeof listCategories>>[number]

export function useCategoryMutations() {
  const invalidate = useInvalidate([categoriesKey, ['categories'], ['albums'], ['album']])
  return {
    create: useMutation({ mutationFn: createCategory, onSuccess: invalidate }),
    update: useMutation({ mutationFn: updateCategory, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: deleteCategory, onSuccess: invalidate }),
    reorder: useReorder<AdminCategory>(categoriesKey, (ids) => reorderCategories({ data: { ids } }), invalidate),
  }
}

/* ---------- Services ---------- */

const servicesKey = ['admin', 'services']
export const adminServicesQuery = () => queryOptions({ queryKey: servicesKey, queryFn: () => listServices() })
export type AdminService = Awaited<ReturnType<typeof listServices>>[number]

export function useServiceMutations() {
  const invalidate = useInvalidate([servicesKey, ['services']])
  return {
    create: useMutation({ mutationFn: createService, onSuccess: invalidate }),
    update: useMutation({ mutationFn: updateService, onSuccess: invalidate }),
    setVisible: useMutation({ mutationFn: setServiceVisibility, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: deleteService, onSuccess: invalidate }),
    reorder: useReorder<AdminService>(servicesKey, (ids) => reorderServices({ data: { ids } }), invalidate),
  }
}

/* ---------- Packages ---------- */

const packagesKey = ['admin', 'packages']
export const adminPackagesQuery = () => queryOptions({ queryKey: packagesKey, queryFn: () => listPackages() })
export type AdminPackage = Awaited<ReturnType<typeof listPackages>>[number]

export function usePackageMutations() {
  const invalidate = useInvalidate([packagesKey, ['packages']])
  return {
    create: useMutation({ mutationFn: createPackage, onSuccess: invalidate }),
    update: useMutation({ mutationFn: updatePackage, onSuccess: invalidate }),
    setVisible: useMutation({ mutationFn: setPackageVisibility, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: deletePackage, onSuccess: invalidate }),
    reorder: useReorder<AdminPackage>(packagesKey, (ids) => reorderPackages({ data: { ids } }), invalidate),
  }
}

/* ---------- Testimonials ---------- */

const testimonialsKey = ['admin', 'testimonials']
export const adminTestimonialsQuery = () => queryOptions({ queryKey: testimonialsKey, queryFn: () => listTestimonials() })
export type AdminTestimonial = Awaited<ReturnType<typeof listTestimonials>>[number]

export function useTestimonialMutations() {
  const invalidate = useInvalidate([testimonialsKey, ['testimonials']])
  return {
    create: useMutation({ mutationFn: createTestimonial, onSuccess: invalidate }),
    update: useMutation({ mutationFn: updateTestimonial, onSuccess: invalidate }),
    setVisible: useMutation({ mutationFn: setTestimonialVisibility, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: deleteTestimonial, onSuccess: invalidate }),
    reorder: useReorder<AdminTestimonial>(testimonialsKey, (ids) => reorderTestimonials({ data: { ids } }), invalidate),
  }
}
