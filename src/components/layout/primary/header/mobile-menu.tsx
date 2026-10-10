import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { m } from 'motion/react'

import { SocialLinks } from '@/components/shared/social-links'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { CONTACT_CTA, primaryNav } from '@/constants/navigation'
import { formatPhone, telLink } from '@/lib/utils'
import type { SiteSettings } from '@/types'

const links = [...primaryNav, { label: CONTACT_CTA, to: '/contact' as const }]

export default function MobileMenu({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="-mr-2 flex h-10 items-center gap-3 px-2 text-sm text-paper md:hidden"
        aria-label="Open menu"
      >
        Menu
        <span className="flex w-6 flex-col gap-1.5" aria-hidden>
          <span className="h-px w-full bg-paper" />
          <span className="h-px w-2/3 self-end bg-paper" />
        </span>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="h-[100dvh] border-none bg-ink px-5 pt-24 pb-10 [&>button]:top-5 [&>button]:right-5 [&>button>svg]:size-6"
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <nav aria-label="Mobile" className="flex flex-1 flex-col">
          <ul className="flex flex-col gap-2">
            {links.map((item, i) => (
              <m.li
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                animate={open ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block py-1 font-display text-5xl leading-tight text-paper/85 transition-colors hover:text-gold"
                  activeProps={{ className: 'text-paper! italic' }}
                >
                  {item.label}
                </Link>
              </m.li>
            ))}
          </ul>
          <div className="mt-auto space-y-5 border-t border-line pt-8">
            {settings.phones[0] ? (
              <a href={telLink(settings.phones[0])} className="block text-lg">
                {formatPhone(settings.phones[0])}
              </a>
            ) : null}
            <a href={`mailto:${settings.email}`} className="block break-all text-ash">
              {settings.email}
            </a>
            <SocialLinks socials={settings.socials} />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
