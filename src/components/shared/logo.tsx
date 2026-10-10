import { Link } from '@tanstack/react-router'

import { cn } from '@/lib/utils'
import type { SiteSettings } from '@/types'

/**
 * Monogram + wordmark. The client's logo file sits on black, so it is blended
 * with `mix-blend-screen` to drop the background on the dark site.
 */
export function Logo({
  settings,
  className,
  showWordmark = true,
}: {
  settings: Pick<SiteSettings, 'businessName' | 'logo'>
  className?: string
  showWordmark?: boolean
}) {
  const [first, ...rest] = settings.businessName.split(' ')
  return (
    <Link
      to="/"
      aria-label={`${settings.businessName}, home`}
      className={cn('group inline-flex items-center gap-3', className)}
    >
      {settings.logo ? (
        <span className="block size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-gold/30 transition-transform duration-500 ease-out-expo group-hover:scale-105">
          <img
            src={settings.logo.src}
            alt=""
            width={40}
            height={42}
            className="size-full origin-[50%_8%] scale-[1.55] object-cover object-[50%_5%]"
          />
        </span>
      ) : null}
      {showWordmark ? (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.05rem] tracking-tight">{first}</span>
          <span className="text-label mt-1 text-[0.6rem] text-ash">{rest.join(' ')}</span>
        </span>
      ) : null}
    </Link>
  )
}
