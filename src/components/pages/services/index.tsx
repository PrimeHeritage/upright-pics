import { useSuspenseQuery } from '@tanstack/react-query'

import ServiceList from './service-list'
import { PackagesList } from '@/components/shared/packages-list'
import { PageSection } from '@/components/ui/custom/page-section'
import { Reveal, RevealWords } from '@/components/ui/custom/reveal'
import { packagesQuery, servicesQuery } from '@/hooks/api/services'
import { pageHeaderQuery } from '@/hooks/api/site'

export default function Services() {
  const { data: header } = useSuspenseQuery(pageHeaderQuery('services'))
  const { data: services } = useSuspenseQuery(servicesQuery())
  const { data: packages } = useSuspenseQuery(packagesQuery())

  return (
    <>
      <section className="container-site pt-20 pb-16 md:pt-28 md:pb-24">
        <h1 className="font-display text-6xl leading-none md:text-8xl lg:text-9xl">
          <RevealWords text={header.heading} />
        </h1>
        <p className="mt-8 max-w-lg text-lg text-ash">{header.body}</p>
      </section>

      <ServiceList services={services} />

      {packages.length > 0 ? (
        <PageSection spacing="md" className="border-t border-line" id="packages">
          <Reveal className="mb-12 max-w-2xl md:mb-16">
            <h2 className="font-display text-5xl leading-none md:text-6xl">Packages</h2>
            <p className="mt-6 text-lg text-ash">
              Starting points for the most requested bookings. Tell us what you need and we will tailor a quote.
            </p>
          </Reveal>
          <PackagesList packages={packages} services={services} />
        </PageSection>
      ) : null}
    </>
  )
}
