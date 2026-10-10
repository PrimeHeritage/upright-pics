/**
 * Cloudinary helpers. Server-only (uses the API secret).
 *
 * Uploads go straight from the admin's browser to Cloudinary using a short-
 * lived signature from `signUpload`, so large files never pass through our
 * server. Deletions happen here when media or albums are removed.
 */
import { v2 as cloudinary } from 'cloudinary'

import { requireServerEnv } from '@/server/env'

export const CLOUDINARY_ROOT = 'upc'

let configured = false

function client() {
  if (!configured) {
    cloudinary.config({
      cloud_name: requireServerEnv('VITE_CLOUDINARY_CLOUD_NAME'),
      api_key: requireServerEnv('CLOUDINARY_API_KEY'),
      api_secret: requireServerEnv('CLOUDINARY_API_SECRET'),
      secure: true,
    })
    configured = true
  }
  return cloudinary
}

export interface SignedUpload {
  cloudName: string
  apiKey: string
  timestamp: number
  signature: string
  folder: string
}

/** Signs a direct browser upload into `upc/<folder>`. Valid for about an hour. */
export function signUpload(folder: string): SignedUpload {
  const c = client()
  const timestamp = Math.round(Date.now() / 1000)
  const target = `${CLOUDINARY_ROOT}/${folder.replace(/[^a-z0-9/_-]/gi, '')}`
  const signature = c.utils.api_sign_request(
    { timestamp, folder: target },
    requireServerEnv('CLOUDINARY_API_SECRET'),
  )
  return {
    cloudName: requireServerEnv('VITE_CLOUDINARY_CLOUD_NAME'),
    apiKey: requireServerEnv('CLOUDINARY_API_KEY'),
    timestamp,
    signature,
    folder: target,
  }
}

/** Deletes uploaded images. Ignores ids outside our folder or already gone. */
export async function destroyImages(publicIds: Array<string | null | undefined>) {
  const ids = publicIds.filter((id): id is string => !!id && id.startsWith(`${CLOUDINARY_ROOT}/`))
  if (ids.length === 0) return
  await client().api.delete_resources(ids, { resource_type: 'image', invalidate: true })
}

export async function pingCloudinary() {
  return client().api.ping()
}
