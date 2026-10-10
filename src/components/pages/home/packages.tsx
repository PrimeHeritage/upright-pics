import { PackagesList } from '@/components/shared/packages-list'
import { PageSection } from '@/components/ui/custom/page-section'
import { Reveal } from '@/components/ui/custom/reveal'
import type { Package, Service } from '@/types'

export default function Packages({
  packages,
  services,
}: {
  packages: Array<Package>
  services: Array<Service>
}) {
  if (packages.length === 0) return null
  return (
    <PageSection spacing="md" className="border-t border-line">
      <Reveal className="mb-12 max-w-2xl md:mb-16">
        <h2 className="font-display text-5xl leading-none md:text-6xl">Packages</h2>
        <p className="mt-6 text-lg text-ash">
          A starting point for the most requested bookings. Every quote is tailored to your day.
        </p>
      </Reveal>
      <PackagesList packages={packages} services={services} />
    </PageSection>
  )
}
