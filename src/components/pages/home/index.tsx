import { useSuspenseQuery } from '@tanstack/react-query'

import Cta from './cta'
import Hero from './hero'
import Intro from './intro'
import Packages from './packages'
import Process from './process'
import SelectedWork from './selected-work'
import ServicesIndex from './services-index'
import Showreel from './showreel'
import Testimonials from './testimonials'
import { albumsQuery, categoriesQuery } from '@/hooks/api/portfolio'
import { packagesQuery, servicesQuery, testimonialsQuery } from '@/hooks/api/services'
import { homeContentQuery, settingsQuery } from '@/hooks/api/site'

export default function Home() {
  const { data: settings } = useSuspenseQuery(settingsQuery())
  const { data: content } = useSuspenseQuery(homeContentQuery())
  const { data: albums } = useSuspenseQuery(albumsQuery({ featured: true }))
  const { data: categories } = useSuspenseQuery(categoriesQuery())
  const { data: services } = useSuspenseQuery(servicesQuery())
  const { data: testimonials } = useSuspenseQuery(testimonialsQuery())
  const { data: packages } = useSuspenseQuery(packagesQuery())

  return (
    <>
      <Hero content={content.hero} />
      <Intro content={content.intro} />
      <SelectedWork albums={albums} categories={categories} />
      <ServicesIndex services={services} />
      <Process content={content.process} />
      <Showreel content={content.showreel} />
      <Testimonials testimonials={testimonials} />
      <Packages packages={packages} services={services} />
      <Cta content={content.cta} whatsapp={settings.whatsapp} businessName={settings.businessName} />
    </>
  )
}
