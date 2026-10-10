import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { getAdminSettings, updateSettings } from '@/server/functions/admin/settings'
import type { SettingsInput } from '@/lib/schemas/settings'

export const adminSettingsQuery = () =>
  queryOptions({
    queryKey: ['admin', 'settings'],
    queryFn: () => getAdminSettings(),
  })

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SettingsInput) => updateSettings({ data }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin'] }),
        queryClient.invalidateQueries({ queryKey: ['settings'] }),
        queryClient.invalidateQueries({ queryKey: ['packages'] }),
        queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
      ]),
  })
}
