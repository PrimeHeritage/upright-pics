import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { Reveal } from '@/components/ui/custom/reveal'
import { CONTACT_CTA } from '@/constants/navigation'
import { cn } from '@/lib/utils'
import type { Package, Service } from '@/types'

/**
 * Packages as wide rows rather than a row of identical price cards. Renders
 * nothing when the owner has switched packages off (the query returns []).
 */
export function PackagesList({
  packages,
  services,
}: {
  packages: Array<Package>
  services: Array<Service>
}) {
  if (packages.length === 0) return null
  const serviceTitle = (id: string | null) => services.find((s) => s.id === id)?.title

  return (
    <ul className="border-t border-line">
      {packages.map((pkg, i) => (
        <li key={pkg.id}>
          <Reveal delay={i * 0.05}>
            <div
              className={cn(
                'relative grid gap-6 border-b border-line py-10 md:grid-cols-12 md:gap-8 md:py-12',
                pkg.highlighted && 'md:before:absolute md:before:inset-y-0 md:before:-left-6 md:before:w-px md:before:bg-gold',
              )}
            >
              <div className="md:col-span-4">
                <h3 className="font-display text-3xl md:text-4xl">
                  {pkg.name}
                  {pkg.highlighted ? <span className="ml-3 align-middle text-label text-gold">Full coverage</span> : null}
                </h3>
                {pkg.description ? <p className="mt-3 max-w-xs text-ash">{pkg.description}</p> : null}
              </div>
              <ul className="grid content-start gap-x-8 gap-y-2 text-paper/85 sm:grid-cols-2 md:col-span-5">
                {pkg.features.map((f) => (
                  <li key={f} className="flex gap-3 text-[0.95rem]">
                    <span className="mt-[0.6em] h-px w-3 shrink-0 bg-gold/70" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex items-end justify-between gap-6 md:col-span-3 md:flex-col md:items-end">
                {pkg.priceLabel ? (
                  <p className="font-display text-2xl md:text-3xl">{pkg.priceLabel}</p>
                ) : (
                  <p className="text-ash">Price on request</p>
                )}
                <Link
                  to="/contact"
                  search={{ service: serviceTitle(pkg.serviceId) }}
                  className="link-underline group inline-flex items-center gap-2 text-sm text-paper/90"
                >
                  {CONTACT_CTA}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
