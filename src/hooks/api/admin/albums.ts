import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import {
  addPhotos,
  addVideo,
  createAlbum,
  deleteAlbum,
  deleteMedia,
  getAdminAlbum,
  listAdminAlbums,
  reorderAlbums,
  reorderMedia,
  setAlbumCover,
  setAlbumFlags,
  updateAlbumDetails,
  updateMedia,
} from '@/server/functions/admin/albums'

export const adminAlbumsQuery = () =>
  queryOptions({ queryKey: ['admin', 'albums'], queryFn: () => listAdminAlbums() })

export const adminAlbumQuery = (id: string) =>
  queryOptions({ queryKey: ['admin', 'album', id], queryFn: () => getAdminAlbum({ data: { id } }) })

export type AdminAlbumRow = Awaited<ReturnType<typeof listAdminAlbums>>[number]
export type AdminAlbum = Awaited<ReturnType<typeof getAdminAlbum>>

function useInvalidateAlbums() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all(
      [['admin', 'albums'], ['admin', 'album'], ['admin', 'dashboard'], ['admin', 'categories'], ['albums'], ['album']].map(
        (queryKey) => queryClient.invalidateQueries({ queryKey }),
      ),
    )
}

export function useAlbumMutations() {
  const queryClient = useQueryClient()
  const invalidate = useInvalidateAlbums()
  return {
    create: useMutation({ mutationFn: createAlbum, onSuccess: invalidate }),
    updateDetails: useMutation({ mutationFn: updateAlbumDetails, onSuccess: invalidate }),
    setFlags: useMutation({ mutationFn: setAlbumFlags, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: deleteAlbum, onSuccess: invalidate }),
    reorder: useMutation({
      mutationFn: (rows: Array<AdminAlbumRow>) => reorderAlbums({ data: { ids: rows.map((r) => r.id) } }),
      onMutate: async (rows) => {
        await queryClient.cancelQueries({ queryKey: ['admin', 'albums'] })
        const previous = queryClient.getQueryData<Array<AdminAlbumRow>>(['admin', 'albums'])
        queryClient.setQueryData(['admin', 'albums'], rows)
        return { previous }
      },
      onError: (_e, _v, ctx) => ctx?.previous && queryClient.setQueryData(['admin', 'albums'], ctx.previous),
      onSettled: invalidate,
    }),
  }
}

export function useMediaMutations(albumId: string) {
  const queryClient = useQueryClient()
  const invalidate = useInvalidateAlbums()
  const key = ['admin', 'album', albumId]
  return {
    addPhotos: useMutation({ mutationFn: addPhotos, onSuccess: invalidate }),
    addVideo: useMutation({ mutationFn: addVideo, onSuccess: invalidate }),
    update: useMutation({ mutationFn: updateMedia, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: deleteMedia, onSuccess: invalidate }),
    setCover: useMutation({ mutationFn: setAlbumCover, onSuccess: invalidate }),
    reorder: useMutation({
      mutationFn: (media: AdminAlbum['media']) => reorderMedia({ data: { albumId, ids: media.map((m) => m.id) } }),
      onMutate: async (media) => {
        await queryClient.cancelQueries({ queryKey: key })
        const previous = queryClient.getQueryData<AdminAlbum>(key)
        if (previous) queryClient.setQueryData(key, { ...previous, media })
        return { previous }
      },
      onError: (_e, _v, ctx) => ctx?.previous && queryClient.setQueryData(key, ctx.previous),
      onSettled: invalidate,
    }),
  }
}
