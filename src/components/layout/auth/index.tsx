import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { MediaImage } from '@/components/shared/media-image'
import { seedImages } from '@/lib/seed/images'

/** Split layout for admin sign-in screens: form on the left, a photograph on the right. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col px-5 py-8 md:px-12">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="block size-9 overflow-hidden rounded-full ring-1 ring-gold/30">
              <img
                src="/brand/upc-logo.jpg"
                alt=""
                className="size-full origin-[50%_8%] scale-[1.55] object-cover object-[50%_5%]"
              />
            </span>
            <span className="font-display text-lg">Upright Studio</span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-ash hover:text-paper">
            <ArrowLeft className="size-4" /> Website
          </Link>
        </div>
        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-16">{children}</main>
        <p className="text-xs text-smoke">Admin area for Upright Pictures Concepts.</p>
      </div>
      <div className="relative hidden lg:block">
        <MediaImage image={seedImages.blackSuit} fill priority sizes="55vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/20 to-transparent" />
      </div>
    </div>
  )
}
