import { Link } from '@tanstack/react-router'

import MobileMenu from './mobile-menu'
import { Logo } from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import { CONTACT_CTA, primaryNav } from '@/constants/navigation'
import type { SiteSettings } from '@/types'

export default function HeaderContent({ settings }: { settings: SiteSettings }) {
  return (
    <div className="container-site flex h-16 items-center justify-between md:h-[4.5rem]">
      <Logo settings={settings} />

      <nav aria-label="Primary" className="hidden items-center gap-10 md:flex">
        <ul className="flex items-center gap-8">
          {primaryNav.map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                className="link-underline py-1 text-sm text-paper/75 transition-colors hover:text-paper"
                activeProps={{ className: 'text-paper! bg-[length:100%_1px]!' }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Button asChild size="sm" className="h-9 px-4">
          <Link to="/contact">{CONTACT_CTA}</Link>
        </Button>
      </nav>

      <MobileMenu settings={settings} />
    </div>
  )
}
