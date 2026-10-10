import { cn } from '@/lib/utils'
import type { SocialLinks as Socials } from '@/types'

const LABELS: Record<keyof Socials, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  x: 'X (Twitter)',
  facebook: 'Facebook',
}

/** Text links keep the editorial tone and avoid brand-icon licensing issues. */
export function SocialLinks({ socials, className }: { socials: Socials; className?: string }) {
  const entries = (Object.keys(LABELS) as Array<keyof Socials>).filter((key) => socials[key])
  if (entries.length === 0) return null
  return (
    <ul className={cn('flex flex-wrap gap-x-6 gap-y-2', className)}>
      {entries.map((key) => (
        <li key={key}>
          <a
            href={socials[key]}
            target="_blank"
            rel="noreferrer"
            className="link-underline text-sm text-ash transition-colors hover:text-paper"
          >
            {LABELS[key]}
          </a>
        </li>
      ))}
    </ul>
  )
}
