import { Link } from '@tanstack/react-router'

import { Logo } from '@/components/shared/logo'
import { SocialLinks } from '@/components/shared/social-links'
import { CONTACT_CTA, primaryNav } from '@/constants/navigation'
import { formatPhone, telLink, whatsappLink } from '@/lib/utils'
import type { SiteSettings } from '@/types'

export default function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear()
  const links = [...primaryNav, { label: CONTACT_CTA, to: '/contact' as const }]

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink">
      <div className="container-site grid gap-14 pt-20 pb-12 md:grid-cols-12 md:gap-8 md:pt-28">
        <div className="md:col-span-5">
          <Logo settings={settings} />
          <p className="mt-8 max-w-sm font-display text-2xl leading-snug text-paper/90 italic">
            {settings.tagline}
          </p>
          {settings.footerNote ? (
            <p className="mt-4 max-w-sm text-sm text-ash">{settings.footerNote}</p>
          ) : null}
        </div>

        <nav aria-label="Footer" className="md:col-span-2">
          <p className="text-label text-smoke">Explore</p>
          <ul className="mt-5 space-y-3">
            {links.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="link-underline text-paper/80 hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="text-label text-smoke">Contact</p>
          <ul className="mt-5 space-y-3 text-paper/80">
            {settings.phones.map((phone) => (
              <li key={phone}>
                <a href={telLink(phone)} className="link-underline hover:text-paper">
                  {formatPhone(phone)}
                </a>
              </li>
            ))}
            {settings.whatsapp ? (
              <li>
                <a
                  href={whatsappLink(settings.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline hover:text-paper"
                >
                  WhatsApp
                </a>
              </li>
            ) : null}
            <li>
              <a href={`mailto:${settings.email}`} className="link-underline break-all hover:text-paper">
                {settings.email}
              </a>
            </li>
            <li className="text-ash">{settings.location}</li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="text-label text-smoke">Follow</p>
          <SocialLinks socials={settings.socials} className="mt-5 flex-col gap-y-3" />
        </div>
      </div>

      <div className="container-site" aria-hidden>
        <p className="font-display text-[22vw] leading-[0.8] tracking-[-0.04em] text-paper/[0.04] select-none md:text-[17vw]">
          Upright
        </p>
      </div>

      <div className="container-site flex flex-col gap-2 border-t border-line py-6 text-xs text-smoke md:flex-row md:justify-between">
        <p>
          © {year} {settings.businessName}. All rights reserved.
        </p>
        <p>Photography, film and framing in {settings.location.split(',')[0]}.</p>
      </div>
    </footer>
  )
}
